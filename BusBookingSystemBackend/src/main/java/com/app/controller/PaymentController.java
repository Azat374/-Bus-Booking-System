package com.app.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.ApiResponse;
import com.app.dto.BookingsDto;
import com.app.dto.OrderRequest;
import com.app.dto.SeatDto;
import com.app.service.BookingService;
import com.app.service.PaymentService;
import com.app.service.SeatService;
import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@RestController
@RequestMapping("/payment")

public class PaymentController {

	@Autowired
	private BookingService bookingService;
	@Autowired
	private PaymentService paymentService;
	@Autowired
	private SeatService seatService;
	@Value("${razorpay.key.id}")
	private String RAZORPAY_KEY_ID;
	@Value("${razorpay.key.secret}")
	private String RAZORPAY_KEY_SECRET;
	@Value("${stripe.api.key}")
	private String stripeApiKey;

	@PostMapping("/razorpay")
	public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
		try {
			RazorpayClient client = new RazorpayClient(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);
			JSONObject options = new JSONObject();
			options.put("amount", request.getAmount() * 100); // amount in paisa
			options.put("currency", "INR");
			options.put("receipt", "order_rcptid_" + System.currentTimeMillis());
			options.put("payment_capture", 1); // auto capture payment

			//Order order = client.orders.create(options);
			System.out.println("Order Details" + options);
			return ResponseEntity.ok().body(options.toString());
		} catch (RazorpayException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@PostMapping("/verify-payment")
	public ResponseEntity<?> verifyPayment(@RequestBody BookingsDto requestBody) {
		try {
			boolean paymentCaptured = verifyPaymentStatus(requestBody.getPaymentId());
			if (paymentCaptured) {
				// Payment is successful, proceed with storing data
				ApiResponse response = bookingService.addBooking(requestBody);

				List<Integer> seatNos = requestBody.getSeatPassengerList().stream().map(i -> i.getSeatNo())
						.collect(Collectors.toList());
				// remove from seat(temporary lock db)
				SeatDto seatDto = new SeatDto();
				seatDto.setBusId(requestBody.getBusId());
				seatDto.setSeatNos(seatNos);
				if (seatService.unlockSeat(seatDto))
					System.out.println("seat unlocked successfully ");
				if (response.getStatus() == HttpStatus.CREATED) {
					// Booking is successful
					return ResponseEntity.ok().body(Map.of("success", true,"id", response.getId()));
				} else {
					// Booking failed, initiate refund
					boolean refundInitiated = paymentService.initiateRefund(requestBody.getPaymentId(),
							requestBody.getFare(), "Booking failed");
					if (refundInitiated) {
						return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
								.body(Map.of("success", false, "message", "Booking failed. Refund initiated."));
					} else {
						return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
								.body(Map.of("success", false, "message", "Booking failed. Refund initiation failed."));
					}
				}
			} else {
				// Payment is not successful
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false));
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "Payment verification failed"));
		}
	}



	@PostMapping("/stripe")
	public ResponseEntity<?> createStripeCheckoutSession(@RequestBody OrderRequest orderRequest) {
		try {
			Stripe.apiKey = stripeApiKey;

			// Создаём параметры для сессии
			SessionCreateParams params = SessionCreateParams.builder()
					.addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
					.setMode(SessionCreateParams.Mode.PAYMENT)
					// Здесь нужно поставить свои URL success/cancel, доступные снаружи
					.setSuccessUrl("https://buy.stripe.com/test_14kdTpc1saeB0a43cc/checkout/success?session_id={CHECKOUT_SESSION_ID}")
					.setCancelUrl("https://buy.stripe.com/test_14kdTpc1saeB0a43cc/checkout/cancel")
					.addLineItem(
							SessionCreateParams.LineItem.builder()
									.setQuantity(1L)
									.setPriceData(
											SessionCreateParams.LineItem.PriceData.builder()
													.setCurrency("kzt")
													// Умножаем на 100, если нужны тиыны
													.setUnitAmount((long) orderRequest.getAmount() * 0)
													.setProductData(
															SessionCreateParams.LineItem.PriceData.ProductData.builder()
																	.setName("Dimash Bus Booking")
																	.build()
													)
													.build()
									)
									.build()
					)
					.build();

			// Создаём Stripe Checkout Session
			Session session = Session.create(params);

			// Возвращаем URL
			return ResponseEntity.ok(
					Collections.singletonMap("checkoutUrl", session.getUrl())
			);
		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(e.getMessage());
		}
	}

	@PostMapping("/stripe-verify")
	public ResponseEntity<?> stripeVerifyPayment(@RequestBody BookingsDto requestBody) {
		try {
			// В упрощённом варианте не проверяем статус Stripe, а сразу создаём бронь
			ApiResponse response = bookingService.addBooking(requestBody);

			// Если нужно, разблокируем места
			// ...

			if (response.getStatus() == HttpStatus.CREATED) {
				return ResponseEntity.ok(Map.of("success", true, "id", response.getId()));
			} else {
				return ResponseEntity.status(response.getStatus())
						.body(Map.of("success", false, "message", response.getMessage()));
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "Stripe payment verification failed"));
		}
	}


//	@PostMapping("/refund")
//    public ResponseEntity<?> initiateRefund(@RequestBody RefundRequest request) {
//        try {
//            boolean success = paymentService.initiateRefund(request.getPaymentId(),request.getAmount(), request.getReason());
//            if (success) {
//                return ResponseEntity.ok().body(Map.of("success", true));
//            } else {
//                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Refund failed"));
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("error", "Refund initiation failed"));
//        }
//    }

	private boolean verifyPaymentStatus(String paymentId) {
//		try {
//			RazorpayClient razorpayClient = new RazorpayClient(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);
//			Payment payment = razorpayClient.payments.fetch(paymentId);
//			String paymentStatus = payment.get("status");
//			return "captured".equals(paymentStatus);
//		} catch (RazorpayException e) {
//			e.printStackTrace();
//			// Handle exceptions
//			return false; // Return false in case of any error
//		}
		return true;
	}

}

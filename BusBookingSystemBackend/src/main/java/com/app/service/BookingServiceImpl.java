package com.app.service;

import java.io.ByteArrayOutputStream;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import com.app.dao.*;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import com.app.dto.ApiResponse;
import com.app.dto.BookingDetailsDto;
import com.app.dto.BookingsDto;
import com.app.dto.GetBookingDto;
import com.app.dto.GetBookings;
import com.app.dto.PassengerDto;
import com.app.dto.SeatPassengerDto;
import com.app.entities.Bookings;
import com.app.entities.Bus;
import com.app.entities.Passenger;
import com.app.entities.SeatAllocation;
import com.app.entities.User;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

	@Autowired
	private BookingsDao bookingDao;

	@Autowired
	private PassengerDao passengerDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private RouteDao routeDao;

	@Autowired
	private StationDao stationDao;

	@Autowired
	private BusDao busDao;

	@Autowired
	private SeatAllocationDao seatAllocationDao;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private DriverDao driverDao;


	@Override
	public ApiResponse addBooking(BookingsDto booking) {
		try {

			// Retrieve user and bus entities
			User user = userDao.findById(booking.getUserId()).orElseThrow(() -> new RuntimeException("User Not found"));
			Bus bus = busDao.findById(booking.getBusId()).orElseThrow(() -> new RuntimeException("Bus Not Found"));

			// Create a new booking entity
			Bookings newBooking = new Bookings();
			
			newBooking.setPaymentId(booking.getPaymentId());
			newBooking.setRazorpayOrderId(booking.getRazorpayOrderId());
			newBooking.setRazorpaySignature(booking.getRazorpaySignature());
			newBooking.setBookingDateTime(LocalDateTime.now());
			newBooking.setUser(user);
			newBooking.setBus(bus);
			newBooking.setFare(booking.getFare());

			// Iterate through seat-passenger list to save passengers and validate seat
			// allocations
			for (SeatPassengerDto seatPassenger : booking.getSeatPassengerList()) {
				int seatNo = seatPassenger.getSeatNo();
				// Check if the seat is already allocated
				boolean isSeatAllocated = seatAllocationDao.existsByBusAndSeatNo(bus, seatNo);
				if (isSeatAllocated) {
					return new ApiResponse("Seat " + seatNo + " is already allocated.", HttpStatus.BAD_REQUEST);
				}
				// Map DTO to entity for passenger
				Passenger passenger = mapDtoToEntity(seatPassenger.getPassenger());
				// Save the passenger entity
				Passenger savedPassenger = passengerDao.save(passenger);

				// Create seat allocation for the booking
				SeatAllocation seatAllocation = new SeatAllocation();
				seatAllocation.setSeatNo(seatNo);
				seatAllocation.setPassenger(savedPassenger);
				seatAllocation.setBooking(newBooking);
				seatAllocation.setBus(bus);
				// Add the seat allocation to the booking
				newBooking.addSeat(seatAllocation);
			}

			// Save the new booking entity
			Bookings savedBooking = bookingDao.save(newBooking);

			// Check if the booking was successfully saved
			if (savedBooking != null) {
				return new ApiResponse("Booking Successful.", HttpStatus.CREATED,savedBooking.getId());
			} else {
				return new ApiResponse("Failed to add booking.", HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} catch (ObjectOptimisticLockingFailureException ex) {
			// Handle optimistic locking failure
			return new ApiResponse(
					"Optimistic locking failure: Another user has updated the booking. Please try again.",
					HttpStatus.CONFLICT);

		}
	}

	@Override
	public List<GetBookingDto> getAllUserBookings(long userid) throws RuntimeException {
		User user = userDao.findById(userid).orElseThrow(() -> new RuntimeException("User Not Found"));
		List<Bookings> bookinglist = bookingDao.findByUser(user)
				.orElseThrow(() -> new RuntimeException("No Bookings found"));

		List<GetBookingDto> bookedDtoList = new ArrayList<GetBookingDto>();

		for (Bookings booking : bookinglist) {

			Bus bus = booking.getBus();
			GetBookingDto bookingDto = new GetBookingDto();
			bookingDto.setId(booking.getId());
			bookingDto.setBusNo(bus.getBusNo());
			bookingDto.setFrom(bus.getRoute().getStationIdBoarding().getStationName());
			bookingDto.setTo(bus.getRoute().getStationIdDestination().getStationName());

			bookingDto.setStartTime(bus.getStartTime());
			bookingDto.setEndTime(bus.getEndTime());
			bookingDto.setTotalFare(booking.getFare());
			bookingDto.setBookingDateTime(booking.getBookingDateTime());
			bookedDtoList.add(bookingDto);
		}
		return bookedDtoList;
	}

	@Override
	public BookingDetailsDto getBookingDetails(long bookingId) {
		// Retrieve booking entity by ID
		Optional<Bookings> bookingOptional = bookingDao.findById(bookingId);

		// Check if the booking exists
		if (bookingOptional.isPresent()) {
			// Map booking entity to BookingDetailsDto
			Bookings booking = bookingOptional.get();
			BookingDetailsDto bookingDto = new BookingDetailsDto();
			bookingDto.setBusNo(booking.getBus().getBusNo());
			bookingDto.setFrom(booking.getBus().getRoute().getStationIdBoarding().getStationName());
			bookingDto.setTo(booking.getBus().getRoute().getStationIdDestination().getStationName());
			bookingDto.setStartTime(booking.getBus().getStartTime());
			bookingDto.setEndTime(booking.getBus().getEndTime());
			bookingDto.setTotalFare(booking.getFare());
			bookingDto.setBookingDateTime(booking.getBookingDateTime());

			// Map seat-passenger list to SeatPassengerDto list
			List<SeatAllocation> seatList = booking.getSeatList();
			List<SeatPassengerDto> seatPassengerList = seatList.stream().map(seatAllocation -> {
				SeatPassengerDto seatPassengerDto = new SeatPassengerDto();
				seatPassengerDto.setSeatNo(seatAllocation.getSeatNo());
				seatPassengerDto.setPassenger(mapEntityToDto(seatAllocation.getPassenger()));
				return seatPassengerDto;
			}).collect(Collectors.toList());

			bookingDto.setSeatPassengerList(seatPassengerList);

			return bookingDto;
		} else {
			return null; // Booking not found
		}
	}

	private PassengerDto mapEntityToDto(Passenger passenger) {
		PassengerDto passengerDto = new PassengerDto();
		passengerDto.setFirstName(passenger.getFirstName());
		passengerDto.setLastName(passenger.getLastName());
		passengerDto.setGender(passenger.getGender());
		passengerDto.setAge(passenger.getAge());
		return passengerDto;
	}

	public Passenger mapDtoToEntity(PassengerDto passengerDto) {
		return modelMapper.map(passengerDto, Passenger.class);
	}


	
	
	 public List<GetBookings> getAllBookings() {
	        List<Bookings> bookings = bookingDao.findAll();
	        return mapToGetBookings(bookings);
	    }



	public List<GetBookings> mapToGetBookings(List<Bookings> bookings) {
	        return bookings.stream().map(this::mapToGetBooking).collect(Collectors.toList());
	    }

	    private GetBookings mapToGetBooking(Bookings booking) {
	        GetBookings getBookings = new GetBookings();
	        getBookings.setBookingId(booking.getId());
	        getBookings.setPaymentId(booking.getPaymentId());
	        getBookings.setRazorpayOrderId(booking.getRazorpayOrderId());
	        getBookings.setRazorpaySignature(booking.getRazorpaySignature());
	        getBookings.setBusNo(booking.getBus().getBusNo());
	        getBookings.setBusId(booking.getBus().getId());
	        getBookings.setTotalFare(booking.getFare());
	        getBookings.setUserId(booking.getUser().getId());
	        getBookings.setUserName(booking.getUser().getEmail());
	        getBookings.setBookingDateTime(booking.getBookingDateTime());
	        getBookings.setNoOfSeats(booking.getSeatList().size());
	        return getBookings;
	    }
	
	
	
	
	
	@Override
	public ApiResponse cancelBookings(long bookingid) {
		try {
            // Retrieve booking entity by ID
            Optional<Bookings> bookingOptional = bookingDao.findById(bookingid);

            // Check if the booking exists
            if (bookingOptional.isPresent()) {
                Bookings booking = bookingOptional.get();

                // Delete the booking and associated seat allocations
                bookingDao.delete(booking);

                return new ApiResponse("Booking deleted successfully.", HttpStatus.OK);
            } else {
                return new ApiResponse("Booking not found.", HttpStatus.NOT_FOUND);
            }
        } catch (ObjectOptimisticLockingFailureException ex) {
            // Handle optimistic locking failure
            return new ApiResponse(
                    "Optimistic locking failure: Another user has updated the booking. Please try again.",
                    HttpStatus.CONFLICT);
        } catch (Exception ex) {
            return new ApiResponse("Failed to delete booking.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
	}

	@Override
	public byte[] generateFullReport() {
		try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
			Document document = new Document();
			PdfWriter.getInstance(document, baos);
			document.open();

			// Загружаем шрифт с поддержкой кириллицы
			BaseFont bf = BaseFont.createFont("fonts/arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
			Font font = new Font(bf, 12, Font.NORMAL);
			Font fontBold = new Font(bf, 20, Font.BOLD);

			document.add(new Paragraph("Отчёт по системе бронирования", fontBold));
			document.add(Chunk.NEWLINE);

			document.add(new Paragraph("1. Общая информация:", font));
			document.add(new Paragraph("Всего пользователей: " + userDao.count(), font));
			document.add(new Paragraph("Всего автобусов: " + busDao.count(), font));
			document.add(new Paragraph("Всего бронирований: " + bookingDao.count(), font));

			document.add(new Paragraph("\n", font));

			// Таблица для водителей с заработком и часами
			PdfPTable driverTable = new PdfPTable(6);
			driverTable.setWidthPercentage(100);
			addTableHeader(driverTable, new String[]{"ФИО", "Лицензия", "Автобус", "Телефон", "Доход за период", "Отработано часов"}, font);

			driverDao.findAll().forEach(driver -> {
				double earnings = bookingDao.findByDriverId(driver.getId())
						.stream().mapToDouble(Bookings::getFare).sum();

				long totalHours = busDao.findByDriverId(driver.getId())
						.stream().mapToLong(bus -> Duration.between(bus.getStartTime(), bus.getEndTime()).toHours()).sum();

				addTableRow(driverTable, new String[]{
						driver.getFirstName() + " " + driver.getLastName(),
						driver.getLicenseNumber(),
						driver.getBuses() != null && !driver.getBuses().isEmpty()
								? driver.getBuses().stream().map(Bus::getBusNo).collect(Collectors.joining(", "))
								: "Без автобуса",
						driver.getPhoneNumber(),
						String.valueOf(earnings),
						String.valueOf(totalHours)
				}, font);
			});

			document.add(new Paragraph("Водители и заработок:", font));
			document.add(new Paragraph("\n", font));
			document.add(driverTable);

			document.add(new Paragraph("\n", font));

			// Таблица для автобусов и пройденного расстояния
			PdfPTable busTable = new PdfPTable(3);
			busTable.setWidthPercentage(150);
			addTableHeader(busTable, new String[]{"Номер автобуса", "Маршрут", "Общий километраж"}, font);

			busDao.findAll().forEach(bus -> {
				int trips = bookingDao.countTripsByBusId(bus.getId());
				double distance = bus.getRoute().getDistance();
				addTableRow(busTable, new String[]{
						bus.getBusNo(),
						bus.getRoute().getStationIdBoarding().getStationName() + " - " + bus.getRoute().getStationIdDestination().getStationName(),
						String.valueOf(trips * distance)
				}, font);
			});

			document.add(new Paragraph("Автобусы и километраж:", font));
			document.add(new Paragraph("\n", font));
			document.add(busTable);

			document.close();
			return baos.toByteArray();

		} catch (Exception e) {
			throw new RuntimeException("Failed to generate report: " + e.getMessage(), e);
		}
	}

	/**
	 * Метод для добавления заголовков в таблицу
	 */
	private void addTableHeader(PdfPTable table, String[] headers, Font font) {
		for (String header : headers) {
			PdfPCell cell = new PdfPCell(new Phrase(header, font));
			cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
			cell.setHorizontalAlignment(Element.ALIGN_CENTER);
			table.addCell(cell);
		}
	}

	/**
	 * Метод для добавления строк в таблицу
	 */
	private void addTableRow(PdfPTable table, String[] data, Font font) {
		for (String value : data) {
			PdfPCell cell = new PdfPCell(new Phrase(value, font));
			cell.setHorizontalAlignment(Element.ALIGN_CENTER);
			table.addCell(cell);
		}
	}


}
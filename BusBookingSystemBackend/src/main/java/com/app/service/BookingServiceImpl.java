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


import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.encoders.EncoderUtil;
import org.jfree.chart.encoders.ImageFormat;


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


    public byte[] generateFullReport() {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            // Создаём документ формата A4 с отступами
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Загружаем шрифт с поддержкой кириллицы
            BaseFont bf = BaseFont.createFont("fonts/arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            Font regularFont = new Font(bf, 12, Font.NORMAL);
            Font boldFont = new Font(bf, 20, Font.BOLD);
            Font sectionFont = new Font(bf, 14, Font.BOLD);

            // Заголовок отчёта
            Paragraph title = new Paragraph("Брондау жүйесінің есебі", boldFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            // 1. Общая информация
            document.add(new Paragraph("1. Жалпы мәлімет", sectionFont));
            document.add(new Paragraph("Жалпы пайдаланушылар саны: " + userDao.count(), regularFont));
            document.add(new Paragraph("Автобустардың жалпы саны: " + busDao.count(), regularFont));
            document.add(new Paragraph("Жалпы брондау саны: " + bookingDao.count(), regularFont));
            document.add(Chunk.NEWLINE);

            // 2. Водители
            Paragraph driverSection = new Paragraph("2. Жүргізушілер және табыстар", sectionFont);
            driverSection.setSpacingBefore(10f);
            document.add(driverSection);
            document.add(Chunk.NEWLINE);

            // Таблица водителей
            PdfPTable driverTable = new PdfPTable(6);
            driverTable.setWidthPercentage(100);

            addTableHeader(driverTable,
                    new String[]{
                            "Аты-жөні", "Лицензия", "Автобус", "Телефон",
                            "Кезең ішіндегі кіріс", "Жұмыс істеген сағат"
                    },
                    regularFont
            );

            // Данные для диаграммы водителей
            DefaultCategoryDataset driverDataset = new DefaultCategoryDataset();

            driverDao.findAll().forEach(driver -> {
                double earnings = bookingDao.findByDriverId(driver.getId())
                        .stream().mapToDouble(Bookings::getFare).sum();

                long totalHours = busDao.findByDriverId(driver.getId())
                        .stream()
                        .mapToLong(bus -> Duration.between(bus.getStartTime(), bus.getEndTime()).toHours())
                        .sum();

                String fio = driver.getFirstName() + " " + driver.getLastName();

                // Заполняем строку таблицы
                addTableRow(driverTable, new String[]{
                        fio,
                        driver.getLicenseNumber(),
                        (driver.getBuses() != null && !driver.getBuses().isEmpty())
                                ? driver.getBuses().stream().map(Bus::getBusNo).collect(Collectors.joining(", "))
                                : "Автобуссыз",
                        driver.getPhoneNumber(),
                        String.format("%.2f", earnings),
                        String.valueOf(totalHours)
                }, regularFont);

                // Добавляем данные в dataset для диаграммы
                driverDataset.addValue(earnings, "Кіріс (валюта)", fio);
            });

            document.add(driverTable);
            document.add(Chunk.NEWLINE);

            // Диаграмма по водителям (гистограмма)
            JFreeChart driverBarChart = ChartFactory.createBarChart(
                    "Жүргізушілердің табысы",
                    "Жүргізуші",
                    "Табыс",
                    driverDataset,
                    PlotOrientation.VERTICAL,
                    false,
                    true,
                    false
            );

            ByteArrayOutputStream driverChartBaos = new ByteArrayOutputStream();
            java.awt.image.BufferedImage driverChartImage = driverBarChart.createBufferedImage(600, 400);
            byte[] driverChartBytes = EncoderUtil.encode(driverChartImage, ImageFormat.PNG, true);
            driverChartBaos.write(driverChartBytes);

            Image driverChartImg = Image.getInstance(driverChartBaos.toByteArray());
            driverChartImg.setAlignment(Element.ALIGN_CENTER);
            driverChartImg.scaleToFit(500, 300);
            document.add(driverChartImg);

            // 3. Автобусы
            Paragraph busSection = new Paragraph("3. Автобустар және километраж", sectionFont);
            busSection.setSpacingBefore(20f);
            document.add(busSection);
            document.add(Chunk.NEWLINE);

            PdfPTable busTable = new PdfPTable(3);
            busTable.setWidthPercentage(100);

            addTableHeader(busTable,
                    new String[]{"Автобус нөмірі", "Маршрут", "Жалпы километр"},
                    regularFont
            );

            // Создадим dataset для диаграммы автобусов
            DefaultCategoryDataset busDataset = new DefaultCategoryDataset();

            busDao.findAll().forEach(bus -> {
                int trips = bookingDao.countTripsByBusId(bus.getId());
                double distance = bus.getRoute().getDistance();
                double totalDistance = trips * distance;

                // Запись в таблицу
                addTableRow(busTable, new String[]{
                        bus.getBusNo(),
                        bus.getRoute().getStationIdBoarding().getStationName() + " - " +
                                bus.getRoute().getStationIdDestination().getStationName(),
                        String.format("%.2f", totalDistance)
                }, regularFont);

                // Добавляем данные в dataset для построения диаграммы
                busDataset.addValue(totalDistance, "Километр", bus.getBusNo());
            });

            document.add(busTable);
            document.add(Chunk.NEWLINE);

            // Создадим диаграмму для автобусов (например, тоже гистограмма)
            JFreeChart busBarChart = ChartFactory.createBarChart(
                    "Автобустардың жалпы километрі",
                    "Автобус нөмірі",
                    "Километр",
                    busDataset,
                    PlotOrientation.VERTICAL,
                    false, // легенда
                    true,  // tooltips
                    false  // urls
            );

            ByteArrayOutputStream busChartBaos = new ByteArrayOutputStream();
            java.awt.image.BufferedImage busChartImage = busBarChart.createBufferedImage(600, 400);
            byte[] busChartBytes = EncoderUtil.encode(busChartImage, ImageFormat.PNG, true);
            busChartBaos.write(busChartBytes);

            Image busChartImg = Image.getInstance(busChartBaos.toByteArray());
            busChartImg.setAlignment(Element.ALIGN_CENTER);
            busChartImg.scaleToFit(500, 300);
            document.add(busChartImg);

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
			cell.setPadding(5f);
			table.addCell(cell);
		}
	}

	/**
	 * Метод для добавления одной строки в таблицу
	 */
	private void addTableRow(PdfPTable table, String[] values, Font font) {
		for (String val : values) {
			PdfPCell cell = new PdfPCell(new Phrase(val, font));
			cell.setHorizontalAlignment(Element.ALIGN_CENTER);
			cell.setPadding(4f);
			table.addCell(cell);
		}
	}




}
package com.app.service;

import com.app.dao.BusDao;
import com.app.dto.ScheduleDto;
import com.app.entities.Bus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BusScheduleServiceImpl implements BusScheduleService {

    @Autowired
    private BusDao busDao;

    @Override
    public void addBusAsSchedule(Long busId, ScheduleDto dto) {
        Bus originalBus = busDao.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found"));

        Bus newBus = new Bus();
        newBus.setBusNo(originalBus.getBusNo());
        newBus.setRoute(originalBus.getRoute());
        newBus.setDriver(originalBus.getDriver());
        newBus.setBusClass(originalBus.getBusClass());
        newBus.setTotalSeats(originalBus.getTotalSeats());
        newBus.setPrice(originalBus.getPrice());
        LocalDate date = LocalDate.now().withDayOfMonth(dto.getDayOfMonth());
        LocalTime departureTime = LocalTime.parse(dto.getDepartureTime());
        newBus.setStartTime(LocalDateTime.of(date, departureTime));
        newBus.setEndTime(newBus.getStartTime().plusHours(3)); // или своё значение

        busDao.save(newBus);
    }

    @Override
    public List<ScheduleDto> getSchedulesForBus(Long busId) {
        Bus originalBus = busDao.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found"));

        List<Bus> buses = busDao.findByBusNo(originalBus.getBusNo());

        return buses.stream().map(bus -> new ScheduleDto(
                bus.getId(),
                bus.getBusNo(),
                bus.getRoute().getStationIdBoarding().getStationName(),
                bus.getRoute().getStationIdDestination().getStationName(),
                bus.getStartTime().toLocalDate().toString(),
                bus.getStartTime().toLocalTime().toString(),
                bus.getBusClass().toString()
        )).collect(Collectors.toList());
    }

    @Override
    public void deleteBusSchedule(Long busId) {
        if (!busDao.existsById(busId))
            throw new RuntimeException("Bus not found");
        busDao.deleteById(busId);
    }
}

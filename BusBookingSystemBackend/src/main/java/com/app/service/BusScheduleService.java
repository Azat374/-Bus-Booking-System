package com.app.service;

import com.app.dao.BusDao;
import com.app.dao.BusScheduleDao;
import com.app.entities.Bus;
import com.app.entities.BusSchedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusScheduleService {

    @Autowired
    private BusScheduleDao scheduleDao;
    @Autowired
    private BusDao busDao;

    public BusSchedule addSchedule(Long busId, BusSchedule schedule) {
        Bus bus = busDao.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found"));
        schedule.setBus(bus);
        return scheduleDao.save(schedule);
    }

    public List<BusSchedule> getSchedulesForBus(Long busId) {
        // Простейший способ: получить все и отфильтровать
        // (или сделать метод в репозитории, если нужно).
        return scheduleDao.findAll().stream()
                .filter(s -> s.getBus().getId().equals(busId))
                .toList();
    }

    public void deleteSchedule(Long scheduleId) {
        scheduleDao.deleteById(scheduleId);
    }
}

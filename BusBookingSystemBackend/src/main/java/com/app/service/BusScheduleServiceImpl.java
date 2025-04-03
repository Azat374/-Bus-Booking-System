package com.app.service;

import com.app.dao.BusDao;
import com.app.dao.BusScheduleDao;
import com.app.entities.Bus;
import com.app.entities.BusSchedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusScheduleServiceImpl implements BusScheduleService {

    @Autowired
    private BusScheduleDao scheduleDao;
    @Autowired
    private BusDao busDao;

    @Override
    public BusSchedule addSchedule(Long busId, BusSchedule schedule) {
        Bus bus = busDao.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found"));
        schedule.setBus(bus);
        return scheduleDao.save(schedule);
    }

    @Override
    public List<BusSchedule> getSchedulesForBus(Long busId) {
        List<BusSchedule> schedules = scheduleDao.findByBusId(busId);
        if (schedules == null || schedules.isEmpty()) {
            throw new RuntimeException("Schedules not found");
        }
        return schedules;
    }

    @Override
    public void deleteSchedule(Long scheduleId) {
        scheduleDao.deleteById(scheduleId);
    }
}

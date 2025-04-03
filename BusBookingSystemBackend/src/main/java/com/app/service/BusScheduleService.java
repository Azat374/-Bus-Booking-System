package com.app.service;

import com.app.entities.Bus;
import com.app.entities.BusSchedule;

import java.util.List;

public interface BusScheduleService {
    public BusSchedule addSchedule(Long busId, BusSchedule schedule) ;

    public List<BusSchedule> getSchedulesForBus(Long busId) ;

    public void deleteSchedule(Long scheduleId) ;
}

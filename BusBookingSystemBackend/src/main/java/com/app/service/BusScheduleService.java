package com.app.service;

import com.app.dto.ScheduleDto;
import java.util.List;

public interface BusScheduleService {
    void addBusAsSchedule(Long busId, ScheduleDto dto);
    List<ScheduleDto> getSchedulesForBus(Long busId);
    void deleteBusSchedule(Long busId);
}

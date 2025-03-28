package com.app.controller;

import com.app.entities.BusSchedule;
import com.app.service.BusScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedule")
public class BusScheduleController {

    @Autowired
    private BusScheduleService scheduleService;

    // Добавить расписание для конкретного автобуса
    @PostMapping("/add/{busId}")
    public BusSchedule addSchedule(@PathVariable Long busId, @RequestBody BusSchedule schedule) {
        return scheduleService.addSchedule(busId, schedule);
    }

    // Получить все расписания для автобуса
    @GetMapping("/{busId}")
    public List<BusSchedule> getSchedules(@PathVariable Long busId) {
        return scheduleService.getSchedulesForBus(busId);
    }

    // Удалить расписание
    @DeleteMapping("/{scheduleId}")
    public void deleteSchedule(@PathVariable Long scheduleId) {
        scheduleService.deleteSchedule(scheduleId);
    }
}

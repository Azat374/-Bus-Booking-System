package com.app.controller;

import com.app.dto.ScheduleDto;
import com.app.service.BusScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedule")
public class BusScheduleController {

    @Autowired
    private BusScheduleService scheduleService;

    @PostMapping("/add/{busId}")
    public ResponseEntity<?> addSchedule(@PathVariable Long busId, @RequestBody ScheduleDto dto) {
        scheduleService.addBusAsSchedule(busId, dto);
        return ResponseEntity.ok("Schedule (Bus) added successfully");
    }

    @GetMapping("/{busId}")
    public ResponseEntity<List<ScheduleDto>> getSchedules(@PathVariable Long busId) {
        return ResponseEntity.ok(scheduleService.getSchedulesForBus(busId));
    }

    @DeleteMapping("/{busId}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long busId) {
        scheduleService.deleteBusSchedule(busId);
        return ResponseEntity.ok("Schedule (Bus) deleted successfully");
    }
}

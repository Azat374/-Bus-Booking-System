package com.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.app.dto.DriverDto;
import com.app.service.DriverService;

import java.util.List;

@RestController
@RequestMapping("/drivers")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<?> addDriver(@RequestBody DriverDto driverDto) {
        return ResponseEntity.ok(driverService.addDriver(driverDto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{driverId}")
    public ResponseEntity<?> updateDriver(@PathVariable Long driverId, @RequestBody DriverDto driverDto) {
        return ResponseEntity.ok(driverService.updateDriver(driverId, driverDto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{driverId}")
    public ResponseEntity<?> deleteDriver(@PathVariable Long driverId) {
        return ResponseEntity.ok(driverService.deleteDriver(driverId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<DriverDto>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }
}

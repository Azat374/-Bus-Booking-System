package com.app.service;

import java.util.List;
import com.app.dto.ApiResponse;
import com.app.dto.DriverDto;
import com.app.entities.Driver;

public interface DriverService {
    ApiResponse addDriver(DriverDto driverDto);
    ApiResponse updateDriver(Long driverId, DriverDto driverDto);
    ApiResponse deleteDriver(Long driverId);
    List<DriverDto> getAllDrivers();
    Driver getDriverById(Long driverId);
}

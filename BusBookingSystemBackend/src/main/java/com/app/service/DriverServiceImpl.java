package com.app.service;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.app.dao.DriverDao;
import com.app.dto.ApiResponse;
import com.app.dto.DriverDto;
import com.app.entities.Driver;

@Service
@Transactional
public class DriverServiceImpl implements DriverService {

    @Autowired
    private DriverDao driverDao;

    @Autowired
    private ModelMapper mapper;

    @Override
    public ApiResponse addDriver(DriverDto driverDto) {
        if (driverDao.existsByLicenseNumber(driverDto.getLicenseNumber())) {
            return new ApiResponse("Driver with this license number already exists.", HttpStatus.BAD_REQUEST);
        }
        Driver driver = mapper.map(driverDto, Driver.class);
        driverDao.save(driver);
        return new ApiResponse("Driver added successfully", HttpStatus.CREATED);
    }

    @Override
    public ApiResponse updateDriver(Long driverId, DriverDto driverDto) {
        Driver existingDriver = driverDao.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found."));
        // Если номер лицензии меняется, проверяем, нет ли конфликтов
        if (!existingDriver.getLicenseNumber().equals(driverDto.getLicenseNumber())
                && driverDao.existsByLicenseNumber(driverDto.getLicenseNumber())) {
            return new ApiResponse("License number already in use by another driver.", HttpStatus.BAD_REQUEST);
        }
        // С помощью ModelMapper копируем поля из DTO в найденную сущность
        mapper.map(driverDto, existingDriver);
        driverDao.save(existingDriver);
        return new ApiResponse("Driver updated successfully");
    }

    @Override
    public ApiResponse deleteDriver(Long driverId) {
        Driver driver = driverDao.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found."));
        driverDao.delete(driver);
        return new ApiResponse("Driver deleted successfully");
    }

    @Override
    public List<DriverDto> getAllDrivers() {
        return driverDao.findAll().stream()
                .map(driver -> new DriverDto(
                        driver.getId(),
                        driver.getFirstName(),
                        driver.getLastName(),
                        driver.getLicenseNumber(),
                        driver.getPhoneNumber(),
                        driver.getSalary()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public Driver getDriverById(Long driverId) {
        return driverDao.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found."));
    }
}

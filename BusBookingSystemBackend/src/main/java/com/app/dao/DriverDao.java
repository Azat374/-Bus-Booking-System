package com.app.dao;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.app.entities.Driver;

public interface DriverDao extends JpaRepository<Driver, Long> {
    Optional<Driver> findByLicenseNumber(String licenseNumber);
    boolean existsByLicenseNumber(String licenseNumber);
}

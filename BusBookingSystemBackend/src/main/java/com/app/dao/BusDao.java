package com.app.dao;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entities.Bus;
import com.app.entities.Routes;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BusDao extends JpaRepository<Bus, Long>{
	
	Optional<Bus> findByBusNo(int busNo);
	Optional<Bus> findById(long Id);
	List<Bus> findByRoute(Routes r);
	Optional<Bus> findByBusNoAndStartTime(int busNo,LocalDate date);

	Boolean existsByBusNo(String busNo);


	@Query("SELECT b FROM Bus b WHERE b.driver.id = :driverId")
	List<Bus> findByDriverId(@Param("driverId") Long driverId);

}

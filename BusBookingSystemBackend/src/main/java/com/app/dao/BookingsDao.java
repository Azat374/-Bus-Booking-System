package com.app.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entities.Bookings;
import com.app.entities.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingsDao extends JpaRepository<Bookings, Long>{
	
	Optional<List<Bookings>> findByUser(User u);
	void delete(Bookings id);

	@Query("SELECT b FROM Bookings b WHERE b.bus.driver.id = :driverId")
	List<Bookings> findByDriverId(@Param("driverId") Long driverId);

	@Query("SELECT COUNT(b) FROM Bookings b WHERE b.bus.id = :busId")
	int countTripsByBusId(@Param("busId") Long busId);
}

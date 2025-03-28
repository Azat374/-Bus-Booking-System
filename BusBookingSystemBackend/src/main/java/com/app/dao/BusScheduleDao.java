package com.app.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.app.entities.BusSchedule;

public interface BusScheduleDao extends JpaRepository<BusSchedule, Long> {
    // Доп. методы поиска, если нужно
}

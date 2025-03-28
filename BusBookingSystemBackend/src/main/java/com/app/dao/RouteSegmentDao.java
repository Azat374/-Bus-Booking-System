package com.app.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.app.entities.RouteSegment;

public interface RouteSegmentDao extends JpaRepository<RouteSegment, Long> {
    // при необходимости кастомные методы
}

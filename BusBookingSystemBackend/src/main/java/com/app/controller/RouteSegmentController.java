package com.app.controller;

import com.app.entities.RouteSegment;
import com.app.service.RouteSegmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/routesegment")
public class RouteSegmentController {

    @Autowired
    private RouteSegmentService segmentService;

    // Добавить промежуточный сегмент в уже существующий Route
    @PostMapping("/add/{routeId}/{stationId}")
    public RouteSegment addSegment(@PathVariable Long routeId,
                                   @PathVariable Long stationId,
                                   @RequestBody RouteSegment segment) {
        return segmentService.addSegment(routeId, stationId, segment);
    }

    // Удалить сегмент
    @DeleteMapping("/{segmentId}")
    public void deleteSegment(@PathVariable Long segmentId) {
        segmentService.deleteSegment(segmentId);
    }
}

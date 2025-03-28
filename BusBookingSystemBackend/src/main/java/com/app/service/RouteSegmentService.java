package com.app.service;

import com.app.dao.RouteDao;
import com.app.dao.RouteSegmentDao;
import com.app.dao.StationDao;
import com.app.entities.RouteSegment;
import com.app.entities.Routes;
import com.app.entities.Station;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RouteSegmentService {

    @Autowired
    private RouteSegmentDao segmentDao;

    @Autowired
    private RouteDao routeDao;

    @Autowired
    private StationDao stationDao;

    public RouteSegment addSegment(Long routeId, Long stationId, RouteSegment segment) {
        Routes route = routeDao.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        Station st = stationDao.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station not found"));

        segment.setRoute(route);
        segment.setStation(st);

        return segmentDao.save(segment);
    }

    public void deleteSegment(Long segmentId) {
        segmentDao.deleteById(segmentId);
    }

    // и т.д. (обновление, поиск и пр.)
}

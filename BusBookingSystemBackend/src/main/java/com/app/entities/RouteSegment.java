package com.app.entities;

import javax.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RouteSegment extends Base {

    @ManyToOne
    private Routes route; // указывает, к какому маршруту относится сегмент

    @ManyToOne
    private Station station; // промежуточная станция

    private int orderIndex;  // порядок следования (0 = первая остановка, 1, 2...)

    // расстояние от этой станции до следующей (или время в пути и т.д.)
    private double distanceToNext;
}

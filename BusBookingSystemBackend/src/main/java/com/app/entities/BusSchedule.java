package com.app.entities;

import java.time.LocalTime;
import javax.persistence.*;

import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BusSchedule extends Base {

    @ManyToOne
    private Bus bus;  // Какой автобус ходит по расписанию

    // Например, 1, 4, 10 число месяца
    private Integer dayOfMonth;

    // Время отправления
    private LocalTime departureTime;

    private boolean active = true;
}

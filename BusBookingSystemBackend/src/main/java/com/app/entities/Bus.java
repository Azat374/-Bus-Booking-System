package com.app.entities;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.time.LocalDateTime;

import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Bus extends Base {

    @Pattern(regexp = "[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}", message = "Invalid vehicle number")
    private String busNo;

    @Min(value = 1, message = "Total seats must be greater than 0")
    private int totalSeats;

    @NotNull(message = "Start Datetime cannot be null")
    private LocalDateTime startTime;

    @NotNull(message = "End Datetime cannot be null")
    private LocalDateTime endTime;

    @ManyToOne
    private Routes route;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @Enumerated(EnumType.STRING)
    private BusClass busClass;

    @Column(name = "price")
    private Double price;
}

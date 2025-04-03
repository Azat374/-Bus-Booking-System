package com.app.dto;

import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDto {
    private Long id;
    private String busNo;
    private String from;
    private String to;
    private String departureDate;
    private String departureTime;
    private String busClass;


    // Эти поля нужны для добавления
    private int dayOfMonth;
    private String departureTimeRaw;
    private boolean active;

    public ScheduleDto(Long id, String busNo, String from, String to,
                       String departureDate, String departureTime, String busClass) {
        this.id = id;
        this.busNo = busNo;
        this.from = from;
        this.to = to;
        this.departureDate = departureDate;
        this.departureTime = departureTime;
        this.busClass = busClass;
    }
}


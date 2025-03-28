package com.app.entities;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Driver extends Base {

    @NotBlank(message = "First name is required")
    @Column(length = 20, nullable = false)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Column(length = 20, nullable = false)
    private String lastName;

    @NotBlank(message = "License number is required")
    @Pattern(regexp = "[A-Z0-9]{10,15}", message = "Invalid license number format")
    @Column(unique = true, length = 15, nullable = false)
    private String licenseNumber;

    @Pattern(regexp = "^\\+?[0-9]{10}$", message = "Invalid phone number")
    @Column(length = 15)
    private String phoneNumber;

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL)
    private List<Bus> buses = new ArrayList<>();

    @Column(nullable = false)
    private Double salary = 0.0;
}

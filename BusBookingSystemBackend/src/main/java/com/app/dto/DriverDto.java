package com.app.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DriverDto {

    private Long id;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "License number is required")
    @Pattern(regexp = "[A-Z0-9]{10,15}", message = "Invalid license number format")
    private String licenseNumber;

    @Pattern(regexp = "^\\+?[0-9]{10}$", message = "Invalid phone number")
    private String phoneNumber;

    private Double salary;

}

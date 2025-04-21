package com.clinic.demo.DTO.registrationDTO;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record EmployeeRegistrationDTO(
        @NotBlank(message = "First name is required")
        String firstName,

        @NotBlank(message = "Last name is required")
        String lastName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        String email,

        @NotBlank(message = "Password is required")
        String password,

        @NotBlank(message = "Phone number is required")
        String phoneNumber,

        @NotBlank(message = "National ID is required")
        String nationalId,

        @NotBlank(message = "Gender is required")
        String gender,

        @NotBlank(message = "User type is required")
        String userType,

        @NotNull(message = "Date of birth is required")
        @Past(message = "Date of birth must be in the past")
        LocalDate dob,

        @PositiveOrZero(message = "Salary must be a positive number or zero")
        float salary
) {}
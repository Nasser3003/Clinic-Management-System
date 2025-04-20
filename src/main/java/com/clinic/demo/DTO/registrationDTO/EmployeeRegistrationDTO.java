package com.clinic.demo.DTO.registrationDTO;

import java.time.LocalDate;

public record EmployeeRegistrationDTO(
        String firstName,
        String lastName,
        String email,
        String password,
        String phoneNumber,
        String gender,
        LocalDate dob,
        String nationalId,
        String userType,
        float salary
) { }
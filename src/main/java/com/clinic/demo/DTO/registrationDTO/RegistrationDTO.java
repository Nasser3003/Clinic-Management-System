package com.clinic.demo.DTO.registrationDTO;

import com.clinic.demo.models.enums.GenderEnum;

import java.time.LocalDate;

public record RegistrationDTO(
        String firstName,
        String lastName,
        String email,
        String password,
        String phoneNumber,
        String gender,
        LocalDate dob
) {}
package com.clinic.demo.DTO;

import java.time.LocalDate;

public record RegistrationDTO(
        String email,
        String password,
        LocalDate dob
) {}


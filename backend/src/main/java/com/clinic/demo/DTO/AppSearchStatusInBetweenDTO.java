package com.clinic.demo.DTO;

import com.clinic.demo.models.enums.AppointmentStatus;

import java.time.LocalDate;

public record AppSearchStatusInBetweenDTO(
        String doctorEmail,
        String patientEmail,
        AppointmentStatus statusEnum,
        LocalDate startDate,  // Can be null
        LocalDate endDate     // Can be null
) {
}
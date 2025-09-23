package com.clinic.demo.DTO;

import com.clinic.demo.models.enums.AppointmentStatus;

import java.time.LocalDateTime;

public record AppSearchStatusInBetweenDTO(
        String doctorEmail,
        String patientEmail,
        AppointmentStatus statusEnum, // can be null
        LocalDateTime startDate,  // Can be null
        LocalDateTime endDate     // Can be null
) {
}
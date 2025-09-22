package com.clinic.demo.DTO.calenderDTO;

import com.clinic.demo.models.enums.AppointmentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record AppointmentDTO(
        UUID id,
        String doctorName,
        String patientName,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        int duration,
        AppointmentStatus status,
        String reason
) {}

package com.clinic.demo.DTO;


import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record AppointmentRequestDTO(
        String doctorEmail,
        String patientEmail,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime dateTime) {
}

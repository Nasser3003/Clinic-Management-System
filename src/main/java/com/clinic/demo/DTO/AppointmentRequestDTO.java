package com.clinic.demo.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public record AppointmentRequestDTO(
        @NotBlank(message = "Doctor required")
        @Email(message = "Doctor email should be valid")
        String doctorEmail,

        @NotBlank(message = "Patient required")
        @Email(message = "Patient email should be valid")
        String patientEmail,

        @Min(value = 30, message = "minimum duration is 30 mins")
        @Max(value = 180, message = "maximum duration is 180 mins")
        int duration,

        @NotNull(message = "Appointment date and time is required")
        @Future(message = "Appointment must be scheduled in the future")
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime dateTime
) {}
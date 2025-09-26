package com.clinic.demo.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record addPrescriptionDTO(

        @NotBlank(message = "Doctor required")
        @Email(message = "Doctor email should be valid")
        String doctorEmail,

        @NotBlank(message = "Patient required")
        @Email(message = "Patient email should be valid")
        String patientEmail,

        @NotBlank(message = "medication required")
        String medication,

        @NotBlank(message = "dosage required")
        String dosage,

        @NotBlank(message = "frequency required")
        String frequency,

        @NotBlank(message = "duration required")
        String duration) {
}

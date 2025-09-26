package com.clinic.demo.DTO;

import jakarta.validation.constraints.NotEmpty;

public record PrescriptionDTO (
        @NotEmpty(message = "Name is required")
        String name,

        @NotEmpty(message = "Dosage is required")
        String dosage,

        @NotEmpty(message = "Duration is required")
        String duration,

        @NotEmpty(message = "Frequency is required")
        String frequency,

        @NotEmpty(message = "Instructions are required")
        String instructions
) {

}

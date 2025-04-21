package com.clinic.demo.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record TreatmentsDTO(

        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        String doctorEmail,

        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        String patientEmail,

        @Min(value = 1, message = "appointment id must be greater than 1")
        long appointmentId,

        @NotNull(message = "Email is required")
        List<TreatmentDetails> treatmentsDetails
) {
}

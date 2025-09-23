package com.clinic.demo.DTO;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record FinalizingAppointmentDTO(

        @NotNull(message = "Treatments list is required")
        List<TreatmentDetails> treatments,
        List<String> filePaths,
        String visitNotes
) {
}
package com.clinic.demo.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.util.List;

public record TreatmentDetailsDTO(

        @NotNull(message = "Amount paid is required")
        @PositiveOrZero(message = "Amount paid must be zero or positive")
        int amountPaid,

        @NotNull(message = "Cost is required")
        @Min(value = 1, message = "Cost must be a positive number")
        int cost,

        @NotNull(message = "Installment period is required")
        @PositiveOrZero(message = "Installment period must be zero or positive")
        int installmentPeriodInMonths,

        String treatmentDescription,

        @Valid
        List<PrescriptionDTO> prescriptions


) {
    public TreatmentDetailsDTO {
        if (amountPaid > cost) throw new IllegalArgumentException("Amount paid cannot exceed total cost");
    }
}
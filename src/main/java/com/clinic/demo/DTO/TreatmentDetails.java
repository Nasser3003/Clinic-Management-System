package com.clinic.demo.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record TreatmentDetails(
        @NotNull(message = "Treatment ID is required")
        @Min(value = 1, message = "Treatment ID must be a positive number")
        int treatmentId,

        @NotNull(message = "Amount paid is required")
        @PositiveOrZero(message = "Amount paid must be zero or positive")
        int amountPaid,

        @NotNull(message = "Cost is required")
        @Min(value = 1, message = "Cost must be a positive number")
        int cost,

        @NotNull(message = "Installment period is required")
        @PositiveOrZero(message = "Installment period must be zero or positive")
        int installmentPeriodInMonths
) {
    public TreatmentDetails {
        if (amountPaid > cost) throw new IllegalArgumentException("Amount paid cannot exceed total cost");
    }
}
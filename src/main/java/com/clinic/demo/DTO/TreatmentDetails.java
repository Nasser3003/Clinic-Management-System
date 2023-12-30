package com.clinic.demo.DTO;

public record TreatmentDetails(
        int treatmentId,
        int amountPaid,
        int cost,
        int installmentPeriodInMonths
) {
}
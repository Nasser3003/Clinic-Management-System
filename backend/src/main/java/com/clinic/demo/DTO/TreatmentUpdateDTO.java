package com.clinic.demo.DTO;

public record TreatmentUpdateDTO(
        String notes,
        Integer amountPaid,
        Integer installmentPeriodInMonths
) {

    public boolean hasNotesUpdate() {
        return notes != null && !notes.trim().isEmpty();
    }

    public boolean hasPaymentUpdate() {
        return amountPaid != null;
    }

    public boolean hasInstallmentUpdate() {
        return installmentPeriodInMonths != null;
    }

    public boolean hasAnyUpdate() {
        return hasNotesUpdate() || hasPaymentUpdate() || hasInstallmentUpdate();
    }
}
package com.clinic.demo.DTO;

import java.time.LocalDate;

public record TreatmentFilterDTO(
    String doctorEmail,
    String patientEmail,
    LocalDate fromDate,
    LocalDate toDate,
    String prescriptionName,
    String notes
) {

    public boolean hasFilters() {
        return (doctorEmail != null  ||
                (patientEmail != null ||
                fromDate != null ||
                toDate != null ||
                (prescriptionName != null && !prescriptionName.trim().isEmpty()) ||
                (notes != null && !notes.trim().isEmpty())));
    }
}
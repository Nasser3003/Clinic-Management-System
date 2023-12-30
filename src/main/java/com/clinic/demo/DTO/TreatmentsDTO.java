package com.clinic.demo.DTO;

import java.util.List;

public record TreatmentsDTO(
        String doctorEmail,
        String patientEmail,
        long appointmentId,
        List<TreatmentDetails> treatmentsDetails
) {
}

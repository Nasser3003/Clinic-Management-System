package com.clinic.demo.DTO;

import com.clinic.demo.models.entity.TreatmentEntity;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record TreatmentResponseDTO(
    UUID id,
    String treatmentDescription,
    String doctorName,
    String doctorEmail,
    String patientName,
    String patientEmail,
    int cost,
    int amountPaid,
    float remainingBalance,
    int installmentPeriodInMonths,
    String notes,
    LocalDateTime createdAt,
    LocalDateTime lastModifiedDate,
    List<PrescriptionResponseDTO> prescriptions
) {
    
    public static TreatmentResponseDTO fromEntity(TreatmentEntity entity) {
        return new TreatmentResponseDTO(
            entity.getId(),
            entity.getTreatment(),
            entity.getDoctor().getDisplayName(),
            entity.getDoctor().getEmail(),
            entity.getPatient().getDisplayName(),
            entity.getPatient().getEmail(),
            entity.getCost(),
            entity.getAmountPaid(),
            entity.getRemainingBalance(),
            entity.getInstallmentPeriodInMonths(),
            entity.getNotes(),
            entity.getTreatmentDate(),
            entity.getLastModifiedDate(),
            entity.getPrescriptions() != null ? 
                entity.getPrescriptions().stream()
                    .map(PrescriptionResponseDTO::fromEntity)
                    .collect(Collectors.toList()) : 
                List.of()
        );
    }
}
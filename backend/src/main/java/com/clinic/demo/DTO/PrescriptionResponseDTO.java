package com.clinic.demo.DTO;

import com.clinic.demo.models.entity.PrescriptionEntity;

public record PrescriptionResponseDTO(
    Long id,
    String name,
    String dosage,
    String duration,
    String frequency,
    String specialInstruction
) {
    
    public static PrescriptionResponseDTO fromEntity(PrescriptionEntity entity) {
        return new PrescriptionResponseDTO(
            entity.getId(),
            entity.getName(),
            entity.getDosage(),
            entity.getDuration(),
            entity.getFrequency(),
            entity.getSpecialInstruction()
        );
    }
}
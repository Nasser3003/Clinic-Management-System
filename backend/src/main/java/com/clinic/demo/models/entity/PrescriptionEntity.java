package com.clinic.demo.models.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
public class PrescriptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter(AccessLevel.NONE)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "treatment_id", nullable = false)
    private TreatmentEntity treatment;


    private String name;
    private String duration;
    private String dosage;
    private String frequency;
    private String specialInstruction;

    public PrescriptionEntity(TreatmentEntity treatment, String name, String dosage, String duration, String frequency, String specialInstruction) {
        this.treatment = treatment;
        this.name = name;
        this.dosage = dosage;
        this.duration = duration;
        this.frequency = frequency;
        this.specialInstruction = specialInstruction;
    }
}

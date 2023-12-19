package com.almoatasem.demo.models.entitiy;

import com.almoatasem.demo.models.entitiy.user.DoctorEntity;
import com.almoatasem.demo.models.entitiy.user.PatientEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "treatment")
public class TreatmentEntity {

    private static List<String> treatments = new ArrayList<>();
    {
        treatments.add("Braces Metal");
        treatments.add("Braces Ceramic");
        treatments.add("Braces Lingual");
        treatments.add("Braces Invisalign");
        treatments.add("Clear aligners");
        treatments.add("Retainers");
        treatments.add("Palatal expanders");
        treatments.add("Headgear");
        treatments.add("Jaw repositioning appliances");
        treatments.add("Lip and cheek bumpers");
        treatments.add("Removable space maintainers");
        treatments.add("Splints for temporomandibular joint (TMJ) disorders");
        treatments.add("Surgical orthodontics");
        treatments.add("Dentofacial orthopedics");
        treatments.add("Orthodontic appliances for early intervention");
        treatments.add("Fixed and removable appliances for bite correction");
        treatments.add("Orthognathic surgery for severe jaw discrepancies");
        treatments.add("Treatment for impacted teeth");
        treatments.add("Crossbite correction");
        treatments.add("Open bite correction");
        treatments.add("Overbite correction");
        treatments.add("Underbite correction");
        treatments.add("Space closure");
        treatments.add("Protraction facemask therapy");
        treatments.add("Temporary anchorage devices (TADs)");
        treatments.add("Distalizers for molar movement");
        treatments.add("Habit appliances for thumb sucking or tongue thrusting");
        treatments.add("Tongue crib appliances");
        treatments.add("Cleft lip and palate orthodontic treatment");
        treatments.add("Orthodontic treatment for sleep apnea");
        treatments.add("Other");

    }

    public TreatmentEntity(DoctorEntity doctor, PatientEntity patient, String treatment, long cost) {
        this.doctor = doctor;
        this.patient = patient;
        this.treatment = treatment;
        this.cost = cost;
    }

    public TreatmentEntity(DoctorEntity doctor, PatientEntity patient, String treatment, long cost, int installementPeriodInMonths) {
        this.doctor = doctor;
        this.patient = patient;
        this.treatment = treatment;
        this.cost = cost;
        this.installementPeriodInMonths = installementPeriodInMonths;
    }

    @Id
    @Column(name = "treatment_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private DoctorEntity doctor;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientEntity patient;

    private String treatment;

    @CreatedDate
    @Setter(AccessLevel.NONE)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime treatmentDate;

    @LastModifiedDate
    @Setter(AccessLevel.NONE)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime lastModifiedDate;

    private long cost;

    private int installementPeriodInMonths;

}

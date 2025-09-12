package com.clinic.demo.models.entity;

import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@NoArgsConstructor
@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "treatment")
public class TreatmentEntity {

    
    public TreatmentEntity(EmployeeEntity doctor, PatientEntity patient, AppointmentEntity appointment, String treatment, int cost, int amountPaid, int installmentPeriodInMonths, float remainingBalance) {
        this.doctor = doctor;
        this.patient = patient;
        this.appointment = appointment;
        this.treatment = treatment;
        this.cost = cost;
        this.amountPaid = amountPaid;
        this.installmentPeriodInMonths = installmentPeriodInMonths;
        this.remainingBalance = remainingBalance;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private EmployeeEntity doctor;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientEntity patient;

    @Column(nullable = false)
    private String treatment;

    @ManyToOne
    @JoinColumn(name = "appointment_id", referencedColumnName = "id")
    private AppointmentEntity appointment;

    @CreatedDate
    @Setter(AccessLevel.NONE)
    private LocalDateTime treatmentDate;

    @LastModifiedDate
    @Setter(AccessLevel.NONE)
    private LocalDateTime lastModifiedDate;

    @Column(nullable = false)
    private int cost;

    @Column(name = "installment_period_in_months")
    private int installmentPeriodInMonths;

    @Column(name = "amount_paid")
    private int amountPaid;

    @Column(name = "remaining_balance")
    private float remainingBalance;

    private String notes;
}

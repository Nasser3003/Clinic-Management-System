package com.clinic.demo.models.entity;

import com.clinic.demo.models.entity.user.DoctorEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Table(name = "appointment")
@NoArgsConstructor
@Data
@Entity
public class AppointmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "doctor_id")
    private DoctorEntity doctor;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private PatientEntity patient;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "schedule_date_time")
    private LocalDateTime scheduleDateTime;

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL)
    private List<TreatmentEntity> treatment;

    @Column(name = "is_done")
    private boolean isDone;

    public AppointmentEntity(DoctorEntity doctor, PatientEntity patient, LocalDateTime scheduleDateTime) {
        this.doctor = doctor;
        this.patient = patient;
        this.scheduleDateTime = scheduleDateTime;
    }
}

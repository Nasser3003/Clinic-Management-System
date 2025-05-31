package com.clinic.demo.models.entity;

import com.clinic.demo.models.entity.user.EmployeeEntity;
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

    public AppointmentEntity(EmployeeEntity doctor, PatientEntity patient, LocalDateTime startDateTime, int durationInMins) {
        this.doctor = doctor;
        this.patient = patient;
        this.startDateTime = startDateTime;
        this.durationInMins = durationInMins;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "doctor_id")
    private EmployeeEntity doctor;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private PatientEntity patient;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "start_date_time")
    private LocalDateTime startDateTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "end_date_time")
    private LocalDateTime endDateTime;

    private int durationInMins;

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL)
    private List<TreatmentEntity> treatment;

    private String status;

    private boolean isDone;
}

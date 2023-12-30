package com.clinic.demo.models.entitiy;

import com.clinic.demo.models.entitiy.user.DoctorEntity;
import com.clinic.demo.models.entitiy.user.PatientEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table(name = "appointment_schedule")
@NoArgsConstructor
@Data
@Entity
public class AppointmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "doctor_id")
    private DoctorEntity doctor;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private PatientEntity patient;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime scheduleDateTime;
    private boolean isBooked;

    public AppointmentEntity(DoctorEntity doctor, PatientEntity patient, LocalDateTime scheduleDateTime) {
        this.doctor = doctor;
        this.patient = patient;
        this.scheduleDateTime = scheduleDateTime;
        isBooked = true;
    }
}

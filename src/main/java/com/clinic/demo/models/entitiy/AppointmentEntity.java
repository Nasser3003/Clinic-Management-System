package com.clinic.demo.models.entitiy;

import com.clinic.demo.models.entitiy.user.DoctorEntity;
import com.clinic.demo.models.entitiy.user.PatientEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Table(name = "appointment_schedule")
@NoArgsConstructor
@Data
@Entity
public class AppointmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "doctor_id")
    private DoctorEntity doctor;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private PatientEntity patient;

    private LocalDate scheduleDate;
    private LocalTime scheduleTime;
    private boolean isBooked;

    public AppointmentEntity(DoctorEntity doctor, PatientEntity patient, LocalDate scheduleDate, LocalTime scheduleTime) {
        this.doctor = doctor;
        this.patient = patient;
        this.scheduleTime = scheduleTime;
        this.scheduleDate = scheduleDate;
        isBooked = true;
    }

    public AppointmentEntity(DoctorEntity doctor, LocalDate scheduleDate, LocalTime scheduleTime) {
        this.doctor = doctor;
        this.scheduleTime = scheduleTime;
        this.scheduleDate = scheduleDate;
        isBooked = true;
    }
}

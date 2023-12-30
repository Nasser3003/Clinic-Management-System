package com.clinic.demo.repository;

import com.clinic.demo.models.entitiy.AppointmentEntity;
import com.clinic.demo.models.entitiy.user.DoctorEntity;
import com.clinic.demo.models.entitiy.user.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {
    Optional<AppointmentEntity> findByScheduleDateTimeAndPatientAndDoctor(LocalDateTime scheduleDateTime, PatientEntity patient, DoctorEntity doctor);
    Optional<AppointmentEntity> findScheduleEntitiesByPatient(PatientEntity patient);
    Optional<AppointmentEntity> findScheduleEntitiesByDoctor(DoctorEntity doctor);
    Optional<AppointmentEntity> findByScheduleDateTimeIsAfter(LocalDateTime afterDate);
    Optional<AppointmentEntity> findByScheduleDateTimeIsBefore(LocalDateTime beforeDate);
}

package com.clinic.demo.repository;

import com.clinic.demo.models.entity.AppointmentEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {
    Optional<AppointmentEntity> findByScheduleDateTimeAndPatientAndDoctor(LocalDateTime scheduleDateTime, PatientEntity patient, EmployeeEntity doctor);
    Optional<AppointmentEntity> findScheduleEntitiesByPatient(PatientEntity patient);
    Optional<AppointmentEntity> findScheduleEntitiesByDoctor(EmployeeEntity doctor);
    Optional<AppointmentEntity> findByScheduleDateTimeIsAfter(LocalDateTime afterDate);
    Optional<AppointmentEntity> findByScheduleDateTimeIsBefore(LocalDateTime beforeDate);
}

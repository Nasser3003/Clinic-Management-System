package com.clinic.demo.repository;

import com.clinic.demo.models.entity.AppointmentEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {
    int deleteAppointmentById(UUID id);
    Optional<AppointmentEntity> findById(UUID id);
    Optional<AppointmentEntity> findByStartDateTimeAfterAndPatientAndDoctor(LocalDateTime startDateTime, PatientEntity patient, EmployeeEntity doctor);
    Optional<AppointmentEntity> findByPatient(PatientEntity patient, Sort sort);
    List<AppointmentEntity> findAllByPatient(PatientEntity patient);
    List<AppointmentEntity> findAllByDoctor(EmployeeEntity doctor);
    List<AppointmentEntity> findAllByDoctorAndIsDoneIsFalseAndStartDateTimeBeforeAndEndDateTimeAfter(EmployeeEntity doctor, LocalDateTime startDateTime, LocalDateTime endDateTime);
    Optional<AppointmentEntity> findByStartDateTimeIsAfter(LocalDateTime afterDate);
    Optional<AppointmentEntity> findByStartDateTimeIsBefore(LocalDateTime beforeDate);

    List<AppointmentEntity> findByPatient_EmailAndStartDateTimeBetween(String patientEmail, LocalDateTime start, LocalDateTime end);
//    List<AppointmentEntity> findByPatientEmailAndStartDateTimeBetween(String patientEmail, LocalDateTime localDateTime, LocalDateTime localDateTime1);

}

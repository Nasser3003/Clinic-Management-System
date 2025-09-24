package com.clinic.demo.repository;

import com.clinic.demo.models.entity.AppointmentEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import com.clinic.demo.models.enums.AppointmentStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, UUID> {
    Optional<AppointmentEntity> findByStartDateTimeAfterAndPatientAndDoctor(LocalDateTime startDateTime, PatientEntity patient, EmployeeEntity doctor);
    Optional<AppointmentEntity> findByPatient(PatientEntity patient, Sort sort);
    List<AppointmentEntity> findAllByPatient(PatientEntity patient);
    List<AppointmentEntity> findAllByDoctor(EmployeeEntity doctor);

    List<AppointmentEntity> findByStatusAndPatient_EmailAndStartDateTimeBetween(
            AppointmentStatus status, String patientEmail, LocalDateTime start, LocalDateTime end);

    Optional<AppointmentEntity> findByStartDateTimeIsAfter(LocalDateTime afterDate);
    Optional<AppointmentEntity> findByStartDateTimeIsBefore(LocalDateTime beforeDate);
    List<AppointmentEntity> findByStartDateTimeBetween(LocalDateTime startOfMonth, LocalDateTime endOfMonth);
    List<AppointmentEntity> findByPatient_EmailAndStartDateTimeBetween(String patientEmail, LocalDateTime start, LocalDateTime end);
    long countByStartDateTimeBetween(LocalDateTime startOfMonth, LocalDateTime endOfMonth);

    List<AppointmentEntity> findByStatusAndDoctor_EmailAndStartDateTimeBetween(
            AppointmentStatus status, String doctorEmail, LocalDateTime start, LocalDateTime end);

    List<AppointmentEntity> findByPatient_EmailAndDoctor_EmailAndStatusAndStartDateTimeBetween(
            String patientEmail,
            String doctorEmail,
            AppointmentStatus status,
            LocalDateTime start,
            LocalDateTime end
    );
    List<AppointmentEntity> findByStatus(AppointmentStatus status);
    List<AppointmentEntity> findByDoctorAndStatus(EmployeeEntity doctor, AppointmentStatus status);
    long countByStatus(AppointmentStatus status);

    @Query("SELECT a FROM AppointmentEntity a WHERE " +
            "(:patientEmail IS NULL OR a.patient.email = :patientEmail) AND " +
            "(:doctorEmail IS NULL OR a.doctor.email = :doctorEmail) AND " +
            "(:status IS NULL OR a.status = :status) AND " +
            "(:startDate IS NULL OR a.startDateTime >= :startDate) AND " +
            "(:endDate IS NULL OR a.startDateTime <= :endDate) " +
            "ORDER BY a.startDateTime ASC")
    List<AppointmentEntity> findAppointmentsWithOptionalFilters(
            @Param("patientEmail") String patientEmail,
            @Param("doctorEmail") String doctorEmail,
            @Param("status") AppointmentStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    List<AppointmentEntity> findByDoctorEmailAndPatientEmailAndStatus(String doctorEmail, String patientEmail, AppointmentStatus status);

    List<AppointmentEntity> findAllByStatus(AppointmentStatus status);

    List<AppointmentEntity> findAllByStatusAndStartDateTimeBefore(AppointmentStatus appointmentStatus, LocalDateTime cutoff);
}
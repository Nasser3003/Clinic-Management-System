package com.clinic.demo.repository;

import com.clinic.demo.models.entity.TreatmentEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import com.clinic.demo.models.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TreatmentRepository extends JpaRepository<TreatmentEntity, UUID> {
    Optional<TreatmentEntity> findByCost(Long cost);
    Optional<TreatmentEntity> findByCostLessThan(Long costsLessThan);
    List<TreatmentEntity> findAllByPatient(PatientEntity patientEntity);
    List<TreatmentEntity> findAllByDoctor(EmployeeEntity employeeEntity);
    List<TreatmentEntity> findAllByPatientAndDoctor(PatientEntity patientEntity, EmployeeEntity employeeEntity);
    List<TreatmentEntity> findAllByAppointmentStartDateTimeAfterAndAppointmentStatus(LocalDateTime dateTime, AppointmentStatus status);


    @Query("SELECT t FROM TreatmentEntity t " +
            "WHERE (:doctorEmail IS NULL OR t.doctor.email = :doctorEmail) " +
            "AND (:patientEmail IS NULL OR t.patient.email = :patientEmail) " +
            "AND (CAST(:fromDate AS timestamp) IS NULL OR t.treatmentDate >= :fromDate) " +
            "AND (CAST(:toDate AS timestamp) IS NULL OR t.treatmentDate <= :toDate) " +
            "ORDER BY t.treatmentDate DESC")
    List<TreatmentEntity> findTreatmentsBasicFilters(
            @Param("doctorEmail") String doctorEmail,
            @Param("patientEmail") String patientEmail,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate
    );

}

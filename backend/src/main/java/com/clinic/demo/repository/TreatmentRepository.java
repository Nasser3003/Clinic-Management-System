package com.clinic.demo.repository;

import com.clinic.demo.models.entity.TreatmentEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface TreatmentRepository extends JpaRepository<TreatmentEntity, Long> {
    Optional<TreatmentEntity> findByCost(Long cost);
    Optional<TreatmentEntity> findByCostLessThan(Long costsLessThan);
    List<TreatmentEntity> findAllByPatient(PatientEntity patientEntity);
    Optional<TreatmentEntity> findAllByDoctor(EmployeeEntity employeeEntity);
}

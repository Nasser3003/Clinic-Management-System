package com.almoatasem.demo.repository;

import com.almoatasem.demo.models.entitiy.Treatment;
import com.almoatasem.demo.models.entitiy.user.Doctor;
import com.almoatasem.demo.models.entitiy.user.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface TreatmentRepository extends JpaRepository<Treatment, Long> {
    Optional<Treatment> findByCost(Long cost);
    Optional<Treatment> findByCostLessThan(Long costsLessThan);
    List<Treatment> findAllByPatient(Patient patient);
    Optional<Treatment> findAllByDoctor(Doctor doctor);

}

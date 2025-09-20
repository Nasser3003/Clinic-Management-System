package com.clinic.demo.repository;

import com.clinic.demo.models.entity.user.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PatientRepository extends JpaRepository<PatientEntity, UUID> {

}

package com.clinic.demo.repository;

import com.clinic.demo.models.entity.PrescriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionRepository extends JpaRepository< PrescriptionEntity, Long> {


}

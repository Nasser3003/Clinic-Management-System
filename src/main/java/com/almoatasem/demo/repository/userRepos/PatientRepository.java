package com.almoatasem.demo.repository.userRepos;

import com.almoatasem.demo.models.entitiy.user.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<PatientEntity, Long> {
    Optional<PatientRepository> findByEmail(String email);
    Optional<PatientRepository> findByUsername(String username);

}

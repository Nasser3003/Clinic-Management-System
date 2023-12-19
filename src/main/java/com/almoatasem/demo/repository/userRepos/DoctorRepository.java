package com.almoatasem.demo.repository.userRepos;

import com.almoatasem.demo.models.entitiy.user.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<DoctorRepository> findByEmail(String email);
    Optional<DoctorRepository> findByUsername(String username);

}

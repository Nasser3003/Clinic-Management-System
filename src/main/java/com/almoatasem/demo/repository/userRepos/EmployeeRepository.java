package com.almoatasem.demo.repository.userRepos;

import com.almoatasem.demo.models.entitiy.user.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Long> {
    Optional<EmployeeRepository> findByEmail(String email);
    Optional<EmployeeRepository> findByUsername(String username);

}

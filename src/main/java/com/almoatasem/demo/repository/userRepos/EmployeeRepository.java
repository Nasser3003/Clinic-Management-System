package com.almoatasem.demo.repository.userRepos;

import com.almoatasem.demo.models.entitiy.user.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<EmployeeRepository> findByEmail(String email);
    Optional<EmployeeRepository> findByUsername(String username);

}

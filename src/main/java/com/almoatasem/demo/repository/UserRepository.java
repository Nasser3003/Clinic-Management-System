package com.almoatasem.demo.repository;

import com.almoatasem.demo.models.entitiy.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserInfo, Long> {
    Optional<UserInfo> findByEmail(String email);
    Optional<UserInfo> findByUsername(String username);

}

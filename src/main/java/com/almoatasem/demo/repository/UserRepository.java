package com.almoatasem.demo.repository;

import com.almoatasem.demo.model.entitiy.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<UserInfo, UUID> {
}

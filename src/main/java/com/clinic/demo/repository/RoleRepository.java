package com.clinic.demo.repository;

import com.clinic.demo.models.entitiy.RoleEntity;
import com.clinic.demo.models.enums.AuthorityEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<RoleEntity, Long> {
    Optional<RoleEntity> findByAuthority(AuthorityEnum authority);
}

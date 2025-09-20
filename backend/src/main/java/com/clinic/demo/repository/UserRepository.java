package com.clinic.demo.repository;

import com.clinic.demo.models.entity.user.BaseUserEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.enums.UserTypeEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<BaseUserEntity, UUID> {
    Optional<BaseUserEntity> findByEmail(String aEmail);
    Optional<BaseUserEntity> findByPhoneNumber(String aPhoneNumber);


    List<BaseUserEntity> findAllById(Iterable<UUID> ids);

    List<EmployeeEntity> findALlByUserType(UserTypeEnum userType);

    long countByUserType(UserTypeEnum userType);

    long countAllByUserTypeAndIsEnabled(UserTypeEnum userTypeEnum, boolean b);
}

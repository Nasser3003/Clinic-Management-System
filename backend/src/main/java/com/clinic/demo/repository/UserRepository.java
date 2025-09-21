package com.clinic.demo.repository;

import com.clinic.demo.models.entity.user.BaseUserEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.enums.UserTypeEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("SELECT u FROM BaseUserEntity u WHERE u.userType IN :userTypes AND " +
            "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
            "u.isDeleted = false")
    Page<BaseUserEntity> findAllByUserTypesAndName(@Param("userTypes") List<UserTypeEnum> userTypes,
                                                   @Param("searchTerm") String searchTerm,
                                                   Pageable pageable);

    // Fix 2: Change entity name from User to BaseUserEntity
    @Query("SELECT u FROM BaseUserEntity u WHERE u.userType = :userType AND " +
            "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
            "u.isDeleted = false")
    Page<BaseUserEntity> findAllByUserTypeAndName(@Param("userType") UserTypeEnum userType,
                                                  @Param("searchTerm") String searchTerm,
                                                  Pageable pageable);

    long countByUserType(UserTypeEnum userType);

    long countAllByUserTypeAndIsEnabled(UserTypeEnum userTypeEnum, boolean b);
}

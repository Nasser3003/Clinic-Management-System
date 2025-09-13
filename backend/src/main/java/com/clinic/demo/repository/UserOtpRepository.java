package com.clinic.demo.repository;

import com.clinic.demo.models.entity.UserOtpEntity;
import com.clinic.demo.models.enums.OtpPurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserOtpRepository extends JpaRepository<UserOtpEntity, Long> {
    Optional<UserOtpEntity> findByEmailAndOtpAndPurpose(String email, String Otp, OtpPurpose purpose);

    @Query("DELETE FROM UserOtpEntity u WHERE u.createdAt < :expiredBefore OR u.used = true")
    @Modifying
    void cleanupExpiredAndUsedOtps(@Param("expiredBefore") LocalDateTime expiredBefore);
}

package com.clinic.demo.models.entity;

import com.clinic.demo.models.enums.OtpPurpose;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "user_otp")
@Data
public class UserOtpEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String otp;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OtpPurpose purpose;
    
    @Column(nullable = false)
    private boolean used = false;

    public boolean isExpired() {
        return createdAt == null ||
                createdAt.isBefore(LocalDateTime.now().minusMinutes(10));
    }

}


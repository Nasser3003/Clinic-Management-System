package com.clinic.demo.models.entity.user;

import com.clinic.demo.models.entity.RoleEntity;
import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "user_admin")
public class AdminEntity extends BaseUserEntity {

    // Admin-specific fields
    @Column(length = 100)
    private String department; // IT, HR, Management, etc.

    @Column
    private LocalDateTime lastLoginDate;

    @Column(length = 500)
    private String adminNotes; // Internal notes about the admin

    // Constructor
    public AdminEntity(String firstName, String lastName, String email, String phoneNumber,
                       String nationalId, GenderEnum gender, String password,
                       LocalDate dateOfBirth, Set<RoleEntity> roles) {
        super(firstName, lastName, email, phoneNumber, gender, UserTypeEnum.ADMIN,
                password, dateOfBirth, roles);
        this.setNationalId(nationalId);
    }

    // Constructor with department
    public AdminEntity(String firstName, String lastName, String email, String phoneNumber,
                       String nationalId, GenderEnum gender, String password,
                       LocalDate dateOfBirth, String department, Set<RoleEntity> roles) {
        this(firstName, lastName, email, phoneNumber, nationalId, gender, password,
                dateOfBirth, roles);
        this.department = department;
    }

    // Utility methods
    public void updateLastLogin() {
        this.lastLoginDate = LocalDateTime.now();
    }

    public boolean isRecentLogin() {
        return lastLoginDate != null &&
                lastLoginDate.isAfter(LocalDateTime.now().minusDays(30));
    }
}
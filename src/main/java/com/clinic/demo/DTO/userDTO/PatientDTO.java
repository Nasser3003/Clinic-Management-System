package com.clinic.demo.DTO.userDTO;

import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.UserTypeEnum;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

public record PatientDTO(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String username,
        GenderEnum gender,
        UserTypeEnum userType,
        String nationalId,
        LocalDate dateOfBirth,
        Set<String> authorities,
        boolean isDeleted,
        LocalDateTime createDate,
        LocalDateTime lastModifiedDate,
        boolean isAccountNonExpired,
        boolean isAccountNonLocked,
        boolean isCredentialsNonExpired,
        String emergencyContactName,
        String emergencyContactNumber,
        boolean isEnabled,
        String notes,

        Set<String> allergies,
        Set<String> healthIssues,
        Set<String> prescriptions
) implements UserDTO {
    public PatientDTO {
        Objects.requireNonNull(email, "Email cannot be null");
        if (email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        Objects.requireNonNull(firstName, "First name cannot be null");
        Objects.requireNonNull(lastName, "Last name cannot be null");
        Objects.requireNonNull(gender, "Gender cannot be null");
        Objects.requireNonNull(userType, "User type cannot be null");
        Objects.requireNonNull(authorities, "Authorities cannot be null");
    }
}
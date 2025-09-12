package com.clinic.demo.DTO.userDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public record PatientDTO(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String username,
        String gender,
        String userType,
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
}
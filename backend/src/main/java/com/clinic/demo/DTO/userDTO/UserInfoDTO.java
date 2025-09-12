package com.clinic.demo.DTO.userDTO;

import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.UserTypeEnum;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public record UserInfoDTO(
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
        boolean isEnabled,
        String emergencyContactName,
        String emergencyContactNumber,
        String notes
) {
}
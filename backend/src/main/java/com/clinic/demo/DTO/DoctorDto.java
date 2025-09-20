package com.clinic.demo.DTO;

import com.clinic.demo.models.enums.EmploymentStatusEnum;
import com.clinic.demo.models.enums.GenderEnum;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record DoctorDto(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String nationalId,
        LocalDate dateOfBirth,
        GenderEnum gender,
        String title,
        String avatarPath,

        // Employee-specific fields
        String department,
        EmploymentStatusEnum employmentStatus,
        float salary,
        String description,

        // Account status
        boolean isEnabled,
        boolean isDeleted,

        // Audit fields
        LocalDateTime createDate,
        LocalDateTime lastModifiedDate,

        // Additional computed fields
        String fullName,
        String displayName,
        int age
) {
}
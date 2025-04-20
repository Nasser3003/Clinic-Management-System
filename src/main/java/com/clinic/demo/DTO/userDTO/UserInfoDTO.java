package com.clinic.demo.DTO.userDTO;

import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.UserTypeEnum;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

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
    // Email regex pattern - basic validation
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    // Phone regex pattern - allows various formats
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+?[0-9]{10,15}$");

    public UserInfoDTO {
        Objects.requireNonNull(email, "Email cannot be null");
        if (email.trim().isEmpty()) throw new IllegalArgumentException("Email cannot be empty");
        if (!EMAIL_PATTERN.matcher(email).matches()) throw new IllegalArgumentException("Invalid email format");

        Objects.requireNonNull(firstName, "First name cannot be null");
        if (firstName.trim().isEmpty()) throw new IllegalArgumentException("First name cannot be empty");

        Objects.requireNonNull(lastName, "Last name cannot be null");
        if (lastName.trim().isEmpty()) throw new IllegalArgumentException("Last name cannot be empty");

        Objects.requireNonNull(gender, "Gender cannot be null");
        Objects.requireNonNull(userType, "User type cannot be null");
        Objects.requireNonNull(authorities, "Authorities cannot be null");

        if (phoneNumber != null && !phoneNumber.isEmpty() && !PHONE_PATTERN.matcher(phoneNumber).matches())
            throw new IllegalArgumentException("Invalid phone number format");

        if (username != null && username.trim().isEmpty())
            throw new IllegalArgumentException("Username cannot be empty if provided");

        if (dateOfBirth != null && dateOfBirth.isAfter(LocalDate.now()))
            throw new IllegalArgumentException("Date of birth cannot be in the future");

        if (nationalId != null && nationalId.trim().isEmpty())
            throw new IllegalArgumentException("National ID cannot be empty if provided");
    }
}
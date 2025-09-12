package com.clinic.demo.DTO;

public record UserProfileDTO(
        String id,
        String email,
        String firstName,
        String lastName,
        String role,
        String nationalId,
        String phoneNumber,
        String gender,
        String dateOfBirth,
        String emergencyContactName,
        String emergencyContactNumber
) {}

package com.clinic.demo.DTO.userDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public sealed interface UserDTO permits BaseUserDTO, EmployeeDTO, PatientDTO {
    UUID id();
    @NotBlank(message = "First name is required")
    String firstName();
    @NotBlank(message = "Last name is required")
    String lastName();
    @NotBlank(message = "Email is required")
    String email();
    @NotBlank(message = "Phone Number is required")
    String phoneNumber();
    String username();
    @NotBlank(message = "gender is required")
    String gender();
    @NotBlank(message = "userType is required")
    String userType();
    String nationalId();
    @NotNull(message = "dateOfBirth is required")
    LocalDate dateOfBirth();
    @NotNull(message = "authorities is required")
    Set<String> authorities();
    boolean isDeleted();
    LocalDateTime createDate();
    LocalDateTime lastModifiedDate();
    boolean isAccountNonExpired();
    boolean isAccountNonLocked();
    boolean isCredentialsNonExpired();
    boolean isEnabled();
    String emergencyContactName();
    String emergencyContactNumber();
    String notes();
}
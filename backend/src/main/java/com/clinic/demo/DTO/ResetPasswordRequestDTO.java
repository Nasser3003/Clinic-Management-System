package com.clinic.demo.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ResetPasswordDTO(
    @Email @NotBlank String email,
    @NotBlank String otp,
    @NotBlank String newPassword,
    @NotBlank String confirmNewPassword
) {}
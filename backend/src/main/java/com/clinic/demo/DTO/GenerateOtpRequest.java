package com.clinic.demo.DTO;

import com.clinic.demo.models.enums.OtpPurpose;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GenerateOtpRequest(
        @Email @NotBlank String email,
        @NotNull OtpPurpose purpose
) {
}
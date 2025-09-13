package com.clinic.demo.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record TwoFactorRequestDTO(@Email @NotBlank String email) {
}

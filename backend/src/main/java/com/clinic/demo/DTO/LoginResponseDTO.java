package com.clinic.demo.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LoginResponseDTO(
        @NotBlank(message = "JWT is required")
        String jwt,

        @NotNull(message = "User data is required")
        UserProfileDTO user
) {}

package com.clinic.demo.DTO;

import com.clinic.demo.models.enums.GenderEnum;

public record UserInfoDTO (
        String firstName,
        String lastName,
        String email,
        String phone,
        GenderEnum gender
) {}

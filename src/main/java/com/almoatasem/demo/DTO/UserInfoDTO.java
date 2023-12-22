package com.almoatasem.demo.DTO;

import com.almoatasem.demo.models.enums.GenderEnum;

public record UserInfoDTO (
        String username,
        String firstName,
        String lastName,
        String email,
        GenderEnum gender) {}

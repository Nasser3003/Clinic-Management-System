package com.almoatasem.demo.DTO;

import com.almoatasem.demo.models.entitiy.UserInfo;

public record LoginResponseDTO(UserInfo userInfo, String jwt) {
}

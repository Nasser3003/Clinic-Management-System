package com.almoatasem.demo.DTO;

import com.almoatasem.demo.models.entitiy.user.UserInfo;

public record LoginResponseDTO(UserInfo userInfo, String jwt) {
}

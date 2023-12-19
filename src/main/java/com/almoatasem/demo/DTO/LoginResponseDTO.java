package com.almoatasem.demo.DTO;

import com.almoatasem.demo.models.entitiy.user.AbstractUserEntity;

public record LoginResponseDTO(AbstractUserEntity abstractUserEntity, String jwt) {
}

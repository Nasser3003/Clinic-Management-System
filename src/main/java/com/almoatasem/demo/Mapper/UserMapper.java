package com.almoatasem.demo.Mapper;

import com.almoatasem.demo.DTO.UserInfoDTO;
import com.almoatasem.demo.models.entitiy.user.AbstractUserEntity;

public class UserMapper {

    public static UserInfoDTO convertToDTO(AbstractUserEntity abstractUserEntity) {
        return new UserInfoDTO(
                abstractUserEntity.getFirstName(),
                abstractUserEntity.getLastName(),
                abstractUserEntity.getEmail(),
                abstractUserEntity.getGender()
        );
    }
}

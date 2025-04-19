package com.clinic.demo.Mapper;

import com.clinic.demo.DTO.UserInfoDTO;
import com.clinic.demo.models.entity.user.AbstractUserEntity;

public class UserMapper {

    public static UserInfoDTO convertToDTO(AbstractUserEntity abstractUserEntity) {
        return new UserInfoDTO(
                abstractUserEntity.getFirstName(),
                abstractUserEntity.getLastName(),
                abstractUserEntity.getEmail(),
                abstractUserEntity.getPhoneNumber(),
                abstractUserEntity.getGender()
        );
    }
}

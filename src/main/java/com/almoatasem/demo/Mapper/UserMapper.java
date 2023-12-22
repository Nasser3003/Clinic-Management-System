package com.almoatasem.demo.Mapper;

import com.almoatasem.demo.DTO.UserInfoDTO;
import com.almoatasem.demo.models.entitiy.user.AbstractUserEntity;
import org.modelmapper.ModelMapper;

public class UserMapper {
    private static final ModelMapper modelMapper = new ModelMapper();

    static {
        modelMapper.getConfiguration().setSkipNullEnabled(true);
    }

    public static UserInfoDTO convertToDTO(AbstractUserEntity abstractUserEntity) {
        return modelMapper.map(abstractUserEntity, UserInfoDTO.class);
    }
}

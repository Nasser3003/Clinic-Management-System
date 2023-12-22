package com.almoatasem.demo.service;

import com.almoatasem.demo.DTO.UserInfoDTO;
import com.almoatasem.demo.Mapper.UserMapper;
import com.almoatasem.demo.exception.RequestValidationException;
import com.almoatasem.demo.models.entitiy.user.AbstractUserEntity;
import com.almoatasem.demo.repository.userRepos.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class AdminService {

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserInfoDTO> selectAllUsers() {

        List<AbstractUserEntity> users = userRepository.findAll();
        return users
                .stream()
                .map(UserMapper::convertToDTO)
                .collect(Collectors.toList());
    }
    public UserInfoDTO selectUserByEmail(String email) {
        AbstractUserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new RequestValidationException("No user with that email"));
        return UserMapper.convertToDTO(user);
    }

}

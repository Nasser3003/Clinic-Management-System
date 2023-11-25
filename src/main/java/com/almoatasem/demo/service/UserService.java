package com.almoatasem.demo.service;

import com.almoatasem.demo.exception.RequestValidationException;
import com.almoatasem.demo.models.entitiy.Role;
import com.almoatasem.demo.models.entitiy.UserInfo;
import com.almoatasem.demo.DTO.RegistrationDTO;
import com.almoatasem.demo.repository.RoleRepository;
import com.almoatasem.demo.repository.UserRepository;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, PasswordEncoder encoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.roleRepository = roleRepository;
    }

    public List<UserInfo> selectAllUsers() {
        return userRepository.findAll();
    }

    public UserInfo selectUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RequestValidationException("No user with that email"));
    }
    public UserInfo selectUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RequestValidationException("No user with that username"));
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("there is no user with that name"));
    }
}

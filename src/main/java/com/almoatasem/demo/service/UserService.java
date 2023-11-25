package com.almoatasem.demo.service;

import com.almoatasem.demo.exception.RequestValidationException;
import com.almoatasem.demo.models.entitiy.UserInfo;
import com.almoatasem.demo.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserInfo> selectAllUsers() {
        return userRepository.findAll();
    }

    public UserInfo selectUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RequestValidationException("No user with that email"));
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("there is no user with that name"));
    }
}

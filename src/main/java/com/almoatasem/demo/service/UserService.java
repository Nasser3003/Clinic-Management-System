package com.almoatasem.demo.service;

import com.almoatasem.demo.exception.RequestValidationException;
import com.almoatasem.demo.models.entitiy.UserInfo;
import com.almoatasem.demo.models.enums.GENDER;
import com.almoatasem.demo.models.requests.RegisterUserRequest;
import com.almoatasem.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import java.security.Key;
import java.util.List;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder encoder) {
        this.encoder = encoder;
        this.userRepository = userRepository;
    }

    public List<UserInfo> selectAllUsers() {
        return userRepository.findAll();
    }
    public void saveUser(RegisterUserRequest registerUserRequest) throws Exception {
        try {
            UserInfo user = new UserInfo(
                    registerUserRequest.firstName(),
                    registerUserRequest.lastName(),
                    registerUserRequest.email(),
                    registerUserRequest.dateOfBirth(),
                    GENDER.valueOf(registerUserRequest.gender()),
                    registerUserRequest.username(),
                    encoder.encode(registerUserRequest.password())
            );
            userRepository.save(user);
        } catch (DataAccessException e) {
            e.printStackTrace();
        }
    }
    public UserInfo selectUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RequestValidationException("No user with that id"));
    }

}

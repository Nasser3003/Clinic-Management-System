package com.almoatasem.demo.service;

import com.almoatasem.demo.exception.RequestValidationException;
import com.almoatasem.demo.models.entitiy.UserInfo;
import com.almoatasem.demo.models.enums.GENDER;
import com.almoatasem.demo.models.requests.RegisterUserRequest;
import com.almoatasem.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserInfo> selectAllUsers() {
        return userRepository.findAll();
    }
    public void saveUser(RegisterUserRequest registerUserRequest) throws RequestValidationException {
        try {
            UserInfo user = new UserInfo(registerUserRequest.firstName(),
                    registerUserRequest.lastName(), registerUserRequest.email(),
                    registerUserRequest.dateOfBirth(), GENDER.valueOf(registerUserRequest.gender()));
            userRepository.save(user);
        } catch (DataAccessException e) {
            e.printStackTrace();
        }
    }
    public UserInfo selectUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RequestValidationException("No user with that id"));
    }
}

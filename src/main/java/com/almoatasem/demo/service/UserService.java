package com.almoatasem.demo.service;

import com.almoatasem.demo.exception.RequestValidationException;
import com.almoatasem.demo.model.entitiy.UserInfo;
import com.almoatasem.demo.model.requests.RegisterUserRequest;
import com.almoatasem.demo.repository.UserRepository;
import com.almoatasem.demo.model.enums.GENDER;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.almoatasem.demo.utils.DateManipulation.parseDate;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserInfo> selectAllUsers() {
        return userRepository.findAll();
    }
    public void saveUser(RegisterUserRequest registerUserRequest) {
        try {
            UserInfo user = new UserInfo(UUID.randomUUID(), registerUserRequest.firstName(),
                    registerUserRequest.lastName(), registerUserRequest.email(),
                    parseDate(registerUserRequest.dateOfBirth()), GENDER.valueOf(registerUserRequest.gender()));
            userRepository.save(user);
        } catch (DataAccessException e) {
            System.out.println("Error1Error2Error3 in: UserService -> saveUser");
        }
    }
    public UserInfo selectUser(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> new RequestValidationException("No user with that id"));
    }

}

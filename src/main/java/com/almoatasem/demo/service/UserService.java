package com.almoatasem.demo.service;

import com.almoatasem.demo.exception.RequestValidationException;
import com.almoatasem.demo.model.entitiy.UserInfo;
import com.almoatasem.demo.model.enums.GENDER;
import com.almoatasem.demo.model.requests.RegisterUserRequest;
import com.almoatasem.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import static com.almoatasem.demo.utils.DateManipulation.parseDate;


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
            UserInfo user = new UserInfo(UUID.randomUUID(), registerUserRequest.firstName(),
                    registerUserRequest.lastName(), registerUserRequest.email(),
                    parseDate(registerUserRequest.dateOfBirth()), GENDER.valueOf(registerUserRequest.gender()));
            userRepository.save(user);
        } catch (DataAccessException e) {
            throw new RequestValidationException("Error1Error2Error3: UserService >> saveUser");
        }
    }
    public UserInfo selectUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RequestValidationException("No user with that id"));
    }
}

package com.almoatasem.demo.service;

import com.almoatasem.demo.model.UserInfo;
import com.almoatasem.demo.repository.UserRepository;
import com.almoatasem.demo.enums.GENDER;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import static com.almoatasem.demo.utils.DateManipulation.parseDate;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserInfo> selectAllUsers() {
        return userRepository.findAll();
    }
    public void saveUser(String firstName, String lastName, String email, String dateOfBirth, String gender) {
        UserInfo user = new UserInfo(UUID.randomUUID(), firstName, lastName, email,
                parseDate(dateOfBirth), GENDER.valueOf(gender));

        try {
            userRepository.save(user);
        } catch (DataAccessException e) {
            System.out.println("Error1Error2Error3 in: userRepo SAVE");
        }
    }

}

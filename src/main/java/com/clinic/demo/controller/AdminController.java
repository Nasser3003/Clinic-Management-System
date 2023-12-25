package com.clinic.demo.controller;

import com.clinic.demo.DTO.UserInfoDTO;
import com.clinic.demo.Mapper.UserMapper;
import com.clinic.demo.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/admin")
@CrossOrigin("*") // will need in the future
public class AdminController {
    private final UserService userService;

    @GetMapping("/all")
    public List<UserInfoDTO> getAllUsers() {
       return userService.selectAllUsers();
    }

    @GetMapping("/email/{email}")
    public UserInfoDTO getUserByEmail (@PathVariable("email") String email) {
        return UserMapper.convertToDTO(userService.selectUserByEmail(email));
    }
}

package com.almoatasem.demo.controller;

import com.almoatasem.demo.model.UserInfo;
import com.almoatasem.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public List<UserInfo> getAllUsers() {
        return userService.selectAllUsers();
    }
    @PostMapping()
    public void registerUser() {
    }

}

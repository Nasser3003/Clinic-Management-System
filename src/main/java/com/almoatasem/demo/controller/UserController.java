package com.almoatasem.demo.controller;

import com.almoatasem.demo.model.entitiy.UserInfo;
import com.almoatasem.demo.model.requests.RegisterUserRequest;
import com.almoatasem.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public List<UserInfo> getAllUsers() {
        return userService.selectAllUsers();
    }
    @GetMapping("/{userId}")
    public UserInfo getUser (@PathVariable("userId") UUID id) {
        return userService.selectUser(id);
    }
    @PostMapping("/register")
    public void registerUser(@RequestBody RegisterUserRequest registerUserRequest) {
        userService.saveUser(registerUserRequest);
    }
}

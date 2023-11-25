package com.almoatasem.demo.controller;

import com.almoatasem.demo.models.entitiy.UserInfo;
import com.almoatasem.demo.models.requests.RegisterUserRequest;
import com.almoatasem.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
//@CrossOrigin() will need in the future
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/all")
    public List<UserInfo> getAllUsers() {
        return userService.selectAllUsers();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{email}")
    public UserInfo getUser (@PathVariable("email") String email) {
        return userService.selectUserByEmail(email);
    }
    @PostMapping("/register")
    public void registerUser(@RequestBody RegisterUserRequest registerUserRequest) throws Exception {
        userService.saveUser(registerUserRequest);
    }
}

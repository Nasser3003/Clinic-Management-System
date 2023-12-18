package com.almoatasem.demo.controller;

import com.almoatasem.demo.models.entitiy.UserInfo;
import com.almoatasem.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*") // will need in the future
public class AdminController {

    private final UserService userService;

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }

//    NEED TO MAKE THIS ONLY FOR ADMIN
    @GetMapping("/all")
    public List<UserInfo> getAllUsers() {
        return userService.selectAllUsers();
    }

    //    NEED TO MAKE THIS ONLY FOR ADMIN
    @GetMapping("/{email}")
    public UserInfo getUser (@PathVariable("email") String email) {
        return userService.selectUserByEmail(email);
    }


}

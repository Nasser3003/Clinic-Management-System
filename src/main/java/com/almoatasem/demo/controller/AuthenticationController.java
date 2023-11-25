package com.almoatasem.demo.controller;

import com.almoatasem.demo.models.entitiy.UserInfo;
import com.almoatasem.demo.DTO.RegistrationDTO;
import com.almoatasem.demo.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*") // need to change in the future
public class AuthenticationController {
    private AuthenticationService authenticationService;
    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public UserInfo registerUser(@RequestBody RegistrationDTO registrationDTO) throws Exception {
        return authenticationService.registerUser(
                registrationDTO.username()
                ,registrationDTO.email()
                ,registrationDTO.password());
    }
}

package com.almoatasem.demo.controller;

import com.almoatasem.demo.DTO.LoginDTO;
import com.almoatasem.demo.DTO.LoginResponseDTO;
import com.almoatasem.demo.DTO.RegistrationDTO;
import com.almoatasem.demo.service.AuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/auth")
@CrossOrigin("*") // need to change in the future
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public void registerUser(@RequestBody RegistrationDTO registrationDTO) {
        authenticationService.registerUser(
                registrationDTO.username()
                ,registrationDTO.email()
                ,registrationDTO.password());
    }
    @PostMapping("/login")
    public LoginResponseDTO loginUser(@RequestBody LoginDTO loginDTO) {
        return authenticationService.loginUser(loginDTO.username(), loginDTO.password());
    }
}

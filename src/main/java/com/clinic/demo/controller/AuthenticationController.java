package com.clinic.demo.controller;

import com.clinic.demo.DTO.LoginDTO;
import com.clinic.demo.DTO.LoginResponseDTO;
import com.clinic.demo.DTO.registrationDTO.RegistrationDTO;
import com.clinic.demo.service.AuthenticationService;
import jakarta.validation.Valid;
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
    public void registerUser(@Valid @RequestBody RegistrationDTO registrationDTO) {
            authenticationService.registerUser(registrationDTO);
    }
    @PostMapping("/login")
    public LoginResponseDTO loginUser(@RequestBody LoginDTO loginDTO) {
        return authenticationService.loginUser(loginDTO.email(), loginDTO.password());
    }
}


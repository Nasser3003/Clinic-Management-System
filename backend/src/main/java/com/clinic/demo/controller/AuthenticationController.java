package com.clinic.demo.controller;

import com.clinic.demo.DTO.*;
import com.clinic.demo.DTO.registrationDTO.RegistrationDTO;
import com.clinic.demo.models.enums.OtpPurpose;
import com.clinic.demo.service.AuthenticationService;
import com.clinic.demo.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final OtpService otpService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegistrationDTO request) {
        authenticationService.registerUser(request);
        return ResponseEntity.ok("Registration successful");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginUser(@Valid @RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = authenticationService.loginUser(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody EmailRequestDTO request) {
        authenticationService.sendForgotPasswordOTP(request);
        return ResponseEntity.ok("Password reset OTP sent to your email");
    }


    @PostMapping("/two-factor-auth")
    public ResponseEntity<String> requestTwoFactorOtp(@Valid @RequestBody EmailRequestDTO request) {
        otpService.generateAndSendOtp(new GenerateOtpRequest(request.email(), OtpPurpose.TWO_FACTOR_AUTH));
        return ResponseEntity.ok("Two-factor authentication OTP sent");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO request) {
        authenticationService.resetPassword(request);
        return ResponseEntity.ok("Password reset successfully");
    }
}
package com.clinic.demo.controller;

import com.clinic.demo.DTO.UserUpdatePasswordDTO;
import com.clinic.demo.exception.UserNotFoundException;
import com.clinic.demo.service.UserService;
import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))

@Transactional
@RequestMapping("/user")
@CrossOrigin("*") // need to change in the future
public class  UserController {
    private final UserService userService;

    @PutMapping("/update-profile/{userEmail}")
    public ResponseEntity<String> updateProfile(
            @PathVariable String userEmail,
            @RequestBody Map<String, Object> updates) {
        userService.update(userEmail, updates);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody UserUpdatePasswordDTO userUpdateDTO) {
        userService.updatePassword(userUpdateDTO);
        return ResponseEntity.ok("Password updated successfully");
    }
}

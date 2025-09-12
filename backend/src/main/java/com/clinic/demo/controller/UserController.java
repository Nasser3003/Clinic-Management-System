package com.clinic.demo.controller;

import com.clinic.demo.service.UserService;
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
        return userService.update(userEmail, updates);
    }
}

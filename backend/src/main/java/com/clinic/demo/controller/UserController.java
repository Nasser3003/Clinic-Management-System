package com.clinic.demo.controller;

import com.clinic.demo.DTO.SearchResponseDTO;
import com.clinic.demo.DTO.UserUpdatePasswordDTO;
import com.clinic.demo.DTO.userDTO.EmployeeDTO;
import com.clinic.demo.models.enums.UserTypeEnum;
import com.clinic.demo.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
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


    @GetMapping("/search")
    public ResponseEntity<SearchResponseDTO<EmployeeDTO>> searchDoctors(
            @RequestParam(name = "q") String searchTerm,
            @RequestParam(name = "types", required = false) List<String> userTypes,
            @RequestParam(name = "limit", required = false, defaultValue = "5") int limit) {

        SearchResponseDTO<EmployeeDTO> response = userService.searchEmployeesByName(searchTerm, List.of(UserTypeEnum.DOCTOR.toString()), limit);
        return ResponseEntity.ok(response);
    }


//    @PostMapping("enable2fa")
//    public ResponseEntity<String> updateTwoFactorAuth(
//
//    )
//
//    @PostMapping("disable2fa")
//    public ResponseEntity<String> updateTwoFactorAuth(
//
//    )
}

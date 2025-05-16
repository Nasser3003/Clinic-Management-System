package com.clinic.demo.controller;

import com.clinic.demo.DTO.registrationDTO.EmployeeRegistrationDTO;
import com.clinic.demo.DTO.userDTO.UserInfoDTO;
import com.clinic.demo.Mapper.UserMapper;
import com.clinic.demo.service.AuthenticationService;
import com.clinic.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/admin")
@CrossOrigin("*") // will need in the future
public class AdminController {
    private final UserService userService;
    private final AuthenticationService authenticationService;

    @GetMapping("/all")
    public List<UserInfoDTO> getAllUsers() {
       return userService.findAllUsers();
    }

    @PostMapping("/register-employee")
    public void registerUser(@Valid @RequestBody EmployeeRegistrationDTO employeeRegistrationDTO) {
        authenticationService.registerEmployee(employeeRegistrationDTO);
    }

    @GetMapping("/email/{email}")
    public UserInfoDTO getUserByEmail (@PathVariable("email") String email) {
        return UserMapper.convertToDTO(userService.findUserByEmail(email));
    }
}

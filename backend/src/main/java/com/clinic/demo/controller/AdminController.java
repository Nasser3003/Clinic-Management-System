package com.clinic.demo.controller;

import com.clinic.demo.DTO.registrationDTO.EmployeeRegistrationDTO;
import com.clinic.demo.DTO.userDTO.EmployeeDTO;
import com.clinic.demo.DTO.userDTO.UserInfoDTO;
import com.clinic.demo.Mapper.UserMapper;
import com.clinic.demo.service.AuthenticationService;
import com.clinic.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
@CrossOrigin("*") // will need in the future
public class AdminController {

    private final UserService userService;
    private final AuthenticationService authenticationService;

    @GetMapping("/USER_READ")
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

    @GetMapping("/api/v01/doctors-count")
    public long getCountAllActiveDoctors () {
        return userService.countAllActiveDoctors();
    }

    @GetMapping("/api/v01/patients-count")
    public long getCountAllActivePatients () {
        return userService.countAllActivePatients();
    }

    @GetMapping("/api/v01/staff-count")
    public long getCountAllActiveStaff () {
        return userService.countAllActiveStaff();
    }

    @GetMapping("/api/v01/appointments-this-month")
    public long getCountAllAppointmentsThisMonth () {
        return userService.countAllAppointmentsThisMonth();
    }

    @GetMapping("/api/v01/get-all-doctors")
    public List<EmployeeDTO> getAllDoctors() {
        return userService.getAllDoctors();
    }
}

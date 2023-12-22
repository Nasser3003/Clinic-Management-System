package com.almoatasem.demo.controller;

import com.almoatasem.demo.DTO.UserInfoDTO;
import com.almoatasem.demo.service.AdminService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/admin")
@CrossOrigin("*") // will need in the future
public class AdminController {

    private final AdminService adminService;

//    NEED TO MAKE THIS ONLY FOR ADMIN
    @GetMapping("/all")
    public List<UserInfoDTO> getAllUsers() {
       return adminService.selectAllUsers();
    }

    //    NEED TO MAKE THIS ONLY FOR ADMIN
    @GetMapping("/{email}")
    public UserInfoDTO getUser (@PathVariable("email") String email) {
        return adminService.selectUserByEmail(email);
    }


}

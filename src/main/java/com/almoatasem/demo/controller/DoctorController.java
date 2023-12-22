package com.almoatasem.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user/doctor")
@CrossOrigin("*") // need to change in the future
public class DoctorController {

//    @GetMapping("/doctor")
//    public String helloAdminController(){
//        return "user Access level";
//    }

    /*
        doctor should view his profile

        doctor should check his patients

        doctor should be able to take break

     */
}

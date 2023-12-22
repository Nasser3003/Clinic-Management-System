package com.almoatasem.demo.service;

import com.almoatasem.demo.repository.userRepos.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@AllArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class DoctorService {
    private UserRepository userRepository;

//    public void viewProfile() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication != null && authentication.isAuthenticated()) {
//            String username = authentication.getCredentials().email;
//            System.out.println(userRepository.findByUsername(username));
//        } else {
//            System.out.println("No user is currently authenticated.");
//        }
//    }
}

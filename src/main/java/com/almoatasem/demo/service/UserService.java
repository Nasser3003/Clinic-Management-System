package com.almoatasem.demo.service;

import com.almoatasem.demo.exception.RequestValidationException;
import com.almoatasem.demo.models.entitiy.Role;
import com.almoatasem.demo.models.entitiy.UserInfo;
import com.almoatasem.demo.models.enums.GENDER;
import com.almoatasem.demo.models.requests.RegisterUserRequest;
import com.almoatasem.demo.repository.RoleRepository;
import com.almoatasem.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final RoleRepository roleRepository;

//    #######
    private RegisterUserRequest registerUserRequest;
//    #######

    public UserService(UserRepository userRepository, PasswordEncoder encoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.roleRepository = roleRepository;
    }

    public List<UserInfo> selectAllUsers() {
        return userRepository.findAll();
    }
    public void saveUser(RegisterUserRequest registerUserRequest) throws Exception {
        try {
//            ############ try to improve
            Role userRole = roleRepository.findByAuthority("User").get();
            Set<Role> authorities = new HashSet<>();
            authorities.add(userRole);

            this.registerUserRequest = registerUserRequest;
//            ###########
            UserInfo user = new UserInfo(
                    registerUserRequest.email(),
                    encoder.encode(registerUserRequest.password()), authorities
            );
            userRepository.save(user);
        } catch (DataAccessException e) {
            e.printStackTrace();
        }
    }
    public UserInfo selectUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RequestValidationException("No user with that email"));
    }
    public UserInfo selectUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RequestValidationException("No user with that username"));
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("there is no user with that name"));
    }
}

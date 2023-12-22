package com.almoatasem.demo.service;

import com.almoatasem.demo.DTO.LoginResponseDTO;
import com.almoatasem.demo.models.entitiy.RoleEntity;
import com.almoatasem.demo.models.entitiy.user.PatientEntity;
import com.almoatasem.demo.models.enums.AuthorityEnum;
import com.almoatasem.demo.repository.RoleRepository;
import com.almoatasem.demo.repository.userRepos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class AuthenticationService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    @Autowired
    public AuthenticationService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder encoder,
                                 AuthenticationManager authenticationManager, TokenService tokenService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.encoder = encoder;
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }
    public String registerUser(String username, String email, String password) {
        RoleEntity userRoleEntity = roleRepository.findByAuthority(AuthorityEnum.USER).get();
        Set<RoleEntity> authorities = new HashSet<>();
        authorities.add(userRoleEntity);
        userRepository.save(new PatientEntity(username, email, encoder.encode(password),  authorities));
        return "User Created Successfully";
    }

    public LoginResponseDTO loginUser(String username, String password) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            String token = tokenService.generateJWT(auth);
            return new LoginResponseDTO(userRepository.findByUsername(username).get(), token);
        } catch (AuthenticationException e) {
            e.printStackTrace();
            return new LoginResponseDTO(null, "Issue in loginUser");
        }
    }
}

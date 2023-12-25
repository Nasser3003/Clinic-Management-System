package com.clinic.demo.service;

import com.clinic.demo.DTO.LoginResponseDTO;
import com.clinic.demo.exception.EmailAlreadyTakenException;
import com.clinic.demo.models.entitiy.RoleEntity;
import com.clinic.demo.models.entitiy.user.AbstractUserEntity;
import com.clinic.demo.models.entitiy.user.PatientEntity;
import com.clinic.demo.models.enums.AuthorityEnum;
import com.clinic.demo.repository.RoleRepository;
import com.clinic.demo.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Transactional
public class AuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public void registerUser(String email, String password, LocalDate dob) {
        if (userRepository.findByEmail(email).isPresent())
            throw new EmailAlreadyTakenException();

        RoleEntity userRoleEntity = roleRepository.findByAuthority(AuthorityEnum.USER)
                .orElseThrow(() -> new RuntimeException("User role not found"));

        Set<RoleEntity> authorities = new HashSet<>();
        authorities.add(userRoleEntity);

        userRepository.save(new PatientEntity(email, encoder.encode(password), dob,  authorities));
    }

    public LoginResponseDTO loginUser(String email, String password) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            String token = tokenService.generateJWT(auth);
            AbstractUserEntity user = userRepository.findByEmail(email).orElse(null);

            return new LoginResponseDTO(user.getEmail(), token);
        } catch (AuthenticationException e) {
            logger.error("Authentication failed in loginUser for email: {}. Exception: {}", email, e.getMessage(), e);
            return new LoginResponseDTO(null, "Authentication failed in loginUser");
        }
    }

}

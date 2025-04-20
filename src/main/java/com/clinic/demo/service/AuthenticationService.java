package com.clinic.demo.service;

import com.clinic.demo.DTO.LoginResponseDTO;
import com.clinic.demo.DTO.registrationDTO.EmployeeRegistrationDTO;
import com.clinic.demo.DTO.registrationDTO.RegistrationDTO;
import com.clinic.demo.exception.EmailAlreadyTakenException;
import com.clinic.demo.models.entity.RoleEntity;
import com.clinic.demo.models.entity.user.BaseUserEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
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

    public void registerUser(RegistrationDTO registrationDTO) {
        String firstName = registrationDTO.firstName();
        String lastName = registrationDTO.lastName();
        String email = registrationDTO.email();
        String phoneNumber = registrationDTO.phoneNumber();
        String gender = registrationDTO.gender();
        String password = registrationDTO.password();
        LocalDate dob = registrationDTO.dob();

        checkEmailAvailability(email);
        Set<RoleEntity> roles = initializeUserRoles();
        GenderEnum genderEnum = parseGender(gender);

        userRepository.save(new PatientEntity(
                firstName, lastName, email, phoneNumber, genderEnum,
                UserTypeEnum.PATIENT, encoder.encode(password), dob, roles
        ));
    }

    public void registerEmployee(EmployeeRegistrationDTO registrationDTO) {
        checkEmailAvailability(registrationDTO.email());

        GenderEnum genderEnum = parseGender(registrationDTO.gender());
        UserTypeEnum userTypeEnum = UserTypeEnum.valueOf(registrationDTO.userType().toUpperCase());
        Set<RoleEntity> roles = initializeUserRoles();

        userRepository.save(new EmployeeEntity(
                registrationDTO.firstName(),
                registrationDTO.lastName(),
                registrationDTO.email(),
                registrationDTO.phoneNumber(),
                registrationDTO.nationalId(),
                genderEnum,
                userTypeEnum,
                encoder.encode(registrationDTO.password()),
                registrationDTO.dob(),
                registrationDTO.salary(),
                roles
        ));
    }

    public LoginResponseDTO loginUser(String email, String password) {
        try {
            BaseUserEntity user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.isDeleted()) {
                logger.error("Attempted login for deleted account: {}", email);
                throw new RuntimeException("Account has been deleted");
            }

            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            String token = tokenService.generateJWT(auth);
            return new LoginResponseDTO(user.getEmail(), token);

        } catch (AuthenticationException e) {
            logger.error("Authentication failed for email: {}. Reason: {}", email, e.getMessage());
            throw new RuntimeException("Invalid credentials");
        } catch (RuntimeException e) {
            logger.error("Login error for email: {}. Error: {}", email, e.getMessage());
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    // Helper methods to reduce duplication
    private void checkEmailAvailability(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyTakenException();
        }
    }

    private Set<RoleEntity> initializeUserRoles() {
        // Find the "USER" role instead of looking for AuthorityEnum.USER
        RoleEntity userRole = roleRepository.findByName("USER_ROLE")
                .orElseThrow(() -> new RuntimeException("User role not found"));
        Set<RoleEntity> roles = new HashSet<>();
        roles.add(userRole);
        return roles;
    }

    private GenderEnum parseGender(String gender) {
        if (gender == null || gender.trim().isEmpty()) throw new IllegalArgumentException("Gender cannot be null or empty");
        try {
            return GenderEnum.valueOf(gender.toUpperCase());
        } catch (IllegalArgumentException e) {
            logger.error("Invalid gender value provided: {}", gender);
            throw new IllegalArgumentException("Invalid gender value");
        }
    }
}
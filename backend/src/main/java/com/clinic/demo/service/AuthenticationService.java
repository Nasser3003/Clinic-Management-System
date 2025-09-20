package com.clinic.demo.service;

import com.clinic.demo.DTO.*;
import com.clinic.demo.DTO.registrationDTO.EmployeeRegistrationDTO;
import com.clinic.demo.DTO.registrationDTO.RegistrationDTO;
import com.clinic.demo.Mapper.UserMapper;
import com.clinic.demo.exception.EmailAlreadyTakenException;
import com.clinic.demo.models.entity.RoleEntity;
import com.clinic.demo.models.entity.user.BaseUserEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.OtpPurpose;
import com.clinic.demo.models.enums.PermissionEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import com.clinic.demo.repository.RoleRepository;
import com.clinic.demo.repository.UserRepository;
import com.clinic.demo.utils.Validations;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final OtpService otpService;

    public void registerUser(RegistrationDTO registrationDTO) {
        String email = registrationDTO.email().toLowerCase();

        String firstName = registrationDTO.firstName();
        if (!Validations.isValidName(firstName))
            throw new IllegalArgumentException("Invalid first name provided");

        String lastName = registrationDTO.lastName();
        if (!Validations.isValidName(lastName))
            throw new IllegalArgumentException("Invalid last name provided");

        if (!Validations.isValidEmail(email))
            throw new IllegalArgumentException("Invalid email provided");

        String phoneNumber = registrationDTO.phoneNumber();
        if (!Validations.isValidPhoneNumber(phoneNumber))
            throw new IllegalArgumentException("Invalid phone number provided");

        String password = registrationDTO.password();
        if (!Validations.isValidPassword(password))
            throw new IllegalArgumentException("Password must be 8+ characters with uppercase, lowercase, digit, and special character");

        String confirmPassword = registrationDTO.confirmPassword();
        if (!Validations.isValidPassword(confirmPassword))
            throw new IllegalArgumentException("Password must be 8+ characters with uppercase, lowercase, digit, and special character");

        if (!registrationDTO.password().equals(registrationDTO.confirmPassword()))
            throw new IllegalArgumentException("Passwords do not match");

        String gender = registrationDTO.gender();
        LocalDate dob = registrationDTO.dob();

        checkEmailAvailability(email);
        Set<RoleEntity> roles = initializeUserRoles();
        GenderEnum genderEnum = parseGender(gender);

        userRepository.save(new PatientEntity(
                firstName,
                lastName,
                email,
                phoneNumber,
                genderEnum,
                passwordEncoder.encode(password),
                dob,
                Set.of()
        ));
    }

    public void registerEmployee(EmployeeRegistrationDTO registrationDTO) {
        String email = registrationDTO.email().toLowerCase();
        checkEmailAvailability(email);

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
                passwordEncoder.encode(registrationDTO.password()),
                registrationDTO.dob(),
                registrationDTO.salary(),
                Set.of(PermissionEnum.USER_READ, PermissionEnum.USER_CREATE, PermissionEnum.USER_UPDATE, PermissionEnum.USER_DELETE)
        ));
    }

    public LoginResponseDTO loginUser(LoginRequestDTO loginRequestDTO) {
        String email = loginRequestDTO.email().toLowerCase();
        String password = loginRequestDTO.password();
        try {
            BaseUserEntity user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.isDeleted()) {
                logger.error("Attempted login for deleted account: {}", email);
                throw new RuntimeException("Account has been deleted");
            }

            String token = tokenService.generateJWT(authenticateUser(email, password));
            UserProfileDTO userProfile = UserMapper.toUserProfileDTO(user);

            return new LoginResponseDTO(token, userProfile);

        } catch (AuthenticationException e) {
            logger.error("Authentication failed for email: {}. Reason: {}", email, e.getMessage());
            throw new RuntimeException("Invalid credentials");
        } catch (RuntimeException e) {
            logger.error("Login error for email: {}. Error: {}", email, e.getMessage());
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    private void checkEmailAvailability(String email) {
        email = email.toLowerCase();
        if (userRepository.findByEmail(email).isPresent())
            throw new EmailAlreadyTakenException();
    }

    private Set<RoleEntity> initializeUserRoles() {
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

    String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtToken) {
            return jwtToken.getToken().getClaimAsString("email");
        }

        throw new IllegalStateException("No JWT authentication found");
    }

    private Authentication authenticateUser(String email, String password) {
        try {
            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid credentials", e);
        }
    }

    public void resetPassword(ResetPasswordRequestDTO resetPasswordRequestDTO) {
        String email = resetPasswordRequestDTO.email().toLowerCase();
        String otp = resetPasswordRequestDTO.otp();
        String newPassword = resetPasswordRequestDTO.newPassword();
        String confirmNewPassword = resetPasswordRequestDTO.confirmNewPassword();


        if (!otpService.validateOtpAuthenticity(email, otp, OtpPurpose.PASSWORD_RESET))
            throw new RuntimeException("Invalid or expired OTP");

        BaseUserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        if (!Validations.isValidPassword(newPassword))
            throw new IllegalArgumentException("Password must be 8+ characters with uppercase, lowercase, digit, and special character");

        if (!Validations.isValidPassword(confirmNewPassword))
            throw new IllegalArgumentException("Password must be 8+ characters with uppercase, lowercase, digit, and special character");

        if (!newPassword.equals(confirmNewPassword))
            throw new IllegalArgumentException("Passwords do not match");

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void sendForgotPasswordOTP(EmailRequestDTO requestDTO) {

        String email = requestDTO.email().toLowerCase();
        BaseUserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        otpService.generateAndSendOtp(new GenerateOtpRequest(email, OtpPurpose.PASSWORD_RESET));
    }


}
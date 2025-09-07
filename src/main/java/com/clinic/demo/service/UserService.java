package com.clinic.demo.service;

import com.clinic.demo.DTO.userDTO.UserInfoDTO;
import com.clinic.demo.Mapper.UserMapper;
import com.clinic.demo.exception.UserNotFoundException;
import com.clinic.demo.models.entity.user.*;
import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import com.clinic.demo.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@AllArgsConstructor(onConstructor = @__(@Autowired))
@Service
@Transactional(readOnly = true)
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private final UserRepository userRepository;

    public List<UserInfoDTO> findAllUsers() {
        List<BaseUserEntity> users = userRepository.findAll();
        return users.stream()
                .map(UserMapper::convertToDTO)
                .collect(Collectors.toList());
    }

    public BaseUserEntity findUserByEmail(String email) {
        if (email == null || email.trim().isEmpty())
            throw new IllegalArgumentException("Email cannot be null or empty");
        
        Optional<BaseUserEntity> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty())
            throw new UserNotFoundException(email + " User not found");
        return typeCastUserToType(userOptional);
    }

    public BaseUserEntity findByPhone(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be null or empty");
        }
        
        Optional<BaseUserEntity> userOptional = userRepository.findByPhoneNumber(phoneNumber);
        return typeCastUserToType(userOptional);
    }

    @Transactional
    public void save(BaseUserEntity user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        userRepository.save(user);
        logger.info("User saved successfully: {}", user.getEmail());
    }

    @Transactional
    public ResponseEntity<String> update(String userEmail, Map<String, Object> updates) {
        try {
            BaseUserEntity user = findUserByEmail(userEmail);
            if (user == null) {
                logger.warn("Update attempted for non-existent user: {}", userEmail);
                return ResponseEntity.notFound().build();
            }
            
            updateProperties(user, updates);
            userRepository.save(user);
            logger.info("Profile updated successfully for user: {}", userEmail);
            return ResponseEntity.ok("Profile updated successfully.");
        } catch (Exception e) {
            logger.error("Error updating user {}: {}", userEmail, e.getMessage(), e);
            throw e;
        }
    }

    @Transactional
    public void updateProperties(BaseUserEntity user, Map<String, Object> updates) {
        if (user == null) throw new IllegalArgumentException("User cannot be null");

        if (updates == null || updates.isEmpty()) {
            logger.warn("No updates provided for user: {}", user.getEmail());
            return;
        }

        for (Map.Entry<String, Object> entry : updates.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            try {
                if (Objects.equals(key, "email")) {
                    updateEmail(user, value);
                } else {
                    switch (key) {
                        case "phone" -> user.setPhoneNumber(getStringValue(value));
                        case "firstName" -> user.setFirstName(getStringValue(value));
                        case "lastName" -> user.setLastName(getStringValue(value));
                        case "dateOfBirth" -> user.setDateOfBirth(parseDateValue(value));
                        case "gender" -> user.setGender(parseGenderValue(value));
                        case "username" -> user.setUsername(getStringValue(value));
                        case "emergencyContactName" -> user.setEmergencyContactName(getStringValue(value));
                        case "emergencyContactNumber" -> user.setEmergencyContactNumber(getStringValue(value));
                        case "notes" -> user.setNotes(getStringValue(value));
                        default -> logger.warn("Unhandled key in update: {}", key);
                    }
                }
            } catch (Exception e) {
                logger.error("Error updating field '{}' for user {}: {}", key, user.getEmail(), e.getMessage());
                throw e;
            }
        }
    }

    private void updateEmail(BaseUserEntity user, Object value) {
        String email = getStringValue(value);
        if (email == null || email.trim().isEmpty()) throw new IllegalArgumentException("Email cannot be null or empty");
        
        BaseUserEntity existingUser = findUserByEmail(email);
        if (existingUser != null && !existingUser.getId().equals(user.getId())) throw new DataIntegrityViolationException("Email you provided is already taken");

        user.setEmail(email);
    }

    private String getStringValue(Object value) {
        return value instanceof String ? ((String) value).trim() : null;
    }

    private GenderEnum parseGenderValue(Object stringGender) {
        if (stringGender instanceof String) {
            try {
                return GenderEnum.valueOf(((String) stringGender).toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid gender value: " + stringGender);
            }
        }
        return null;
    }

    private LocalDate parseDateValue(Object stringDate) {
        if (stringDate instanceof String) {
            try {
                LocalDate date = LocalDate.parse((String) stringDate, DATE_FORMATTER);
                if (date.isAfter(LocalDate.now())) throw new IllegalArgumentException("Date of birth cannot be in the future");
                return date;
            } catch (DateTimeParseException e) {
                throw new DateTimeParseException(
                        "Invalid date format. Please use yyyy-MM-dd format.", 
                        e.getParsedString(), 
                        e.getErrorIndex()
                );
            }
        }
        return null;
    }

    private BaseUserEntity typeCastUserToType(Optional<BaseUserEntity> userOptional) {
        if (userOptional.isEmpty()) return null;

        BaseUserEntity user = userOptional.get();
        UserTypeEnum userTypeEnum = user.getUserType();

        try {
            return switch (userTypeEnum) {
                case DOCTOR, EMPLOYEE -> (EmployeeEntity) user;
                case PATIENT -> (PatientEntity) user;
                case ADMIN -> (AdminEntity) user;
                default -> throw new IllegalArgumentException("Unsupported user type: " + userTypeEnum);
            };
        } catch (ClassCastException e) {
            logger.error("Error casting user to correct type. User ID: {}, Type: {}", 
                    user.getId(), userTypeEnum, e);
            throw new RuntimeException("Error processing user data. User type mismatch.", e);
        }
    }

}
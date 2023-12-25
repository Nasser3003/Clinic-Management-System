package com.clinic.demo.service;

import com.clinic.demo.DTO.UserInfoDTO;
import com.clinic.demo.Mapper.UserMapper;
import com.clinic.demo.models.entitiy.user.*;
import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import com.clinic.demo.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@AllArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class UserService {
    private UserRepository userRepository;

    public List<UserInfoDTO> selectAllUsers() {
        List<AbstractUserEntity> users = userRepository.findAll();
        return users
                .stream()
                .map(UserMapper::convertToDTO)
                .collect(Collectors.toList());
    }
    public AbstractUserEntity selectUserByEmail(String email) {
        Optional<AbstractUserEntity> userOptional = userRepository.findByEmail(email);
        return typeCastUserToType(userOptional);
    }
    public AbstractUserEntity findByPhone(String phoneNumber) {
        Optional<AbstractUserEntity> userOptional = userRepository.findByPhoneNumber(phoneNumber);
        return typeCastUserToType(userOptional);
    }
    public void save(AbstractUserEntity user) {
        userRepository.save(user);
    }
    public ResponseEntity<String> update(String userEmail, Map<String, Object> updates) {
        AbstractUserEntity user = selectUserByEmail(userEmail);
        if (user == null)
            return ResponseEntity.notFound().build();

        updateProperties(user, updates);
        try {
            save(user);
            return ResponseEntity.ok("Profile updated successfully.");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    public void updateProperties(AbstractUserEntity user, Map<String, Object> updates) {
        for (Map.Entry<String, Object> entry : updates.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            switch (key) {
                case "email" -> user.setEmail(getStringValue(value));
                case "phone" -> user.setPhoneNumber(getStringValue(value));
                case "firstName" -> user.setFirstName(getStringValue(value));
                case "lastName" -> user.setLastName(getStringValue(value));
                case "dateOfBirth" -> user.setDateOfBirth(parseDateValue(value));
                case "gender" -> user.setGender(parseGenderValue(value));
                case "username" -> user.setUsername(getStringValue(value));
                default -> System.out.println("Unhandled key: " + key);
            }
        }
        System.out.println("Update complete");
    }

    private String getStringValue(Object value) {
        return value instanceof String ? (String) value : null;
    }
    private GenderEnum parseGenderValue(Object stringGender) {
        if (stringGender instanceof String) {
            try {
                return GenderEnum.valueOf(
                        ((String) stringGender)
                                .toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Error parsing gender: " + e.getMessage());
            }
        }
        return null;
    }
    private LocalDate parseDateValue(Object stringDate) {
        if (stringDate instanceof String) {
            try {
                return LocalDate.parse((String) stringDate, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            } catch (DateTimeParseException e) {
                throw new DateTimeParseException("Error parsing date: " + e.getMessage(), e.getParsedString(), e.getErrorIndex());
            }
        }
        return null;
    }
    private AbstractUserEntity typeCastUserToType(Optional<AbstractUserEntity> userOptional) {

        if (userOptional.isEmpty())
            return (null);

        AbstractUserEntity user = userOptional.get();
        UserTypeEnum userTypeEnum = user.getUserType();

        return switch (userTypeEnum) {
            case DOCTOR -> (DoctorEntity) user;
            case PATIENT -> (PatientEntity) user;
            case ADMIN -> (AdminEntity) user;
            case EMPLOYEE -> (EmployeeEntity) user;
        };
    }
}

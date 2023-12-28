package com.clinic.demo.service;

import com.clinic.demo.DTO.UserInfoDTO;
import com.clinic.demo.Mapper.UserMapper;
import com.clinic.demo.models.entitiy.RoleEntity;
import com.clinic.demo.models.entitiy.user.*;
import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import com.clinic.demo.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
        return ResponseEntity.ok("Profile updated successfully.");
    }
    public void updateProperties(AbstractUserEntity user, Map<String, Object> updates) {
        for (Map.Entry<String, Object> entry : updates.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            if (Objects.equals(key, "email"))
                updateEmail(user, value);

            switch (key) {
                case "phone" -> user.setPhoneNumber(getStringValue(value));
                case "firstName" -> user.setFirstName(getStringValue(value));
                case "lastName" -> user.setLastName(getStringValue(value));
                case "dateOfBirth" -> user.setDateOfBirth(parseDateValue(value));
                case "gender" -> user.setGender(parseGenderValue(value));
                case "username" -> user.setUsername(getStringValue(value));
                default -> System.out.println("Unhandled key: " + key);
            }
        }
    }

    private void updateEmail(AbstractUserEntity user, Object value) {
        String email = getStringValue(value);
        if (selectUserByEmail(email) != null)
            throw new DataIntegrityViolationException("Email you provided is taken");
        user.setEmail(email);
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
    public void addRole(AbstractUserEntity user, RoleEntity roleEntity) {
        user.getAuthorities().add(roleEntity);
    }
    public void removeRole(AbstractUserEntity user, RoleEntity roleEntity) {
        user.getAuthorities().remove(roleEntity);
    }
}

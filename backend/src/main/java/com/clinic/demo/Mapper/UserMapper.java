package com.clinic.demo.Mapper;


import com.clinic.demo.DTO.UserProfileDTO;
import com.clinic.demo.DTO.userDTO.EmployeeDTO;
import com.clinic.demo.DTO.userDTO.PatientDTO;
import com.clinic.demo.DTO.userDTO.UserInfoDTO;
import com.clinic.demo.models.entity.RoleEntity;
import com.clinic.demo.models.entity.user.BaseUserEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import org.springframework.security.core.GrantedAuthority;

import java.util.Set;
import java.util.stream.Collectors;

public class UserMapper {

    public static UserInfoDTO convertToDTO(BaseUserEntity user) {

        return new UserInfoDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getUsername(),
                user.getGender(),
                user.getUserType(),
                user.getNationalId(),
                user.getDateOfBirth(),
                user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet()),
                user.isDeleted(),
                user.getCreateDate(),
                user.getLastModifiedDate(),
                user.isAccountNonExpired(),
                user.isAccountNonLocked(),
                user.isCredentialsNonExpired(),
                user.isEnabled(),
                user.getEmergencyContactName(),
                user.getEmergencyContactNumber(),
                user.getNotes()
        );
    }

    public static EmployeeDTO convertToEmployeeDTO(EmployeeEntity employee) {
        return new EmployeeDTO(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getPhoneNumber(),
                employee.getUsername(),
                employee.getGender().toString(),
                employee.getUserType().toString(),
                employee.getNationalId(),
                employee.getDateOfBirth(),
                employee.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet()),
                employee.isDeleted(),
                employee.getCreateDate(),
                employee.getLastModifiedDate(),
                employee.isAccountNonExpired(),
                employee.isAccountNonLocked(),
                employee.isCredentialsNonExpired(),
                employee.isEnabled(),
                employee.getEmergencyContactName(),
                employee.getEmergencyContactNumber(),
                employee.getNotes(),
                employee.getSalary(),
                employee.getTitle(),
                employee.getDepartment(),
                employee.getEmploymentStatus(),
                employee.getAvatarPath(),
                employee.getDescription(),
                employee.getPublicPhotoPath()
        );
    }

    public static PatientDTO convertToPatientDTO(PatientEntity patient) {
        return new PatientDTO(
                patient.getId(),
                patient.getFirstName(),
                patient.getLastName(),
                patient.getEmail(),
                patient.getPhoneNumber(),
                patient.getUsername(),
                patient.getGender().toString(),
                patient.getUserType().toString(),
                patient.getNationalId(),
                patient.getDateOfBirth(),
                patient.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet()),
                patient.isDeleted(),
                patient.getCreateDate(),
                patient.getLastModifiedDate(),
                patient.isAccountNonExpired(),
                patient.isAccountNonLocked(),
                patient.isCredentialsNonExpired(),
                patient.getEmergencyContactName(),
                patient.getEmergencyContactNumber(),
                patient.isEnabled(),
                patient.getNotes(),
                patient.getAllergies(),
                patient.getHealthIssues(),
                patient.getPrescriptions()
        );
    }

    private static Set<String> convertAuthoritiesToRoles(Set<RoleEntity> roles) {
        return roles.stream()
                .map(RoleEntity::getName)
                .collect(Collectors.toSet());
    }

    public static UserProfileDTO toUserProfileDTO(BaseUserEntity user) {
        return new UserProfileDTO(
                user.getId().toString(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getUserType().name(),
                user.getNationalId(),
                user.getPhoneNumber(),
                user.getGender() != null ? user.getGender().name() : null,
                user.getDateOfBirth().toString(),
                user.getEmergencyContactName(),
                user.getEmergencyContactNumber()
        );
    }

}
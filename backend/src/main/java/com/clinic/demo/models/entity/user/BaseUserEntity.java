package com.clinic.demo.models.entity.user;

import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.PermissionEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@EntityListeners(AuditingEntityListener.class)
@Table(name = "base_user")
public class BaseUserEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(length = 20)
    private String phoneNumber;

    @Column(length = 20)
    private String nationalId;

    @Column
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GenderEnum gender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserTypeEnum userType;

    @Column(length = 100)
    private String title; // Dr., Mr., Mrs., etc.

    @Column(length = 500)
    private String avatarPath;

    @Column(nullable = false)
    private String password;

    @Column(length = 100)
    private String emergencyContactName;

    @Column(length = 20)
    private String emergencyContactNumber;

    @Column(length = 1000)
    private String notes;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createDate;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime lastModifiedDate;

    // Account Status
    @Column(nullable = false)
    private boolean isAccountNonExpired = true;

    @Column(nullable = false)
    private boolean isAccountNonLocked = true;

    @Column(nullable = false)
    private boolean isCredentialsNonExpired = true;

    @Column(nullable = false)
    private boolean isEnabled = true;

    @Column(nullable = false)
    private boolean isDeleted = false;

    // Permissions
    @ElementCollection(targetClass = PermissionEnum.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_permissions", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "permission")
    private Set<PermissionEnum> permissions = new HashSet<>();

    // Constructor for creating users
    public BaseUserEntity(String firstName, String lastName, String email, String phoneNumber,
                          GenderEnum gender, UserTypeEnum userType, String password,
                          LocalDate dateOfBirth, Set<PermissionEnum> permissions) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.userType = userType;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.permissions = permissions != null ? permissions : new HashSet<>();
        this.createDate = LocalDateTime.now();
        this.lastModifiedDate = LocalDateTime.now();
    }

    // Permission Management
    public void addPermission(PermissionEnum permission) {
        if (permission != null)
            permissions.add(permission);
    }

    public void removePermission(PermissionEnum permission) {
        if (permission != null)
            permissions.remove(permission);
    }

    public boolean hasPermission(PermissionEnum permission) {
        return permission != null && permissions.contains(permission);
    }

    public void addPermissions(Set<PermissionEnum> newPermissions) {
        if (newPermissions != null)
            permissions.addAll(newPermissions);
    }

    public void removePermissions(Set<PermissionEnum> permissionsToRemove) {
        if (permissionsToRemove != null)
            permissions.removeAll(permissionsToRemove);
    }

    public void clearAllPermissions() {
        permissions.clear();
    }

    public Set<PermissionEnum> getPermissions() {
        return new HashSet<>(permissions);
    }

    public void setPermissions(Set<PermissionEnum> permissions) {
        this.permissions = permissions != null ? permissions : new HashSet<>();
    }

    // Check if user has any of the specified permissions
    public boolean hasAnyPermission(PermissionEnum... permissionsToCheck) {
        if (permissionsToCheck == null || permissionsToCheck.length == 0)
            return false;
        return Arrays.stream(permissionsToCheck)
                .anyMatch(permissions::contains);
    }

    // Check if user has all specified permissions
    public boolean hasAllPermissions(PermissionEnum... permissionsToCheck) {
        if (permissionsToCheck == null || permissionsToCheck.length == 0)
            return true;
        return Arrays.stream(permissionsToCheck)
                .allMatch(permissions::contains);
    }

    // Utility Methods
    public String getFullName() {
        return firstName + " " + lastName;
    }

    public String getDisplayName() {
        return title != null && !title.isEmpty()
                ? title + " " + getFullName()
                : getFullName();
    }

    public int getAge() {
        if (dateOfBirth == null)
            return 0;
        return LocalDate.now().getYear() - dateOfBirth.getYear();
    }

    // Spring Security UserDetails Implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return permissions.stream()
                .map(permission -> new SimpleGrantedAuthority(permission.name()))
                .collect(Collectors.toSet());
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return isAccountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return isAccountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return isCredentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return isEnabled && !isDeleted;
    }
}
package com.clinic.demo.models.entity.user;

import com.clinic.demo.models.entity.RoleEntity;
import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.PermissionEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
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
    private UUID id;

    // Basic Information
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

    // Optional Profile Information
    @Column(length = 100)
    private String title; // Dr., Mr., Mrs., etc.

    @Column(length = 500)
    private String avatarPath;

    // Authentication
    @Column(nullable = false)
    private String password;

    // Emergency Contact
    @Column(length = 100)
    private String emergencyContactName;

    @Column(length = 20)
    private String emergencyContactNumber;

    // Additional Notes
    @Column(length = 1000)
    private String notes;

    // Audit Fields
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

    // Roles and Permissions
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<RoleEntity> roles = new HashSet<>();

    // Constructor for creating users
    public BaseUserEntity(String firstName, String lastName, String email, String phoneNumber,
                          GenderEnum gender, UserTypeEnum userType, String password,
                          LocalDate dateOfBirth, Set<RoleEntity> roles) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.userType = userType;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.roles = roles != null ? roles : new HashSet<>();
        this.createDate = LocalDateTime.now();
        this.lastModifiedDate = LocalDateTime.now();
    }

    // Role Management
    public void addRole(RoleEntity role) {
        if (role != null) {
            roles.add(role);
        }
    }

    public void removeRole(RoleEntity role) {
        if (role != null) {
            roles.remove(role);
        }
    }

    public boolean hasRole(RoleEntity role) {
        return role != null && roles.contains(role);
    }

    public boolean hasPermission(PermissionEnum permission) {
        return permission != null && roles.stream()
                .flatMap(role -> role.getPermissions().stream())
                .anyMatch(p -> p.equals(permission));
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
        if (dateOfBirth == null) {
            return 0;
        }
        return LocalDate.now().getYear() - dateOfBirth.getYear();
    }

    // Spring Security UserDetails Implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(permission -> new SimpleGrantedAuthority("ROLE_" + permission.name()))
                .collect(Collectors.toSet());
    }

    @Override
    public String getUsername() {
        return email; // Using email as a username
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
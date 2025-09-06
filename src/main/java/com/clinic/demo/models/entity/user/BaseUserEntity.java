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

    // Constructors for different entity types
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
        this.roles = roles;
        this.username = email; // Default username to email
        this.createDate = LocalDateTime.now();
        this.lastModifiedDate = LocalDateTime.now();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserTypeEnum userType;

    @Column(length = 20)
    private String nationalId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String phoneNumber;

    @Column
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GenderEnum gender;

    @Column
    private String username;

    @Column(nullable = false)
    private String password;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createDate;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime lastModifiedDate;

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

    @Column
    private String emergencyContactName;

    @Column
    private String emergencyContactNumber;

    @Column(length = 500)
    private String notes;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<RoleEntity> roles = new HashSet<>();

    public boolean addRole(RoleEntity role) {
        return roles.add(role);
    }

    public boolean removeRole(RoleEntity role) {
        return roles.remove(role);
    }

    public boolean hasPermission(PermissionEnum permission) {
        return roles.stream()
                .flatMap(role -> role.getPermissions().stream())
                .anyMatch(p -> p.equals(permission));
    }

    // Override method from UserDetails interface
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convert all permissions from all roles into Spring Security GrantedAuthority objects
        return roles.stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(permission -> new SimpleGrantedAuthority(permission.name()))
                .collect(Collectors.toSet());
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

    @Override
    public String getUsername() {
        // Using email as the username for authentication
        return email;
    }

    public boolean hasRole(RoleEntity role) {
        return roles.contains(role);
    }
}
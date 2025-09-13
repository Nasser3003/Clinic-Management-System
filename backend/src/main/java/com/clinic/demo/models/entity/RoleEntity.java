package com.clinic.demo.models.entity;

import com.clinic.demo.models.enums.PermissionEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String name;

    @Column(length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type")
    private UserTypeEnum userType;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "role_permissions", joinColumns = @JoinColumn(name = "role_id"))
    @Column(name = "permission")
    @Builder.Default
    private Set<PermissionEnum> permissions = new HashSet<>();

    @Column(name = "is_system_role", nullable = false)
    @Builder.Default
    private Boolean systemRole = false;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public RoleEntity(String name) {
        this.name = name;
        this.permissions = new HashSet<>();
        this.systemRole = false;
        this.active = true;
        this.createdAt = LocalDateTime.now();
    }

    public RoleEntity(String name, UserTypeEnum userType) {
        this.name = name;
        this.userType = userType;
        this.permissions = new HashSet<>();
        this.systemRole = true; // Roles with user types are typically system roles
        this.active = true;
        this.createdAt = LocalDateTime.now();
    }

    public boolean hasPermission(PermissionEnum permission) {
        return permissions != null && permissions.contains(permission);
    }

    public boolean hasAnyPermission(PermissionEnum... permissions) {
        if (this.permissions == null || permissions == null) {
            return false;
        }

        for (PermissionEnum permission : permissions) {
            if (this.permissions.contains(permission)) {
                return true;
            }
        }
        return false;
    }

    public boolean hasAllPermissions(PermissionEnum... permissions) {
        if (this.permissions == null || permissions == null) {
            return false;
        }

        for (PermissionEnum permission : permissions) {
            if (!this.permissions.contains(permission)) {
                return false;
            }
        }
        return true;
    }

    public void addPermission(PermissionEnum permission) {
        if (this.permissions == null) {
            this.permissions = new HashSet<>();
        }
        this.permissions.add(permission);
        this.updatedAt = LocalDateTime.now();
    }

    public void removePermission(PermissionEnum permission) {
        if (this.permissions != null) {
            this.permissions.remove(permission);
            this.updatedAt = LocalDateTime.now();
        }
    }

    public void setPermissions(Set<PermissionEnum> permissions) {
        this.permissions = permissions != null ? new HashSet<>(permissions) : new HashSet<>();
        this.updatedAt = LocalDateTime.now();
    }

    public int getPermissionCount() {
        return permissions != null ? permissions.size() : 0;
    }

    public boolean isModifiable() {
        return !Boolean.TRUE.equals(systemRole);
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
package com.clinic.demo.models.entity;

import com.clinic.demo.models.enums.PermissionEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
public class RoleEntity {

    public static Map<UserTypeEnum, Set<PermissionEnum>> userTypeToPermissionsMap() {
        Map<UserTypeEnum, Set<PermissionEnum>> permissionsMap = new HashMap<>();

        permissionsMap.put(UserTypeEnum.ADMIN, Set.of(
                PermissionEnum.MANAGE_USERS,
                PermissionEnum.MANAGE_ROLES,
                PermissionEnum.VIEW_REPORTS,
                PermissionEnum.CONFIGURE_SYSTEM
        ));

        permissionsMap.put(UserTypeEnum.DOCTOR, Set.of(
                PermissionEnum.PRESCRIBE_MEDICATION,
                PermissionEnum.ORDER_TESTS,
                PermissionEnum.VIEW_TEST_RESULTS,
                PermissionEnum.SCHEDULE_APPOINTMENTS,
                PermissionEnum.VIEW_PATIENT_RECORDS
        ));

        permissionsMap.put(UserTypeEnum.PATIENT, Set.of(
                PermissionEnum.VIEW_APPOINTMENTS,
                PermissionEnum.VIEW_INVOICES,
                PermissionEnum.VIEW_TEST_RESULTS
        ));

        permissionsMap.put(UserTypeEnum.EMPLOYEE, Set.of(
                PermissionEnum.SCHEDULE_APPOINTMENTS,
                PermissionEnum.CANCEL_APPOINTMENTS,
                PermissionEnum.VIEW_REPORTS
        ));

        permissionsMap.put(UserTypeEnum.PARTNER, Set.of(
                PermissionEnum.VIEW_REPORTS,
                PermissionEnum.ORDER_TESTS
        ));

        return permissionsMap;
    }

    public RoleEntity(String name) {
        this.name = name;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "role_permissions", joinColumns = @JoinColumn(name = "role_id"))
    @Column(name = "permission")
    private Set<PermissionEnum> permissions = new HashSet<>();

    public boolean hasPermission(PermissionEnum permission) {
        return permissions.contains(permission);
    }

}
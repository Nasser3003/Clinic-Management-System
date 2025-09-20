//package com.clinic.demo.service;
//
//import com.clinic.demo.models.entity.RoleEntity;
//import com.clinic.demo.models.entity.user.BaseUserEntity;
//import com.clinic.demo.models.enums.PermissionEnum;
//import com.clinic.demo.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.Set;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class
//UserRoleService {
//
//    private final UserRepository userRepository;
//
//    @Transactional
//    public void addRole(BaseUserEntity user, RoleEntity role) {
//        if (user == null || role == null)
//            throw new IllegalArgumentException("User and role cannot be null");
//
//        if (!role.getActive())
//            throw new IllegalArgumentException("Cannot assign inactive role: " + role.getName());
//
//        if (user.hasRole(role))
//            return;
//
//        user.addRole(role);
//        userRepository.save(user);
//        log.info("Added role '{}' to user {}", role.getName(), user.getEmail());
//    }
//
//    @Transactional
//    public void removeRole(BaseUserEntity user, RoleEntity role) {
//        if (user == null || role == null)
//            throw new IllegalArgumentException("User and role cannot be null");
//
//        if (!user.hasRole(role))
//            return;
//
//        if (user.getRoles().size() <= 1)
//            throw new IllegalArgumentException("Cannot remove last role from user");
//
//
//        user.removeRole(role);
//        userRepository.save(user);
//        log.info("Removed role '{}' from user {}", role.getName(), user.getEmail());
//    }
//
//    @Transactional
//    public void replaceUserRoles(BaseUserEntity user, Set<RoleEntity> newRoles) {
//        if (user == null)
//            throw new IllegalArgumentException("User cannot be null");
//
//        if (newRoles == null || newRoles.isEmpty())
//            throw new IllegalArgumentException("User must have at least one role");
//
//        user.getRoles().clear();
//        user.getRoles().addAll(newRoles);
//        userRepository.save(user);
//        log.info("Replaced roles for user {}", user.getEmail());
//    }
//
//    @Transactional
//    public void addRoles(BaseUserEntity user, Set<RoleEntity> roles) {
//        if (user == null || roles == null || roles.isEmpty())
//            return;
//
//        for (RoleEntity role : roles) {
//            if (role.getActive() && !user.hasRole(role))
//                user.addRole(role);
//        }
//        userRepository.save(user);
//        log.info("Added roles to user {}", user.getEmail());
//    }
//
//    @Transactional
//    public void removeRoles(BaseUserEntity user, Set<RoleEntity> roles) {
//        if (user == null || roles == null || roles.isEmpty())
//            return;
//
//        for (RoleEntity role : roles) {
//            if (user.hasRole(role) && user.getRoles().size() > 1)
//                user.removeRole(role);
//        }
//        userRepository.save(user);
//        log.info("Removed roles from user {}", user.getEmail());
//    }
//
//    public boolean userHasPermission(BaseUserEntity user, PermissionEnum permission) {
//        if (user == null || permission == null)
//            return false;
//
//        return user.getRoles().stream()
//                .filter(RoleEntity::getActive)
//                .anyMatch(role -> role.hasPermission(permission));
//    }
//
//    public Set<PermissionEnum> getUserPermissions(BaseUserEntity user) {
//        if (user == null)
//            return Set.of();
//
//        return user.getRoles().stream()
//                .filter(RoleEntity::getActive)
//                .flatMap(role -> role.getPermissions().stream())
//                .collect(Collectors.toSet());
//    }
//
//    public boolean canAssignRole(BaseUserEntity user, RoleEntity role) {
//        return user != null && role != null && role.getActive() && !user.hasRole(role);
//    }
//
//    public boolean userHasActiveRoles(BaseUserEntity user) {
//        return user != null && user.getRoles().stream().anyMatch(RoleEntity::getActive);
//    }
//
//    public Set<RoleEntity> getUserActiveRoles(BaseUserEntity user) {
//        if (user == null)
//            return Set.of();
//
//        return user.getRoles().stream()
//                .filter(RoleEntity::getActive)
//                .collect(Collectors.toSet());
//    }
//}
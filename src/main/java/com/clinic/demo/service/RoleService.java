package com.clinic.demo.service;

import com.clinic.demo.models.entity.RoleEntity;
import com.clinic.demo.models.entity.user.BaseUserEntity;
import com.clinic.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// TODO finish the roleService
// implement group permissions based on Role
// create permission add and permission remove for specific users doesnt have to be here
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class RoleService {
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(RoleService.class);
    private final UserValidationService userValidationService;

    @Transactional
    public void addRole(BaseUserEntity user, RoleEntity role) {
        if (user == null) throw new IllegalArgumentException("User cannot be null");
        if (role == null) throw new IllegalArgumentException("Role cannot be null");

        boolean added = user.addRole(role);
        if (added) {
            userRepository.save(user);
            logger.info("Role '{}' added to user {}", role.getName(), user.getEmail());
        }
    }

    @Transactional
    public void removeRole(BaseUserEntity user, RoleEntity role) {
        if (user == null) throw new IllegalArgumentException("User cannot be null");
        if (role == null) throw new IllegalArgumentException("Role cannot be null");

        boolean removed = user.removeRole(role);
        if (removed) {
            userRepository.save(user);
            logger.info("Role '{}' removed from user {}", role.getName(), user.getEmail());
        }
    }
}

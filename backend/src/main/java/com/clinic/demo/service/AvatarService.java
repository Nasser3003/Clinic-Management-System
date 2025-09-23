package com.clinic.demo.service;

import com.clinic.demo.DTO.FileResponseDTO;
import com.clinic.demo.DTO.UploadPictureDTO;
import com.clinic.demo.models.entity.user.BaseUserEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class AvatarService {

    private static final Logger logger = LoggerFactory.getLogger(AvatarService.class);

    @Value("${app.file.upload.default-avatar}")
    private String defaultAvatarPath;

    private final UserService userService;
    private final AuthenticationService authenticationService;
    private final FileUploadService fileUploadService;


    @Transactional
    public void uploadProfilePicture(UploadPictureDTO uploadPictureDTO) {
        String email = uploadPictureDTO.email().toLowerCase();
        byte[] profilePicture = uploadPictureDTO.profilePicture();
        String originalFileName = uploadPictureDTO.fileName();

        BaseUserEntity user = userService.findUserByEmail(email);

        deleteOldAvatar(user.getAvatarPath());

        String filePath;
        try {
            filePath = fileUploadService.saveAvatar(profilePicture, email, originalFileName);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        user.setAvatarPath(filePath);
        userService.save(user);

        logger.info("Profile picture uploaded for user: {} at path: {}", email, filePath);
    }

    @Transactional
    public void deleteProfilePicture(String email) {
        BaseUserEntity user = userService.findUserByEmail(email.toLowerCase());
        String avatarPath = user.getAvatarPath();

        if (avatarPath != null && !avatarPath.trim().isEmpty()) {
            fileUploadService.deleteAvatar(avatarPath);
            user.setAvatarPath(null);
            userService.save(user);
            logger.info("Profile picture deleted for user: {}", email);
        }
    }


    public FileResponseDTO getCurrentUserProfilePicture() {
        String currentUserEmail = authenticationService.getAuthenticatedUserEmail();
        BaseUserEntity user = userService.findUserByEmail(currentUserEmail);
        return getUserProfilePicture(user);
    }

    public FileResponseDTO getUserProfilePicture(String email) {
        BaseUserEntity user = userService.findUserByEmail(email.toLowerCase());
        return getUserProfilePicture(user);
    }


    private FileResponseDTO getUserProfilePicture(BaseUserEntity user) {
        String avatarPath = user.getAvatarPath();

        if (avatarPath == null || avatarPath.trim().isEmpty())
            return getDefaultAvatarResponse();

        Resource resource;
        try {
            resource = fileUploadService.loadAvatar(avatarPath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        Path filePath = Paths.get(avatarPath);
        String contentType = fileUploadService.determineContentType(filePath);
        String fileName = filePath.getFileName().toString();

        return new FileResponseDTO(resource, contentType, true, fileName);
    }

    private FileResponseDTO getDefaultAvatarResponse() {
        Path defaultPath = Paths.get(defaultAvatarPath);
        if (Files.exists(defaultPath)) {
            Resource resource = new FileSystemResource(defaultPath);
            return new FileResponseDTO(resource, "image/png", true, "default-avatar.png");
        }

        return new FileResponseDTO(null, null, false, null);
    }

    private void deleteOldAvatar(String oldAvatarPath) {
        if (oldAvatarPath != null && !oldAvatarPath.trim().isEmpty())
            fileUploadService.deleteAvatar(oldAvatarPath);
    }
}
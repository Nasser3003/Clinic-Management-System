package com.clinic.demo.service;

import com.clinic.demo.DTO.FileResponseDTO;
import com.clinic.demo.DTO.UploadPictureDTO;
import com.clinic.demo.models.entity.user.BaseUserEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AvatarService {

    private static final Logger logger = LoggerFactory.getLogger(AvatarService.class);
    private static final String AVATAR_DIRECTORY = "files/avatars/";
    private static final String DEFAULT_AVATAR_PATH = "src/main/resources/static/default-avatar.png";
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");

    private final UserService userService;
    private final AuthenticationService authenticationService;

    // ===== UPLOAD OPERATIONS =====

    @Transactional
    public void uploadProfilePicture(UploadPictureDTO uploadPictureDTO) {
        String email = uploadPictureDTO.email().toLowerCase();
        byte[] profilePicture = uploadPictureDTO.profilePicture();
        String originalFileName = uploadPictureDTO.fileName();

        validateUpload(profilePicture, originalFileName);

        try {
            String fileExtension = getFileExtension(originalFileName);
            String uniqueFileName = generateUniqueFileName(email, fileExtension);

            createAvatarDirectoryIfNeeded();

            String filePath = saveFileToStorage(profilePicture, uniqueFileName);

            BaseUserEntity user = userService.findUserByEmail(email);

            deleteOldAvatar(user.getAvatarPath());

            user.setAvatarPath(filePath);
            userService.save(user);

            logger.info("Profile picture uploaded for user: {} at path: {}", email, filePath);

        } catch (Exception e) {
            logger.error("Error uploading profile picture for user {}: {}", email, e.getMessage(), e);
            throw new RuntimeException("Failed to upload profile picture", e);
        }
    }

    @Transactional
    public void deleteProfilePicture(String email) {
        BaseUserEntity user = userService.findUserByEmail(email.toLowerCase());
        String avatarPath = user.getAvatarPath();

        if (avatarPath != null && !avatarPath.trim().isEmpty()) {
            deleteOldAvatar(avatarPath);
            user.setAvatarPath(null);
            userService.save(user);
            logger.info("Profile picture deleted for user: {}", email);
        }
    }

    // ===== SERVING OPERATIONS =====

    public FileResponseDTO getCurrentUserProfilePicture() {
        String currentUserEmail = authenticationService.getAuthenticatedUserEmail();
        BaseUserEntity user = userService.findUserByEmail(currentUserEmail);
        return getUserProfilePicture(user);
    }

    public FileResponseDTO getUserProfilePicture(String email) {
        BaseUserEntity user = userService.findUserByEmail(email.toLowerCase());
        return getUserProfilePicture(user);
    }

    // ===== PRIVATE HELPER METHODS =====

    private FileResponseDTO getUserProfilePicture(BaseUserEntity user) {
        String avatarPath = user.getAvatarPath();

        if (avatarPath == null || avatarPath.trim().isEmpty())
            return getDefaultAvatarResponse();

        try {
            Path filePath = Paths.get(avatarPath);

            if (!isFileInAvatarDirectory(filePath)) {
                logger.warn("Attempted to access file outside avatar directory: {}", avatarPath);
                return getDefaultAvatarResponse();
            }

            if (!Files.exists(filePath)) {
                logger.warn("Avatar file not found: {}", avatarPath);
                return getDefaultAvatarResponse();
            }

            Resource resource = new FileSystemResource(filePath);
            String contentType = determineContentType(filePath);
            String fileName = filePath.getFileName().toString();

            return new FileResponseDTO(resource, contentType, true, fileName);

        } catch (Exception e) {
            logger.error("Error processing avatar file {}: {}", avatarPath, e.getMessage(), e);
            return getDefaultAvatarResponse();
        }
    }

    private FileResponseDTO getDefaultAvatarResponse() {
        try {
            Path defaultAvatarPath = Paths.get(DEFAULT_AVATAR_PATH);
            if (Files.exists(defaultAvatarPath)) {
                Resource resource = new FileSystemResource(defaultAvatarPath);
                return new FileResponseDTO(resource, "image/png", true, "default-avatar.png");
            }
        } catch (Exception e) {
            logger.warn("Default avatar not found: {}", e.getMessage());
        }

        return new FileResponseDTO(null, null, false, null);
    }

    private String generateUniqueFileName(String userEmail, String extension) {
        String emailHash = Integer.toHexString(userEmail.hashCode());
        long timestamp = System.currentTimeMillis();
        return "avatar_" + emailHash + "_" + timestamp + "." + extension;
    }

    private void validateUpload(byte[] fileData, String fileName) {
        if (fileData == null || fileData.length == 0)
            throw new IllegalArgumentException("Profile picture cannot be empty");

        if (fileData.length > MAX_FILE_SIZE)
            throw new IllegalArgumentException("File size cannot exceed 5MB");

        if (fileName == null || fileName.trim().isEmpty())
            throw new IllegalArgumentException("File name is required");

        String extension = getFileExtension(fileName).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension))
            throw new IllegalArgumentException("Invalid file type. Allowed: " + ALLOWED_EXTENSIONS);
    }

    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex == -1)
            throw new IllegalArgumentException("File must have an extension");
        return fileName.substring(lastDotIndex + 1).toLowerCase();
    }

    private void createAvatarDirectoryIfNeeded() throws IOException {
        Path avatarDir = Paths.get(AVATAR_DIRECTORY);
        if (!Files.exists(avatarDir)) {
            Files.createDirectories(avatarDir);
            logger.info("Created avatar directory: {}", AVATAR_DIRECTORY);
        }
    }

    private String saveFileToStorage(byte[] fileData, String fileName) throws IOException {
        Path filePath = Paths.get(AVATAR_DIRECTORY, fileName);
        Files.write(filePath, fileData, StandardOpenOption.CREATE, StandardOpenOption.WRITE);
        return filePath.toString();
    }

    private void deleteOldAvatar(String oldAvatarPath) {
        if (oldAvatarPath != null && !oldAvatarPath.trim().isEmpty()) {
            try {
                Path oldPath = Paths.get(oldAvatarPath);
                if (Files.exists(oldPath)) {
                    Files.delete(oldPath);
                    logger.info("Deleted old avatar: {}", oldAvatarPath);
                }
            } catch (IOException e) {
                logger.warn("Failed to delete old avatar {}: {}", oldAvatarPath, e.getMessage());
            }
        }
    }


    private boolean isFileInAvatarDirectory(Path filePath) {
        try {
            Path avatarDir = Paths.get(AVATAR_DIRECTORY).toAbsolutePath().normalize();
            Path fileAbsolutePath = filePath.toAbsolutePath().normalize();
            return fileAbsolutePath.startsWith(avatarDir);
        } catch (Exception e) {
            logger.error("Error checking file directory: {}", e.getMessage());
            return false;
        }
    }

    private String determineContentType(Path filePath) {
        String fileName = filePath.getFileName().toString().toLowerCase();

        if (fileName.endsWith(".png")) return "image/png";
        if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return "image/jpeg";
        if (fileName.endsWith(".gif")) return "image/gif";
        if (fileName.endsWith(".webp")) return "image/webp";

        return "image/jpeg";
    }
}
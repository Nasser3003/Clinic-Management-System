package com.clinic.demo.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FileUploadService {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadService.class);

    @Value("${app.file.upload.root-directory}")
    private String rootDirectory;

    @Value("${app.file.upload.avatars.directory}")
    private String avatarsSubDirectory;

    @Value("${app.file.upload.treatments.directory}")
    private String treatmentsSubDirectory;

    @Value("${app.file.upload.avatars.max-size:5MB}")
    private String avatarMaxSize;

    @Value("${app.file.upload.treatments.max-size:10MB}")
    private String treatmentMaxSize;

    @Value("${app.file.upload.avatars.allowed-extensions}")
    private String avatarExtensions;

    @Value("${app.file.upload.treatments.allowed-extensions}")
    private String treatmentExtensions;

    public String saveAvatar(byte[] fileData, String userEmail, String originalFileName) throws IOException {
        validateAvatarUpload(fileData, originalFileName);

        String fileExtension = getFileExtension(originalFileName);
        String uniqueFileName = generateAvatarFileName(userEmail, fileExtension);
        Path avatarDir = getAvatarDirectory();

        createDirectoryIfNeeded(avatarDir);

        Path filePath = avatarDir.resolve(uniqueFileName);
        Files.write(filePath, fileData, StandardOpenOption.CREATE, StandardOpenOption.WRITE);

        logger.info("Avatar saved: {}", filePath);
        return filePath.toString();
    }

    public Resource loadAvatar(String filePath) throws IOException {
        Path path = Paths.get(filePath);

        if (!isFileInAvatarDirectory(path))
            throw new SecurityException("File access denied: outside avatar directory");

        if (!Files.exists(path))
            throw new IOException("File not found: " + filePath);

        return new FileSystemResource(path);
    }

    public void deleteAvatar(String filePath) {
        if (filePath == null || filePath.trim().isEmpty()) return;

        Path path = Paths.get(filePath);
        if (Files.exists(path) && isFileInAvatarDirectory(path)) {
            try {
                Files.delete(path);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            logger.info("Avatar deleted: {}", filePath);
        }
    }

    public List<String> saveTreatmentFiles(List<MultipartFile> files, String userEmail) throws IOException {
        List<String> filePaths = new ArrayList<>();

        if (files == null || files.isEmpty()) return filePaths;

        Path treatmentDir = getTreatmentDirectory();
        createDirectoryIfNeeded(treatmentDir);

        String userPrefix = sanitizeForFileName(userEmail.replace("@", "_"));
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                validateTreatmentUpload(file);

                String originalFilename = file.getOriginalFilename();
                String cleanOriginalName = sanitizeForFileName(originalFilename);

                String extension = "";
                String nameWithoutExtension = cleanOriginalName;

                int lastDotIndex = cleanOriginalName.lastIndexOf('.');
                if (lastDotIndex > 0 && lastDotIndex < cleanOriginalName.length() - 1) {
                    extension = cleanOriginalName.substring(lastDotIndex);
                    nameWithoutExtension = cleanOriginalName.substring(0, lastDotIndex);
                }

                String uniqueFilename = userPrefix + "_" + timestamp + "_" + nameWithoutExtension + extension;
                Path filePath = treatmentDir.resolve(uniqueFilename);

                try (InputStream inputStream = file.getInputStream()) {
                    Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
                }

                String relativePath = treatmentsSubDirectory + "/" + uniqueFilename;
                filePaths.add(relativePath);

                logger.info("Treatment file saved: {}", filePath);
            }
        }

        return filePaths;
    }

    public Resource loadTreatmentFile(String filePath) throws IOException {
        Path fullPath = Paths.get(rootDirectory, filePath);

        if (!isFileInTreatmentDirectory(fullPath))
            throw new SecurityException("File access denied: outside treatment directory");

        if (!Files.exists(fullPath))
            throw new IOException("File not found: " + filePath);

        return new FileSystemResource(fullPath);
    }

    public String determineContentType(Path filePath) {
        String fileName = filePath.getFileName().toString().toLowerCase();

        if (fileName.endsWith(".png")) return "image/png";
        if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return "image/jpeg";
        if (fileName.endsWith(".gif")) return "image/gif";
        if (fileName.endsWith(".webp")) return "image/webp";
        if (fileName.endsWith(".pdf")) return "application/pdf";
        if (fileName.endsWith(".doc")) return "application/msword";
        if (fileName.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        if (fileName.endsWith(".txt")) return "text/plain";

        return "application/octet-stream";
    }


    private Path getAvatarDirectory() {
        return Paths.get(rootDirectory, avatarsSubDirectory);
    }

    private Path getTreatmentDirectory() {
        return Paths.get(rootDirectory, treatmentsSubDirectory);
    }

    private void createDirectoryIfNeeded(Path directory) throws IOException {
        if (!Files.exists(directory)) {
            Files.createDirectories(directory);
            logger.info("Created directory: {}", directory);
        }
    }

    private String generateAvatarFileName(String userEmail, String extension) {
        String emailHash = Integer.toHexString(userEmail.hashCode());
        long timestamp = System.currentTimeMillis();
        return "avatar_" + emailHash + "_" + timestamp + "." + extension;
    }

    private String sanitizeForFileName(String input) {
        if (input == null) return "";
        return input.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private void validateAvatarUpload(byte[] fileData, String fileName) {
        if (fileData == null || fileData.length == 0)
            throw new IllegalArgumentException("File cannot be empty");

        long maxSizeBytes = parseFileSize(avatarMaxSize);
        if (fileData.length > maxSizeBytes)
            throw new IllegalArgumentException("File size exceeds maximum allowed: " + avatarMaxSize);

        if (fileName == null || fileName.trim().isEmpty())
            throw new IllegalArgumentException("File name is required");

        validateFileExtension(fileName, avatarExtensions);
    }

    private void validateTreatmentUpload(MultipartFile file) {
        if (file.isEmpty())
            throw new IllegalArgumentException("File cannot be empty");

        long maxSizeBytes = parseFileSize(treatmentMaxSize);
        if (file.getSize() > maxSizeBytes)
            throw new IllegalArgumentException("File size exceeds maximum allowed: " + treatmentMaxSize);

        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.trim().isEmpty())
            throw new IllegalArgumentException("File name is required");

        validateFileExtension(fileName, treatmentExtensions);
    }

    private void validateFileExtension(String fileName, String allowedExtensions) {
        String extension = getFileExtension(fileName).toLowerCase();
        Set<String> allowed = Set.of(allowedExtensions.split(","));

        if (!allowed.contains(extension))
            throw new IllegalArgumentException("Invalid file type. Allowed: " + allowedExtensions);
    }

    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == fileName.length() - 1)
            throw new IllegalArgumentException("File must have a valid extension");
        return fileName.substring(lastDotIndex + 1).toLowerCase();
    }

    private long parseFileSize(String sizeStr) {
        if (sizeStr.endsWith("MB")) {
            return Long.parseLong(sizeStr.replace("MB", "")) * 1024 * 1024;
        }
        if (sizeStr.endsWith("KB")) {
            return Long.parseLong(sizeStr.replace("KB", "")) * 1024;
        }
        return Long.parseLong(sizeStr);
    }

    private boolean isFileInAvatarDirectory(Path filePath) {
        Path avatarDir = getAvatarDirectory().toAbsolutePath().normalize();
        Path fileAbsolutePath = filePath.toAbsolutePath().normalize();
        return fileAbsolutePath.startsWith(avatarDir);
    }

    private boolean isFileInTreatmentDirectory(Path filePath) {
        Path treatmentDir = getTreatmentDirectory().toAbsolutePath().normalize();
        Path fileAbsolutePath = filePath.toAbsolutePath().normalize();
        return fileAbsolutePath.startsWith(treatmentDir);
    }
}
package com.clinic.demo.controller;

import com.clinic.demo.DTO.FileResponseDTO;
import com.clinic.demo.DTO.UploadPictureDTO;
import com.clinic.demo.service.AvatarService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {

    private final AvatarService avatarService;

    @PostMapping("/upload-avatar")
    public ResponseEntity<String> uploadAvatar(
            @RequestParam("email") String email,
            @RequestParam("file") MultipartFile file) throws IOException {

        UploadPictureDTO uploadDTO = new UploadPictureDTO(
                email,
                file.getBytes(),
                file.getOriginalFilename()
        );

        avatarService.uploadProfilePicture(uploadDTO);
        return ResponseEntity.ok("Avatar uploaded successfully");
    }

    @GetMapping("/avatar/me")
    public ResponseEntity<Resource> getMyProfilePicture() throws IOException {
        FileResponseDTO response = avatarService.getCurrentUserProfilePicture();
        if (!response.exists())
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(response.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + response.fileName() + "\"")
                .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(response.resource().contentLength()))
                .body(response.resource());
    }

    @GetMapping("/avatar/{email}")
    public ResponseEntity<Resource> getProfilePicture(@PathVariable String email) {
        FileResponseDTO response = avatarService.getUserProfilePicture(email);
        return buildResourceResponse(response);
    }

    @DeleteMapping("/delete-avatar")
    public ResponseEntity<String> deleteProfilePicture(@RequestParam("email") String email) {
        avatarService.deleteProfilePicture(email);
        return ResponseEntity.ok("Avatar deleted successfully");
    }

    private ResponseEntity<Resource> buildResourceResponse(FileResponseDTO response) {
        if (!response.exists())
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(response.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                .body(response.resource());
    }
}
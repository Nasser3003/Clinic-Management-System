package com.clinic.demo.DTO;

public record UploadPictureDTO(
        String email,
        byte[] profilePicture,
        String fileName
) {
}

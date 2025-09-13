package com.clinic.demo.DTO;

import org.springframework.core.io.Resource;

public record FileResponseDTO(
        Resource resource,
        String contentType,
        boolean exists,
        String fileName
) {}

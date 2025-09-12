package com.clinic.demo.exception;

import java.time.LocalDateTime;
import java.util.List;

public record ApiError(
    LocalDateTime timestamp,
    int status,
    String error,
    String message,
    List<String> details
) {}
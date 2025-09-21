package com.clinic.demo.DTO;

import java.util.List;

public record SearchResponseDTO<T>(
    List<T> results,
    long total
) { }

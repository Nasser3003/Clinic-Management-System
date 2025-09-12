package com.clinic.demo.DTO.calenderDTO;

import java.time.LocalDateTime;

public record AvailableTimeSlotDTO(
        LocalDateTime startTime,
        LocalDateTime endTime,
        int durationMinutes
) {
}

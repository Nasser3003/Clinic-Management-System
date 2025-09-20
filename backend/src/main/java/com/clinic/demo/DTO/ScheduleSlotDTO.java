package com.clinic.demo.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

public record ScheduleSlotDTO(
        @NotBlank(message = "day of the week is required")
        String dayOfWeek,
        @NotNull(message = "start time is required")
        @JsonFormat(pattern = "HH:mm")
        LocalTime startTime,
        @NotNull(message = "end time is required")
        @JsonFormat(pattern = "HH:mm")
        LocalTime endTime
) {}
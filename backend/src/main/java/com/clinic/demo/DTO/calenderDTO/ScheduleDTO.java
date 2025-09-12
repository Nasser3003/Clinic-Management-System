package com.clinic.demo.DTO.calenderDTO;

import java.time.LocalTime;

public record ScheduleDTO(
        String dayOfWeek,
        LocalTime startTime,
        LocalTime endTime
) {
}

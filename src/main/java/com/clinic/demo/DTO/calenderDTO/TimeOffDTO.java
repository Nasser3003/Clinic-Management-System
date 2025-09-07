package com.clinic.demo.DTO.calenderDTO;

import com.clinic.demo.models.enums.TimeOffStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeOffDTO {

    private Long id;

    @NotNull(message = "Start date time is required")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDateTime;

    @NotNull(message = "End date time is required")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDateTime;

    @Size(max = 500, message = "Reason cannot exceed 500 characters")
    private String reason;

    private TimeOffStatus status;

    private String approvedBy;

    @Size(max = 1000, message = "Approval notes cannot exceed 1000 characters")
    private String approvalNotes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Employee information (optional, for admin views)
    private String employeeEmail;
    private String employeeName;

    // Calculated fields
    public long getDurationInDays() {
        if (startDateTime != null && endDateTime != null)
            return java.time.Duration.between(startDateTime, endDateTime).toDays() + 1;
        return 0;
    }

    public boolean isPending() {
        return status == TimeOffStatus.PENDING;
    }

    public boolean isApproved() {
        return status == TimeOffStatus.APPROVED;
    }

    public boolean isDeclined() {
        return status == TimeOffStatus.DECLINED;
    }
}
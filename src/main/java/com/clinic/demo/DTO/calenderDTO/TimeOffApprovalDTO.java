package com.clinic.demo.DTO.calenderDTO;

import com.clinic.demo.models.enums.TimeOffStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TimeOffApprovalDTO {
    @NotNull(message = "Status is required")
    private TimeOffStatus status; // APPROVED or DECLINED
    
    private String approvalNotes; // Optional notes from admin
    
    // Custom validation method (optional)
    public boolean isValidStatus() {
        return status == TimeOffStatus.APPROVED || status == TimeOffStatus.DECLINED;
    }
}
package com.clinic.demo.models.entity;

import com.clinic.demo.models.entity.user.EmployeeEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class TimeOff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private EmployeeEntity employee;

    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;

    private String reason;

}
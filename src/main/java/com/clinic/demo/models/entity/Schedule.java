package com.clinic.demo.models.entity;

import com.clinic.demo.models.entity.user.EmployeeEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@NoArgsConstructor
@Data
public class Schedule {

    public Schedule(EmployeeEntity employee, DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.dayOfWeek = dayOfWeek;
        this.employee = employee;
    }

    @Id
    private Long id;

    @ManyToOne
    private EmployeeEntity employee;

    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
}

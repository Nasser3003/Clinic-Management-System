package com.clinic.demo.models.entity;

import com.clinic.demo.models.entity.user.EmployeeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@NoArgsConstructor
@Data
@Table(name = "schedule_entity",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_employee_day_time",
                        columnNames = {"employee_id", "day_of_week", "start_time", "end_time"}
                )
        })
public class ScheduleEntity {

    public ScheduleEntity(EmployeeEntity employee, DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.dayOfWeek = dayOfWeek;
        this.employee = employee;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private EmployeeEntity employee;

    @Column(name = "day_of_week")
    @Enumerated(EnumType.ORDINAL) // This stores DayOfWeek as 0-6 (Monday=1, Sunday=7)
    private DayOfWeek dayOfWeek;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;
}
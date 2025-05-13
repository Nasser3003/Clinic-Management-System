package com.clinic.demo.repository;

import com.clinic.demo.models.entity.Schedule;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    Optional<Schedule> findScheduleByDayOfWeek(DayOfWeek dayOfWeek);
    List<Schedule> findScheduleByEmployee(EmployeeEntity employee);
    Optional<Schedule> findScheduleByEmployeeAndDayOfWeek(EmployeeEntity employee, DayOfWeek dayOfWeek);
}

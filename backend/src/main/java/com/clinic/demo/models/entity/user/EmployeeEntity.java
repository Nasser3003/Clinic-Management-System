package com.clinic.demo.models.entity.user;

import com.clinic.demo.models.enums.EmploymentStatusEnum;
import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.PermissionEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "user_employee")
public class EmployeeEntity extends BaseUserEntity {

    private String title;
    private String department;
    private EmploymentStatusEnum employmentStatus;
    private float salary;
    private String description;

    public EmployeeEntity(String firstName, String lastName, String email, String phoneNumber, String nationalId,
                          GenderEnum gender, UserTypeEnum userType, String password, LocalDate dateOfBirth,
                          float salary, Set<PermissionEnum> permissions) {
        super(firstName, lastName, email, phoneNumber, gender, userType, password, dateOfBirth, permissions);
        setNationalId(nationalId);
        setSalary(salary);
    }
}
package com.clinic.demo.models.entity.user;

import com.clinic.demo.models.enums.UserTypeEnum;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "user_employee")
public class EmployeeEntity extends AbstractUserEntity {
    {
        this.setUserType(UserTypeEnum.EMPLOYEE);
    }

    // has a salary
    // job title
    // employeee stuff
}



package com.almoatasem.demo.models.entitiy.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "user_employee")
public class EmployeeEntity extends AbstractUserEntity {
    // has a salary
    // job title
    // employeee stuff
}



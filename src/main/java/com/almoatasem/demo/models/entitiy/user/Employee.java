package com.almoatasem.demo.models.entitiy.user;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@DiscriminatorValue("employee")
@Entity
public class Employee extends UserInfo {
    // has a salary
    // job title
    // employeee stuff
}



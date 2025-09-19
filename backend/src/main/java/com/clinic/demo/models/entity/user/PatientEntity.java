package com.clinic.demo.models.entity.user;

import com.clinic.demo.models.entity.RoleEntity;
import com.clinic.demo.models.entity.TreatmentEntity;
import com.clinic.demo.models.enums.BloodTypeEnum;
import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "user_patient")
public class PatientEntity extends BaseUserEntity {

    public PatientEntity(String firstName, String lastName, String email, String phoneNumber, GenderEnum gender, UserTypeEnum userType, String password, LocalDate dateOfBirth, Set<RoleEntity> authorities) {
        super(firstName, lastName, email, phoneNumber, gender, userType, password, dateOfBirth, authorities);
        this.setUserType(UserTypeEnum.PATIENT);
    }

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<TreatmentEntity> pastTreatmentEntities = new ArrayList<>();

    private Set<String> allergies;
    private Set<String> healthIssues;
    private Set<String> prescriptions;
    private BloodTypeEnum bloodTypeEnum;

}

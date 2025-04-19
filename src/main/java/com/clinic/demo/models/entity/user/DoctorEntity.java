package com.clinic.demo.models.entity.user;

import com.clinic.demo.models.entity.AppointmentEntity;
import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "user_doctor")
public class DoctorEntity extends AbstractUserEntity {

    public DoctorEntity(String firstName, String lastName, String email, String phoneNumber, String nationalId,
                       String gender, String password, LocalDate dateOfBirth) {

        super(firstName, lastName, email, phoneNumber, GenderEnum.valueOf(gender.toUpperCase()), password);
        setUserTitle(UserTypeEnum.DOCTOR);
        setNationalId(nationalId);
        setDateOfBirth(dateOfBirth);
        setAuthorities(authorities);
    }

    private double salary;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private Set<AppointmentEntity> schedule = new HashSet<>();


}
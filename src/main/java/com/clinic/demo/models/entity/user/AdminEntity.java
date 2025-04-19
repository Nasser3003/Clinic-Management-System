package com.clinic.demo.models.entity.user;

import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "user_admin")
public class AdminEntity extends AbstractUserEntity {

    public AdminEntity(String firstName, String lastName, String email, String phoneNumber, String nationalId,
                       String gender, String password, LocalDate dateOfBirth) {

        super(firstName, lastName, email, phoneNumber, GenderEnum.valueOf(gender.toUpperCase()), password);
        setUserTitle(UserTypeEnum.ADMIN);
        setNationalId(nationalId);
        setDateOfBirth(dateOfBirth);
        setAuthorities(authorities);
    }

}

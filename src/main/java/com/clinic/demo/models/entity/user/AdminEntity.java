package com.clinic.demo.models.entity.user;

import com.clinic.demo.models.entity.RoleEntity;
import com.clinic.demo.models.enums.GenderEnum;
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
@Table(name = "user_admin")
public class AdminEntity extends AbstractUserEntity {

    public AdminEntity(String firstName, String lastName, String email, String phoneNumber, String nationalId,
                       GenderEnum gender, UserTypeEnum userType, String password, LocalDate dateOfBirth, Set<RoleEntity> authorities) {

        super(firstName, lastName, email, phoneNumber, gender, userType, password, dateOfBirth, authorities);
        setNationalId(nationalId);
    }

}

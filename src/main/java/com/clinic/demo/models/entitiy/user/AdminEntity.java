package com.clinic.demo.models.entitiy.user;

import com.clinic.demo.models.entitiy.RoleEntity;
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
    {
        setUserType(UserTypeEnum.ADMIN);
    }
    public AdminEntity(String email, String password, LocalDate dateOfBirth, Set<RoleEntity> authorities) {
        super(email, password, dateOfBirth, authorities);
    }

}

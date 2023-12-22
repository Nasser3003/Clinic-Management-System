package com.almoatasem.demo.models.entitiy.user;

import com.almoatasem.demo.models.entitiy.RoleEntity;
import com.almoatasem.demo.models.enums.UserTypeEnum;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    public AdminEntity(String username, String email, String password, Set<RoleEntity> authorities) {
        super(username, email, password, authorities);
    }

}

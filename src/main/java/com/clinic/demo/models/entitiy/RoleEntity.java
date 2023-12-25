package com.clinic.demo.models.entitiy;

import com.clinic.demo.models.enums.AuthorityEnum;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

@Data
@Entity
@NoArgsConstructor
@Table(name = "roles")
public class RoleEntity implements GrantedAuthority {

    public RoleEntity(AuthorityEnum authority) {
        this.authority = authority;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter(AccessLevel.NONE)
    @Column(name = "role_id")
    private Long id;

    @Column(unique = true)
    @Enumerated(EnumType.STRING)
    private AuthorityEnum authority;

    @Override
    public String getAuthority() {
        return authority.name();
    }

}

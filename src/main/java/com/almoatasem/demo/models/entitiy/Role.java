package com.almoatasem.demo.models.entitiy;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

@Getter
@Entity
@Table(name = "roles")
public class Role implements GrantedAuthority {

    public Role(String authority) {
        this.authority = authority;
    }

    public Role() {
        super();
    }

    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "role_id")
    private Long id;

    @Setter
    @Column(unique = true)
    private String authority;

}

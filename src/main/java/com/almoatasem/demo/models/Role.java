package com.almoatasem.demo.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

@Entity
@Table(name = "roles")
public class Role implements GrantedAuthority {

    public Role(int id, String authority) {
        this.id = id;
        this.authority = authority;
    }

    public Role(String authority) {
        this.authority = authority;
    }

    public Role() {
        super();
    }

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private long id;

    @Getter
    @Setter
    private String authority;

}

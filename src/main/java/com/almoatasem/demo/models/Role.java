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

    // why super here? in my UserInfo i didnt use super. (check video https://youtu.be/TeBt0Ike_Tk?si=73J27DKNJKB6rBHE&t=1894)

    public Role() {
        super();
    }
    // lombdok instead of creating getter @Setter method

    @Getter
    @Setter
    @Id
//    @GenericGenerator(name = "uuid2", strategy = "uuid2")
//    @GeneratedValue(generator = "uuid2")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private long id;

    @Getter
    @Setter
    private String authority;

}

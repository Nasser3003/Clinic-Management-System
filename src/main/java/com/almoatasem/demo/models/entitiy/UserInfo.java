package com.almoatasem.demo.models.entitiy;

import com.almoatasem.demo.models.enums.GENDER;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@EntityListeners(AuditingEntityListener.class)
@Table(name = "users")
public class UserInfo implements UserDetails {
    public UserInfo() {
        super();
        this.authorities = new HashSet<>();
    }

    public UserInfo(String username, String email, String password, String title, Set<Role> authorities) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.title = title;
        this.authorities = authorities;
    }

    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Setter
    private String title;

    @Setter
    private String firstName;

    @Setter
    private String lastName;

    @Setter
    @Column(nullable = false, unique = true)
    private String email;

    @Setter
    @Column(name = "date_of_birth")
    @DateTimeFormat(pattern = "yyyy-mm-dd")
    private LocalDate dateOfBirth;

    @Setter
    @Enumerated(EnumType.STRING)
    private GENDER gender;

    @Setter
    @Column(unique = true)
    private String username;

    @Setter
    @Column(nullable = false)
    private String password;

    @Setter
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_role_junction",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "role_id")}
    )
    private Set<Role> authorities;

    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createDate;

    @LastModifiedDate
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime lastModifiedDate;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserInfo userInfo = (UserInfo) o;
        return Objects.equals(id, userInfo.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }





    @Setter
    private boolean isAccountNonExpired = true;

    @Setter
    private boolean isAccountNonLocked = true;

    @Setter
    private boolean isCredentialsNonExpired = true;

    @Setter
    private boolean isEnabled = true;

}

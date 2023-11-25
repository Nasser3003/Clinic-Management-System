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
@EntityListeners(AuditingEntityListener.class)
@Table(name = "users")
public class UserInfo implements UserDetails {
    public UserInfo() {
        super();
        this.authorities = new HashSet<>();
    }

    public UserInfo(String username, String email, String password, Set<Role> authorities) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    @Getter
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Getter
    @Setter
    private String firstName;

    @Getter
    @Setter
    private String lastName;

    @Getter
    @Setter
    @Column(nullable = false, unique = true)
    private String email;

    @Getter
    @Setter
    @Column(name = "date_of_birth")
    @DateTimeFormat(pattern = "yyyy-mm-dd")
    private LocalDate dateOfBirth;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    private GENDER gender;

    @Getter
    @Setter
    @Column(unique = true)
    private String username;

    @Getter
    @Setter
    @Column(nullable = false)
    private String password;

    @Getter
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

    @Override
    public String toString() {
        return "UserTable{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", age=" + dateOfBirth +
                ", gender=" + gender +
                '}';
    }

    @Getter
    @Setter
    private boolean isAccountNonExpired = true;

    @Getter
    @Setter
    private boolean isAccountNonLocked = true;

    @Getter
    @Setter
    private boolean isCredentialsNonExpired = true;

    @Getter
    @Setter
    private boolean isEnabled = true;

}

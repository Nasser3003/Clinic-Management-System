package com.almoatasem.demo.models.entitiy.user;

import com.almoatasem.demo.models.entitiy.RoleEntity;
import com.almoatasem.demo.models.enums.GenderEnum;
import com.almoatasem.demo.models.enums.UserTypeEnum;
import jakarta.persistence.*;
import lombok.*;
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
@Data
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Inheritance(strategy = InheritanceType.JOINED)
@ToString(exclude = "id")
@Table(name = "users")
public abstract class AbstractUserEntity implements UserDetails {

    public AbstractUserEntity(String username, String email, String password, Set<RoleEntity> authorities) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }
    public AbstractUserEntity(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    @Setter(AccessLevel.NONE)
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "user_type")
    @Enumerated(EnumType.STRING)
    private UserTypeEnum userType;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "date_of_birth")
    @DateTimeFormat(pattern = "yyyy-mm-dd")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private GenderEnum gender;

    @Column(unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_role_junction",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "role_id")}
    )
    private Set<RoleEntity> authorities = new HashSet<>();

    @CreatedDate
    @Column(name = "created_date")
    @Setter(AccessLevel.NONE)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createDate;

    @Column(name = "last_modified_date")
    @LastModifiedDate
    @Setter(AccessLevel.NONE)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime lastModifiedDate;

    @Column(name = "is_account_non_expired")
    private boolean isAccountNonExpired = true;

    @Column(name = "is_account_non_locked")
    private boolean isAccountNonLocked = true;

    @Column(name = "is_credentials_non_locked")
    private boolean isCredentialsNonExpired = true;

    @Column(name = "is_enabled")
    private boolean isEnabled = true;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AbstractUserEntity abstractUserEntity = (AbstractUserEntity) o;
        return Objects.equals(id, abstractUserEntity.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public void addRole(RoleEntity roleEntity) {
        authorities.add(roleEntity);
    }
    public void removeRole(RoleEntity roleEntity) {
        authorities.remove(roleEntity);
    }


}

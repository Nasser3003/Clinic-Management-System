package com.clinic.demo.models.entity.user;

import com.clinic.demo.models.entity.TreatmentEntity;
import com.clinic.demo.models.enums.BloodTypeEnum;
import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.PermissionEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "user_patient")
public class PatientEntity extends BaseUserEntity {

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<TreatmentEntity> pastTreatmentEntities = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "patient_allergies", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "allergy")
    private Set<String> allergies;

    @ElementCollection
    @CollectionTable(name = "patient_health_issues", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "health_issue")
    private Set<String> healthIssues;

    @ElementCollection
    @CollectionTable(name = "patient_prescriptions", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "prescription")
    private Set<String> prescriptions;

    @Enumerated(EnumType.STRING)
    private BloodTypeEnum bloodTypeEnum;

    public PatientEntity(String firstName, String lastName, String email, String phoneNumber,
                         GenderEnum gender, String password, LocalDate dateOfBirth,
                         Set<PermissionEnum> permissions) {
        super(firstName, lastName, email, phoneNumber, gender, UserTypeEnum.PATIENT, password, dateOfBirth, permissions);
    }
}
package com.clinic.demo.models.entity;

import com.clinic.demo.models.entity.user.BaseUserEntity;
import com.clinic.demo.models.enums.notifications.NotificationChannel;
import com.clinic.demo.models.enums.notifications.NotificationType;
import com.clinic.demo.models.enums.notifications.ReminderFrequency;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "notification_preferences")
public class NotificationPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private BaseUserEntity user;

    @Column(nullable = false)
    private boolean emailNotificationsEnabled = true;

    @Column(nullable = false)
    private boolean smsNotificationsEnabled = false;

    @Column(nullable = false)
    private boolean pushNotificationsEnabled = false;

    @Column(nullable = false)
    private boolean appointmentRemindersEnabled = true;

    @Column(nullable = false)
    private boolean prescriptionRemindersEnabled = true;

    @Column(nullable = false)
    private boolean labResultsNotificationsEnabled = true;

    @Column(nullable = false)
    private boolean emergencyAlertsEnabled = true;

    @Column
    private String preferredNotificationTime = "09:00";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderFrequency appointmentReminderFrequency = ReminderFrequency.TWO_DAYS_BEFORE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationChannel appointmentNotificationChannel = NotificationChannel.EMAIL_ONLY;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdDate;

    public boolean canReceiveEmailNotifications() {
        return emailNotificationsEnabled && user != null && 
               user.getEmail() != null && !user.getEmail().isEmpty();
    }

    public boolean canReceiveSmsNotifications() {
        return smsNotificationsEnabled && user != null && 
               user.getPhoneNumber() != null && !user.getPhoneNumber().isEmpty();
    }

    public boolean shouldReceiveNotification(NotificationType type, NotificationChannel channel) {
        if (user == null || user.isDeleted() || !user.isEnabled())
            return false;

        return switch (channel) {
            case EMAIL_ONLY -> canReceiveEmailNotifications();
            case SMS_ONLY -> canReceiveSmsNotifications();
            case BOTH -> canReceiveEmailNotifications() || canReceiveSmsNotifications();
            default -> false;
        };
    }

    public NotificationPreferences(BaseUserEntity user) {
        this.user = user;
    }
}


package com.clinic.demo.service;

import com.clinic.demo.models.entity.UserOtpEntity;
import com.clinic.demo.models.enums.OtpPurpose;
import com.clinic.demo.repository.UserOtpRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional
public class OtpService {
    
    private final UserOtpRepository otpRepository;
    private final MailService mailService;
    
    public void generateAndSendOtp(String email, OtpPurpose purpose) {
        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(1000000));
        
        UserOtpEntity otpEntity = new UserOtpEntity();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setPurpose(purpose);
        
        otpRepository.save(otpEntity);
        
        switch (purpose) {
            case PASSWORD_RESET -> mailService.sendPasswordResetOtp(email, otp);
            case EMAIL_VERIFICATION -> mailService.sendEmailVerificationOtp(email, otp);
            case TWO_FACTOR_AUTH -> mailService.sendTwoFactorOtp(email, otp);
        }
    }
    
    public boolean validateOtp(String email, String otp, OtpPurpose purpose) {
        Optional<UserOtpEntity> otpEntity = otpRepository
            .findByEmailAndPurposeAndUsedFalse(email, purpose);

        if (otpEntity.isEmpty() || otpEntity.get().isExpired())
            return false;

        if (!otpEntity.get().getEmail().equals(email))
            return false;

        otpEntity.get().setUsed(true);
        otpRepository.save(otpEntity.get());
        return true;
    }
    
    @Scheduled(fixedRate = 3600000)
    public void cleanupExpiredOtps() {
        otpRepository.cleanupExpiredAndUsedOtps(LocalDateTime.now().minusMinutes(10));
    }
}
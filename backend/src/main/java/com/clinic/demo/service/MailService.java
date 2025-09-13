package com.clinic.demo.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    public void sendPasswordResetOtp(String email, String otp) {
        String subject = "Password Reset - One Time Passcode";
        String htmlContent = String.format("""
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
                <h3>Password Reset Request</h3>
                <p>You have requested to reset your password. Please use the following OTP code:</p>
                <div style="background: #f0f0f0; padding: 15px; text-align: center; border-radius: 5px;">
                    <span style="font-size: 24px; font-weight: bold; color: #d73502; letter-spacing: 3px;">%s</span>
                </div>
                <p><small>This code expires in 10 minutes</small></p>
            </div>
            """, otp);

        sendEmail(email, subject, htmlContent);
    }

    public void sendEmailVerificationOtp(String email, String otp) {
        String subject = "Email Verification Code";
        String htmlContent = String.format("""
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
                <h3>Email Verification</h3>
                <p>Please verify your email using this code:</p>
                <div style="background: #f0f0f0; padding: 15px; text-align: center; border-radius: 5px;">
                    <span style="font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 3px;">%s</span>
                </div>
                <p><small>This code expires in 10 minutes</small></p>
            </div>
            """, otp);

        sendEmail(email, subject, htmlContent);
    }

    public void sendTwoFactorOtp(String email, String otp) {
        String subject = "Two-Factor Authentication Code";
        String htmlContent = String.format("""
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
                <h3>Security Code</h3>
                <p>Your login verification code:</p>
                <div style="background: #f0f0f0; padding: 15px; text-align: center; border-radius: 5px;">
                    <span style="font-size: 24px; font-weight: bold; color: #28a745; letter-spacing: 3px;">%s</span>
                </div>
                <p><small>This code expires in 10 minutes</small></p>
            </div>
            """, otp);

        sendEmail(email, subject, htmlContent);
    }

    public void sendNotification(String email, String title, String message) {
        String subject = "Notification - " + title;
        String htmlContent = String.format("""
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h3>%s</h3>
            <div style="background: #e7f3ff; padding: 15px; border-left: 4px solid #007bff; border-radius: 5px;">
                <p style="margin: 0; color: #333;">%s</p>
            </div>
            <br>
            <p><small>This is an automated notification from our system.</small></p>
        </div>
        """, title, message);

        sendEmail(email, subject, htmlContent);
    }

    public void sendEmailWithAttachment(String email, String subject, String htmlContent, String filePath) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            if (filePath != null) {
                FileSystemResource file = new FileSystemResource(new File(filePath));
                helper.addAttachment(file.getFilename(), file);
            }

            mailSender.send(mimeMessage);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private void sendEmail(String email, String subject, String htmlContent) {
        sendEmailWithAttachment(email, subject, htmlContent, null);
    }
}
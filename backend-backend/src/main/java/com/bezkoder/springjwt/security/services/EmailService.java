package com.bezkoder.springjwt.security.services;


import com.bezkoder.springjwt.models.Request;
import com.bezkoder.springjwt.repository.AuthorizationRequestRepository;
import com.bezkoder.springjwt.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    private final RequestRepository rR;

    private final AuthorizationRequestRepository authorizationRequestRepository;

    public void sendResetPasswordEmail(String to, String token) {
        String subject = "Réinitialisation de votre mot de passe";
        String resetUrl = "http://localhost:8080/api/auth/reset-password?token=" + token;
        String content = "Pour réinitialiser votre mot de passe, cliquez sur ce lien : " + resetUrl;
        sendEmail(to, subject, content);
    }

    public void sendEmail(String to, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        mailSender.send(message);
    }
    
    public EmailService(JavaMailSender mailSender, RequestRepository rR, AuthorizationRequestRepository authorizationRequestRepository) {
        this.mailSender = mailSender;
        this.rR = rR;
        this.authorizationRequestRepository = authorizationRequestRepository;
    }

    public void sendLeaveRequestEmail(String adminEmail, String emailMessage) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom("spring.email.from@gmail.com");
        mailMessage.setTo(adminEmail);
        mailMessage.setSubject("Leave Request Notification");
        mailMessage.setText(emailMessage);

        mailSender.send(mailMessage);
    }
    public void sendApprovalEmail(String recipientEmail, String name) {
        String subject = "Leave Request Approved";
        String message = String.format("Hello %s,\n\nYour leave request has been approved.\n\nBest regards,\nYour HR Team", name);

        sendEmail(recipientEmail, subject, message);
    }

    public void sendRejectionEmail(String recipientEmail, String name) {
        String subject = "Leave Request Rejected";
        String message = String.format("Hello %s,\n\nYour leave request has been rejected.\n\nBest regards,\nYour HR Team", name);

        sendEmail(recipientEmail, subject, message);
    }


    public boolean deleteRequestByID(long id) {
        Optional<Request> existingRequest = rR.findById(id);
        if (existingRequest.isPresent()) {
            rR.deleteById(id);
            return true;
        }
        return false;
    }
    // Method to delete all requests
    public void deleteAllRequests() {
        rR.deleteAll();
    }
    @Transactional
    public void deleteMultipleRequests(List<Long> ids) {
        rR.deleteByIdIn(ids);
    }

    // Method to get all requests with pagination
    public Page<Request> getAllRequests(Pageable pageable) {
        return rR.findAll(pageable);
    }
    public void sendAuthorizationRequestEmail(String adminEmail, String emailMessage) {
        sendEmail(adminEmail, "Authorization Request Notification", emailMessage);
    }

    public boolean deleteAuthorizationRequestByID(long id) {
        if (authorizationRequestRepository.existsById(id)) {
            authorizationRequestRepository.deleteById(id);
            return true;
        }
        return false;
    }
    public void deleteAllAuthorizationRequests() {
        authorizationRequestRepository.deleteAll();
    }
    @Transactional
    public void deleteMultipleAuthorizationRequests(List<Long> ids) {
        authorizationRequestRepository.deleteByIdIn(ids);
    }
}

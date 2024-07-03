package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.repository.UserRepository;
import com.bezkoder.springjwt.security.services.EmailService;
import com.bezkoder.springjwt.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Optional;

@Controller
@RequestMapping("/api/auth")
public class PasswordResetController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/reset-password")
    public String showResetPasswordForm(@RequestParam("token") String token, Model model) {
        Optional<User> userOptional = userRepository.findByResetPasswordToken(token);
        if (!userOptional.isPresent() || userOptional.get().isResetPasswordTokenExpired()) {
            model.addAttribute("error", "Le token est invalide ou a expiré");
            return "error"; // Supposons qu'il existe une page d'erreur définie
        }

        model.addAttribute("token", token);
        return "reset-password"; // Supposons qu'il existe un template Thymeleaf nommé reset-password.html
    }

    @PostMapping("/reset-password")
    public String resetUserPassword(@RequestParam String token, @RequestParam String password, @RequestParam String confirmPassword, RedirectAttributes redirectAttributes) {
        if (!password.equals(confirmPassword)) {
            redirectAttributes.addFlashAttribute("error", "Les mots de passe ne correspondent pas.");
            return "redirect:/api/auth/reset-password?token=" + token;
        }

        Optional<User> userOptional = userRepository.findByResetPasswordToken(token);
        if (!userOptional.isPresent() || userOptional.get().isResetPasswordTokenExpired()) {
            redirectAttributes.addFlashAttribute("error", "Le token est invalide ou a expiré.");
            return "redirect:/api/auth/reset-password?token=" + token;
        }

        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(password));
        user.setResetPasswordToken(null);
        userRepository.save(user);

        redirectAttributes.addFlashAttribute("success", "Votre mot de passe a été réinitialisé avec succès.");
        return "redirect:http://localhost:4200/login"; // Redirection vers la page de connexion Angular
    }
}

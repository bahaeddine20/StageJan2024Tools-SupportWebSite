package com.bezkoder.springjwt.security;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;

import com.bezkoder.springjwt.models.ERole;
import com.bezkoder.springjwt.models.Role;
import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.repository.RoleRepository;
import com.bezkoder.springjwt.repository.UserRepository;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            // Création des rôles si non existants
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseGet(() -> {
                        Role newAdminRole = new Role(ERole.ROLE_ADMIN);
                        return roleRepository.save(newAdminRole);
                    });

            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseGet(() -> {
                        Role newUserRole = new Role(ERole.ROLE_USER);
                        return roleRepository.save(newUserRole);
                    });

            // Création d'un compte administrateur par défaut
            if (!userRepository.existsByUsername("admin")) {
                User adminUser = new User("admin", "montassar.gassara01@gmail.com", encoder.encode("admin123"));
                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);
                roles.add(userRole);
                adminUser.setRoles(roles);
                userRepository.save(adminUser);
            }
        };
    }
}
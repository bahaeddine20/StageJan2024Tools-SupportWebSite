package com.bezkoder.springjwt.security.services;
import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class UserService {
	private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getUserDetails(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    }
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Integer getEmployeeIdByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return user.getEmployeeId();
    }
    public User updateUser(User User) {
        logger.info("Updating User ID: {}", User.getId());
        User existingEMP = userRepository.findById(User.getId()).orElse(null);
        if (existingEMP == null) {
            logger.error("User not found with ID: {}", User.getId());
            throw new IllegalArgumentException("User not found with ID: " + User.getId());
        } else {
        	existingEMP.setUsername(User.getUsername());
        	existingEMP.setEmail(User.getEmail());
        	existingEMP.setPassword(passwordEncoder.encode(User.getPassword()));
        	existingEMP.setCity(User.getCity());
        	existingEMP.setPosition(User.getPosition());
        	existingEMP.setLinkedInLink(User.getLinkedInLink());
        	existingEMP.setGitLink(User.getGitLink());
        	existingEMP.setPersonalLink(User.getPersonalLink());
        	existingEMP.setProfileImage(User.getProfileImage());
        	User updatedUser = userRepository.save(existingEMP);
            logger.info("User updated successfully: {}", updatedUser.getId());
            return updatedUser;
        }
    }
}

package com.bezkoder.springjwt.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.payload.request.ChangePasswordRequest;
import com.bezkoder.springjwt.repository.UserRepository;
import com.bezkoder.springjwt.models.ImageModel;
import com.bezkoder.springjwt.security.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@CrossOrigin(origins = "*") // Allow requests from Angular frontend
@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

	@GetMapping("/{id}")
	public ResponseEntity<?> getUserById(@PathVariable Long id) {
	    try {
	        User user = userService.getUserDetails(id);
	        return ResponseEntity.ok(user);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("Error retrieving user: " + e.getMessage());
	    }
	}public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/employee-id/{id}")
	public ResponseEntity<?> getEmployeeIdByUserId(@PathVariable Long id) {
		try {
			Integer employeeId = userService.getEmployeeIdByUserId(id);
			return ResponseEntity.ok(employeeId);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error retrieving employee ID: " + e.getMessage());
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateUser(@PathVariable long id,
	                                     @RequestPart("user") String userJson,
	                                     @RequestPart(value = "passwordChange",required = false) String passwordChangeJson,
	                                     @RequestPart(value = "imagePath",required = false) MultipartFile file) {
	    try {
	        User userDto = new ObjectMapper().readValue(userJson, User.class);
	        ChangePasswordRequest passwordChange = null;
	        if (passwordChangeJson != null && !passwordChangeJson.isEmpty()) {
	            passwordChange = new ObjectMapper().readValue(passwordChangeJson, ChangePasswordRequest.class);
	        }

	        User existingUser = userRepository.findById(id)
	            .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + id));

	        // Update password if necessary
	        if (passwordChange != null && passwordChange.getOldPassword() != null &&
	            passwordChange.getNewPassword() != null && passwordChange.getConfirmPassword() != null) {
	            if (!passwordEncoder.matches(passwordChange.getOldPassword(), existingUser.getPassword())) {
	                return ResponseEntity.badRequest().body("Old password is incorrect");
	            }
	            if (!passwordChange.getNewPassword().equals(passwordChange.getConfirmPassword())) {
	                return ResponseEntity.badRequest().body("New password does not match confirm password");
	            }
	            existingUser.setPassword(passwordEncoder.encode(passwordChange.getNewPassword()));
	        }

	        // Update image if provided
	        if (file != null && !file.isEmpty()) {
	            Set<ImageModel> images = uploadImage(new MultipartFile[]{file});
	            existingUser.setProfileImage(images);
	        }

	        // Update other user details
	        existingUser.setUsername(userDto.getUsername());
	        existingUser.setEmail(userDto.getEmail());
	        existingUser.setCity(userDto.getCity());
	        existingUser.setPosition(userDto.getPosition());
	        existingUser.setLinkedInLink(userDto.getLinkedInLink());
	        existingUser.setGitLink(userDto.getGitLink());
	        existingUser.setPersonalLink(userDto.getPersonalLink());

	        User updatedUser = userRepository.save(existingUser);
	        return ResponseEntity.ok(updatedUser);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user: " + e.getMessage());
	    }
	}



	public Set<ImageModel> uploadImage(MultipartFile[] multipartFiles) throws IOException {
	    Set<ImageModel> imageModels = new HashSet<>();
	    for (MultipartFile file : multipartFiles) {
	        if (file.isEmpty()) {
	            continue; // Skip empty files
	        }
	        // Additional validations can be added here (e.g., file size, content type)
	        ImageModel imageModel = new ImageModel(file.getOriginalFilename(), file.getContentType(), file.getBytes());
	        imageModels.add(imageModel);
	    }
	    return imageModels;
	}


}

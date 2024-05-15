package com.bezkoder.springjwt.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
	@Autowired
	UserRepository userRepository;

	@Override
	@Transactional
	public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
		User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
				.orElseThrow(() -> new UsernameNotFoundException("User Not Found with username or email: " + usernameOrEmail));

		return UserDetailsImpl.build(user);
	}
	public String setPassword(String email, String newPassword){
		User user = userRepository.findByEmail(email)
				.orElseThrow(
						() -> new RuntimeException("User not found with this email:" + email));
		user.setPassword(newPassword);
		userRepository.save(user);
		return "new password set successfully login with new password";

	}
}

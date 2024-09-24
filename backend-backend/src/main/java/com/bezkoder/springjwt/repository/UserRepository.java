package com.bezkoder.springjwt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bezkoder.springjwt.models.ERole;
import com.bezkoder.springjwt.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findById(Long id);

	Optional<User> findByEmail(String email);
	Optional<User> findByResetPasswordToken(String resetPasswordToken);  // Ajoutez cette ligne
	Boolean existsByUsername(String username);
	Boolean existsByEmail(String email);
	Optional<User> findByUsernameOrEmail(String username, String email);
	List<User> findByRolesName(ERole name);
	@Query("SELECT u FROM User u JOIN u.roles r WHERE u.email = :email AND r.name = :role")
    Optional<User> findByEmailAndRoleName(@Param("email") String email, @Param("role") ERole role);
	User findByUsername(String username);

}
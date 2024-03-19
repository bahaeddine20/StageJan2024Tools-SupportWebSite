package com.RHActia_Auth.actia_app_Auth.repository;

import java.util.Optional;

import com.RHActia_Auth.actia_app_Auth.models.ERole;
import com.RHActia_Auth.actia_app_Auth.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
	Optional<Role> findByName(ERole name);
}

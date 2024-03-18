package com.RHActia.actia_app.repository;

import com.RHActia.actia_app.model.Employee;
import com.RHActia.actia_app.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team,Integer> {
    Optional<Team> findByName(String name);
}

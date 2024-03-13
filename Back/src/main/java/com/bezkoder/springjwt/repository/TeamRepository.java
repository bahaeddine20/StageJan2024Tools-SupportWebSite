package com.bezkoder.springjwt.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.bezkoder.springjwt.models.Team;

import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team,Integer> {
    Optional<Team> findByName(String name);
}

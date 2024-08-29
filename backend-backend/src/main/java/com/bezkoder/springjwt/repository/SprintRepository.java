package com.bezkoder.springjwt.repository;

import com.bezkoder.springjwt.models.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SprintRepository extends JpaRepository<Sprint, Integer> {


    List<Sprint> findByTeam_Id(int teamId);
}

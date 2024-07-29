package com.bezkoder.springjwt.security.services;

import com.bezkoder.springjwt.models.Employee;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.bezkoder.springjwt.models.Team;
import com.bezkoder.springjwt.repository.TeamRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TeamService {
    private static final Logger logger = LoggerFactory.getLogger(TeamService.class);
    @Autowired
    TeamRepository TR;

    public List<Team> getAllTeams() {
        List<Team> Teams = new ArrayList<Team>();
        TR.findAll().forEach(t -> Teams.add(t));
        return Teams;
    }
    public List<Team> getAllTeamExcel() {
        List<Team> Teams = new ArrayList<Team>();
        TR.findAll().forEach(t -> Teams.add(t));
        return Teams;
    }

    //getting a specific record by using the method findById() of CrudRepository
    public Team getTeamById(int id) {
        return TR.findById(id).get();
    }


    //saving a specific record by using the method save() of CrudRepository
    public Team addTeam(Team team) throws IOException {
        if (teamExists(team.getName())) {
            throw new IllegalArgumentException("Team already exists");
        }

        return TR.save(team);
    }
    public boolean teamExists(String email) {
        return TR.findByName(email).isPresent();
    }
    public boolean checkTeamExists(String name) {
        Optional<Team> existingTeam = TR.findByName(name);
        return existingTeam.isPresent();
    }

    public Team updateTeam(Team team) {
        logger.info("Updating team ID: {}", team.getId());
        Optional<Team> existingEMPOpt = TR.findById(team.getId());

        if (!existingEMPOpt.isPresent()) {
            logger.error("team not found with ID: {}", team.getId());
            throw new IllegalArgumentException("team not found with ID: " + team.getId());
        }

        Team existingEMP = existingEMPOpt.get();
        existingEMP.setName(team.getName());
        existingEMP.setDescription(team.getDescription());
        existingEMP.setTechnologie(team.getTechnologie()); // Mettez à jour la propriété Technologie

        if (team.getTeamImages() != null && !team.getTeamImages().isEmpty()) {
            existingEMP.setTeamImages(team.getTeamImages());
        }

        Team updatedTeam = TR.save(existingEMP);
        logger.info("team updated successfully: {}", updatedTeam.getId());
        return updatedTeam;
    }

    //deleting a specific record by using the method deleteById() of CrudRepository
    public void delete ( int id)
    {
        TR.deleteById(id);
    }
    public String uploadImage(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(fileName);
        Files.copy(file.getInputStream(), filePath);
        return fileName; // Retourne uniquement le nom du fichier téléchargé
    }

    public Long countTeams() {
        return TR.count();
    }
}

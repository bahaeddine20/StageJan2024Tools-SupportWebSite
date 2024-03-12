package com.RHActia.actia_app.services;

import com.RHActia.actia_app.model.Employee;
import com.RHActia.actia_app.model.Team;
import com.RHActia.actia_app.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    @Autowired
    TeamRepository TR;

    public List<Team> getAllTeams() {
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
    public boolean teamExists(String name) {
        Optional<Team> existingTeam = TR.findByName(name);
        return existingTeam.isPresent();
    }
    public Team updateTeam(Team team) {
        Team existingTeam = TR.findById(team.getId()).orElse(null);
        if(existingTeam == null) {
            throw new IllegalArgumentException("Team not found with ID: " + team.getId());
        } else {
            existingTeam.setName(team.getName());
            existingTeam.setDescription(team.getDescription());
            existingTeam.setTeamImages(team.getTeamImages());
            return TR.save(existingTeam);
        }
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
}

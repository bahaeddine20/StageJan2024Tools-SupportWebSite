package com.bezkoder.springjwt.security.services;

import com.bezkoder.springjwt.models.Sprint;
import com.bezkoder.springjwt.models.Team;
import com.bezkoder.springjwt.repository.SprintRepository;
import com.bezkoder.springjwt.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SprintService {

    @Autowired
    private SprintRepository sprintRepository;
    @Autowired
    private  TeamService teamService;

    // Create a new Sprint

    @Autowired
    private TeamRepository teamRepository;

   public Sprint createSprint(Sprint sprint, int teamId) {
        // Fetch the team by ID
        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new RuntimeException("Team not found with ID " + teamId));

        // Set the team on the sprint object
        sprint.setTeam(team);

        // Save the sprint
        return sprintRepository.save(sprint);
    }

    // Retrieve all Sprints
    public List<Sprint> getAllSprints(int teamId) {
        return sprintRepository.findByTeam_Id(teamId);
    }

    // Retrieve a Sprint by ID
    public Optional<Sprint> getSprintById(int id) {
        return sprintRepository.findById(id);
    }

    // Update a Sprint
    public Sprint updateSprint(int id, Sprint sprintDetails) {
        Optional<Sprint> optionalSprint = sprintRepository.findById(id);
        if (optionalSprint.isPresent()) {
            Sprint sprint = optionalSprint.get();
            sprint.setName(sprintDetails.getName());
            sprint.setDescription(sprintDetails.getDescription());
            sprint.setDate_Debut(sprintDetails.getDate_Debut());
            sprint.setDate_Fin(sprintDetails.getDate_Fin());
            Team team=teamService.getTeamById(sprintDetails.getTeam().getId());

            sprint.setTeam(team);
            return sprintRepository.save(sprint);
        } else {
            throw new RuntimeException("Sprint not found with id " + id);
        }
    }

    // Delete a Sprint
    public void deleteSprint(int id) {
        Optional<Sprint> sprint = sprintRepository.findById(id);
        if (sprint.isPresent()) {
            sprintRepository.delete(sprint.get());
        } else {
            throw new RuntimeException("Sprint not found with id " + id);
        }
    }
}

package com.bezkoder.springjwt.security.services;

import com.amazonaws.services.glue.model.EntityNotFoundException;
import com.bezkoder.springjwt.models.Employee;
import com.bezkoder.springjwt.models.LeaveRequest;
import com.bezkoder.springjwt.models.Sprint;
import com.bezkoder.springjwt.models.Team;
import com.bezkoder.springjwt.repository.LeaveRequestRepository;
import com.bezkoder.springjwt.repository.SprintRepository;
import com.bezkoder.springjwt.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SprintService {

    @Autowired
    private SprintRepository sprintRepository;
    @Autowired
    private  TeamService teamService;
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;


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



 public Set<Employee> getEmployeesBySprintId(int sprintId) {
        Optional<Sprint> sprintOptional = sprintRepository.findById(sprintId);

        if (sprintOptional.isPresent()) {
            Sprint sprint = sprintOptional.get();
            Team team = sprint.getTeam();
            return team.getEmployees();  // Retourner les employés de l'équipe associée au sprint
        }

        throw new EntityNotFoundException("Sprint not found with id: " + sprintId);
    }


public int CoutCongee(int sprintId, Date start, Date end) {
    Optional<Sprint> sprintOptional = sprintRepository.findById(sprintId);
    if (!sprintOptional.isPresent()) {
        throw new EntityNotFoundException("Sprint not found with id: " + sprintId);
    }

    Sprint sprint = sprintOptional.get();
    Team team = sprint.getTeam();
    int nbremp=team.getEmployees().size();
    System.out.println("nombre d'emploiee:"+nbremp);
    int totalConfirmedLeaveDays = 0;

    System.out.println("Start date: " + start);
    System.out.println("End date: " + end);

    for (Employee employee : team.getEmployees()) {
        // Filtrer les doublons dans les demandes de congé confirmées
        List<LeaveRequest> confirmedLeaveRequests = leaveRequestRepository
                .findByEmployeeIdAndConfirmedTrue(employee.getId())
                .stream()
                .distinct()
                .collect(Collectors.toList());

        System.out.println("Employé : " + employee.getFirstname());
        System.out.println("Demandes de congé confirmées : " + confirmedLeaveRequests);

      Set<LocalDate> uniqueDates = new HashSet<>();
for (LeaveRequest leaveRequest : confirmedLeaveRequests) {
    // Filtrer les dates dans l'intervalle donné (start, end)
    for (Date leaveDate : leaveRequest.getSelectedDates()) {
        // Convertir Date en LocalDate
        LocalDate localLeaveDate = leaveDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate localStart = start.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate localEnd = end.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        if (!localLeaveDate.isBefore(localStart) && !localLeaveDate.isAfter(localEnd)) {
            uniqueDates.add(localLeaveDate);  // Ajoutez seulement les dates qui sont dans l'intervalle
        }
    }
}

        int days = uniqueDates.size();
        System.out.println("Demandes de congé pour " + employee.getFirstname() + ": " + uniqueDates + " (Nombre de jours : " + days + ")");
        totalConfirmedLeaveDays += days;  // Incrémentez le nombre total de jours confirmés
    }

    System.out.println("Total des jours de congé confirmés : " + totalConfirmedLeaveDays);
    return (nbremp*12)-totalConfirmedLeaveDays;
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

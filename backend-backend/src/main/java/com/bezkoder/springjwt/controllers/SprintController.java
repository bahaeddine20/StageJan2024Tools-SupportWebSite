package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.Employee;
import com.bezkoder.springjwt.models.Sprint;
import com.bezkoder.springjwt.security.services.SprintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/sprints")
@CrossOrigin(origins = "*") // Replace * with your Angular application's origin if needed
public class SprintController {

    @Autowired
    private SprintService sprintService;


       @GetMapping("/employees/{sprintId}")
    public ResponseEntity<Set<Employee>> getEmployeesBySprint(@PathVariable int sprintId) {
        Set<Employee> employees = sprintService.getEmployeesBySprintId(sprintId);
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }


@GetMapping("/{sprintId}/congee")
public ResponseEntity<Integer> getTotalConfirmedLeaveDays(
        @PathVariable int sprintId,
        @RequestParam String start,
        @RequestParam String end) throws ParseException {

    // Update the format to match the incoming date string format
    SimpleDateFormat dateFormat = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.ENGLISH);

    Date startDate = dateFormat.parse(start.trim());
    Date endDate = dateFormat.parse(end.trim());

    int totalLeaveDays = sprintService.CoutCongee(sprintId, startDate, endDate);
    return ResponseEntity.ok(totalLeaveDays);
}



   @PostMapping("/create/{teamId}")
    public ResponseEntity<Sprint> createSprint(@PathVariable int teamId, @RequestBody Sprint sprint) {
       System.out.println(sprint);
        // Set the team ID in the sprint object before passing to the service
        Sprint newSprint = sprintService.createSprint(sprint, teamId);
        return ResponseEntity.ok(newSprint);
    }
    // Get all Sprints
  @GetMapping("/all/{teamId}")
public ResponseEntity<List<Sprint>> getAllSprints(@PathVariable int teamId) {
    List<Sprint> sprints = sprintService.getAllSprints(teamId);
    return ResponseEntity.ok(sprints);
}



    // Get a Sprint by ID
    @GetMapping("/{id}")
    public ResponseEntity<Sprint> getSprintById(@PathVariable int id) {
        Optional<Sprint> sprint = sprintService.getSprintById(id);
        return sprint.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a Sprint by ID
@PutMapping("/update/{id}")
public ResponseEntity<Sprint> updateSprint(@PathVariable int id, @RequestBody Sprint sprintDetails) {
    System.out.println(sprintDetails);
    try {
        Sprint updatedSprint = sprintService.updateSprint(id,sprintDetails);
        return ResponseEntity.ok(updatedSprint);
    } catch (RuntimeException e) {
        return ResponseEntity.notFound().build();
    }
}


    // Delete a Sprint by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSprint(@PathVariable int id) {
        try {
            sprintService.deleteSprint(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

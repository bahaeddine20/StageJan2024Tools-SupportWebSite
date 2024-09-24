package com.bezkoder.springjwt.security.services;

import com.amazonaws.services.glue.model.EntityNotFoundException;
import com.bezkoder.springjwt.models.Employee;
import com.bezkoder.springjwt.models.LeaveRequest;
import com.bezkoder.springjwt.repository.EmployeeRepository;
import com.bezkoder.springjwt.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class
LeaveRequestService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public LeaveRequest saveLeaveRequest(LeaveRequest leaveRequest) {
        return leaveRequestRepository.save(leaveRequest);
    }

    public List<LeaveRequest> getLeaveRequestsByEmployeeId(int employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }

    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    public LeaveRequest confirmLeaveRequest(int requestId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
        leaveRequest.setConfirmed(true);
        return leaveRequestRepository.save(leaveRequest);
    }
    public LeaveRequest confirmLeave(int requestId) {
        // Find the leave request by ID
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId).orElse(null);

        if (leaveRequest == null) {
            return null; // Return null if not found
        }

        // Update the confirmed status to true
        leaveRequest.setConfirmed(true);

        // Save and return the updated leave request
        return leaveRequestRepository.save(leaveRequest);
    }

    public boolean rejectLeave(int requestId) {
        // Find the leave request by ID
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId).orElse(null);

        if (leaveRequest == null) {
            return false; // Return false if not found
        }

        // Delete the leave request
        leaveRequestRepository.delete(leaveRequest);
        return true; // Return true if deletion is successful
    }
    public LeaveRequest saveSelectedDatesForEmployee(int employeeId, List<String> dates) {
        // Convertir les chaînes en objets Date avec gestion des erreurs
        List<Date> dateObjects = dates.stream()
                .map(this::convertStringToDate)
                .filter(Objects::nonNull) // Ignore les dates invalides
                .collect(Collectors.toList());

        // Récupérer l'employé ou lancer une exception s'il n'est pas trouvé
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with ID: " + employeeId));

        // Créer une nouvelle demande de congé
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setEmployee(employee);
        leaveRequest.setSelectedDates(dateObjects);

        // Sauvegarder et retourner la demande de congé
        LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);

        // Utiliser un framework de journalisation

        return savedRequest;
    }






    private Date convertStringToDate(String dateStr) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            return dateFormat.parse(dateStr);
        } catch (ParseException e) {
            throw new RuntimeException("Date parsing error", e);
        }
    }
    public List<String> getSelectedDatesForEmployee(int employeeId) {
        List<LeaveRequest> leaveRequests = leaveRequestRepository.findByEmployeeId(employeeId);
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        return leaveRequests.stream()
                .flatMap(request -> request.getSelectedDates().stream())
                .map(dateFormat::format)
                .collect(Collectors.toList());
    }
}
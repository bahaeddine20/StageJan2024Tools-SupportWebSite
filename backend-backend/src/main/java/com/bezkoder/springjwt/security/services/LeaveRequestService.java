package com.bezkoder.springjwt.security.services;

import com.bezkoder.springjwt.models.Employee;
import com.bezkoder.springjwt.models.LeaveRequest;
import com.bezkoder.springjwt.repository.EmployeeRepository;
import com.bezkoder.springjwt.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LeaveRequestService {

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

    public LeaveRequest confirmLeaveRequest(Long requestId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
        leaveRequest.setConfirmed(true);
        return leaveRequestRepository.save(leaveRequest);
    }

    public LeaveRequest saveSelectedDatesForEmployee(int employeeId, List<String> dates) {
        // Convert strings to Date objects
        List<Date> dateObjects = dates.stream()
                .map(this::convertStringToDate)
                .collect(Collectors.toList());

        // Retrieve or create leave request
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<LeaveRequest> existingRequests = leaveRequestRepository.findByEmployeeId(employeeId);
        LeaveRequest leaveRequest;
        if (!existingRequests.isEmpty()) {
            leaveRequest = existingRequests.get(0); // Assuming a single record
        } else {
            leaveRequest = new LeaveRequest();
            leaveRequest.setEmployee(employee);
        }

        leaveRequest.setSelectedDates(dateObjects);
        return leaveRequestRepository.save(leaveRequest);
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
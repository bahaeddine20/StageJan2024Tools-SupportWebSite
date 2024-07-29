package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.LeaveRequest;
import com.bezkoder.springjwt.security.services.LeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "*")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestService leaveRequestService;

    @PostMapping("/request")
    public ResponseEntity<?> requestLeave(@RequestBody LeaveRequest leaveRequest) {
        LeaveRequest savedRequest = leaveRequestService.saveLeaveRequest(leaveRequest);
        return ResponseEntity.ok(savedRequest);
    }

    @PostMapping("/confirm/{requestId}")
    public ResponseEntity<LeaveRequest> confirmLeaveRequest(@PathVariable Long requestId) {
        LeaveRequest confirmedLeaveRequest = leaveRequestService.confirmLeaveRequest(requestId);
        return ResponseEntity.ok(confirmedLeaveRequest);
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByEmployeeId(@PathVariable Long employeeId) {
        List<LeaveRequest> leaveRequests = leaveRequestService.getLeaveRequestsByEmployeeId(employeeId);
        return ResponseEntity.ok(leaveRequests);
    }

    @GetMapping("/all")
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        List<LeaveRequest> leaveRequests = leaveRequestService.getAllLeaveRequests();
        return ResponseEntity.ok(leaveRequests);
    }
}

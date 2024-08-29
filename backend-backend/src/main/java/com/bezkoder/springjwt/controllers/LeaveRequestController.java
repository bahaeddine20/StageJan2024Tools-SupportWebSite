package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.LeaveRequest;
import com.bezkoder.springjwt.security.services.LeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<LeaveRequest> confirmLeave(@PathVariable("requestId") int requestId) {
        LeaveRequest confirmedLeave = leaveRequestService.confirmLeave(requestId);
        return ResponseEntity.ok(confirmedLeave);
    }
    @PostMapping("/reject/{requestId}")
    public ResponseEntity<Void> rejectLeave(@PathVariable("requestId") int requestId) {
        boolean isDeleted = leaveRequestService.rejectLeave(requestId);
        return ResponseEntity.noContent().build(); // Return 204 if deleted successfully
    }


    @GetMapping("/{employeeId}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByEmployeeId(@PathVariable int employeeId) {
        List<LeaveRequest> leaveRequests = leaveRequestService.getLeaveRequestsByEmployeeId(employeeId);
        return ResponseEntity.ok(leaveRequests);
    }

    @GetMapping("/all")
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        List<LeaveRequest> leaveRequests = leaveRequestService.getAllLeaveRequests();
        return ResponseEntity.ok(leaveRequests);
    }
    @PostMapping("/save-selected-dates")
    public ResponseEntity<LeaveRequest> saveSelectedDatesForEmployee(@RequestBody SaveDatesRequest request) {
        LeaveRequest savedRequest = leaveRequestService.saveSelectedDatesForEmployee(request.getEmployeeId(), request.getDates());
        return ResponseEntity.ok(savedRequest);
    }

    // DTO class to handle the request payload
    public static class SaveDatesRequest {
        private int employeeId;
        private List<String> dates;

        public int getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(int employeeId) {
            this.employeeId = employeeId;
        }

        public List<String> getDates() {
            return dates;
        }

        public void setDates(List<String> dates) {
            this.dates = dates;
        }
    }
    @GetMapping("/selected-dates/{employeeId}")
    public ResponseEntity<List<String>> getSelectedDatesForEmployee(@PathVariable int employeeId) {
        List<String> selectedDates = leaveRequestService.getSelectedDatesForEmployee(employeeId);
        return ResponseEntity.ok(selectedDates);
    }
}
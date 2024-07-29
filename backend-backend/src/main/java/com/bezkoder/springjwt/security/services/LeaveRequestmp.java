package com.bezkoder.springjwt.security.services;

import com.bezkoder.springjwt.models.LeaveRequest;
import com.bezkoder.springjwt.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class LeaveRequestmp implements LeaveRequestService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Override
    public LeaveRequest saveLeaveRequest(LeaveRequest leaveRequest) {
        return leaveRequestRepository.save(leaveRequest);
    }

    @Override
    public List<LeaveRequest> getLeaveRequestsByEmployeeId(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }
    @Override
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    @Override
    public LeaveRequest confirmLeaveRequest(Long requestId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Leave request not found"));
        leaveRequest.setConfirmed(true);
        return leaveRequestRepository.save(leaveRequest);
    }

    public void saveSelectedDates(LeaveRequest dateSelection) {
        leaveRequestRepository.save(dateSelection);
    }

    public List<LeaveRequest> getSelectedDates() {
        return leaveRequestRepository.findAll();
    }
}

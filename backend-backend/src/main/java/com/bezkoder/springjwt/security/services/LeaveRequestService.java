package com.bezkoder.springjwt.security.services;

import com.bezkoder.springjwt.models.LeaveRequest;

import java.util.List;

public interface LeaveRequestService {
    LeaveRequest saveLeaveRequest(LeaveRequest leaveRequest);
    List<LeaveRequest> getLeaveRequestsByEmployeeId(Long employeeId);
    List<LeaveRequest> getAllLeaveRequests();
    LeaveRequest confirmLeaveRequest(Long requestId);

}

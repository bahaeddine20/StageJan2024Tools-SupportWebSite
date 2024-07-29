package com.bezkoder.springjwt;

import com.bezkoder.springjwt.models.LeaveRequest;

import java.util.List;
public interface LeaveRequestInt {
    LeaveRequest saveLeaveRequest(LeaveRequest leaveRequest);
    List<LeaveRequest> getLeaveRequestsByEmployeeId(Long employeeId);
    LeaveRequest confirmLeaveRequest(Long leaveRequestId);
}

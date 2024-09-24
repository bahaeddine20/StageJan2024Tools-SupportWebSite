package com.bezkoder.springjwt.repository;

import com.bezkoder.springjwt.models.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Integer> {

    List<LeaveRequest> findByEmployeeId(int employeeId);
    List<LeaveRequest> findByEmployeeIdAndConfirmedTrue(int employeeId);


}



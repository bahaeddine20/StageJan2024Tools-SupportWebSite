package com.bezkoder.springjwt.models;

import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.FutureOrPresent;
import java.util.Date;
//form submission
public class FormSubmissionDTO {
    private String name;

    @FutureOrPresent(message = "Start date cannot be in the past")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date startDate;

    @FutureOrPresent(message = "End date cannot be in the past")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date endDate;

    private String employeeEmail;
    private String adminEmail;
    private String reason;

    // Constructors
    public FormSubmissionDTO() {
    }

    public FormSubmissionDTO(String name, Date startDate, Date endDate, String employeeEmail, String adminEmail, String reason) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.employeeEmail = employeeEmail;
        this.adminEmail = adminEmail;
        this.reason = reason;
    }

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getEmployeeEmail() {
        return employeeEmail;
    }

    public void setEmployeeEmail(String employeeEmail) {
        this.employeeEmail = employeeEmail;
    }

    public String getAdminEmail() {
        return adminEmail;
    }

    public void setAdminEmail(String adminEmail) {
        this.adminEmail = adminEmail;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
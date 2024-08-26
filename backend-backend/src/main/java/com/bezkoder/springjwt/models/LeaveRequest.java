package com.bezkoder.springjwt.models;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee;

    @ElementCollection
    private List<Date> selectedDates;

    private boolean confirmed;

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public List<Date> getSelectedDates() {
        return selectedDates;
    }

    public void setSelectedDates(List<Date> selectedDates) {
        this.selectedDates = selectedDates;
    }

    public boolean isConfirmed() {
        return confirmed;
    }

    public void setConfirmed(boolean confirmed) {
        this.confirmed = confirmed;
    }
}

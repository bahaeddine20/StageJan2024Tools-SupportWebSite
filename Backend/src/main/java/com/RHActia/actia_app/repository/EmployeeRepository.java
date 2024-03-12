package com.RHActia.actia_app.repository;

import com.RHActia.actia_app.model.Employee;
import com.RHActia.actia_app.model.Gender;
import com.RHActia.actia_app.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee,Integer> {

        Employee  findByFirstname(String firstname);

        // Search by gender
        List<Employee> findByGender(Gender gender);

        // Search by birthdate range
        Employee findByEmail(String email);
        public java.lang.Iterable<Employee> findAllByTeam(Team T);


}

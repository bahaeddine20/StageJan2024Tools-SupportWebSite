package com.bezkoder.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bezkoder.springjwt.models.Employee;
import com.bezkoder.springjwt.models.Gender;
import com.bezkoder.springjwt.models.Team;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee,Integer> {

        Employee  findByFirstname(String firstname);

        // Search by gender
        List<Employee> findByGender(Gender gender);

        // Search by date range
        Employee findByEmail(String email);
        public java.lang.Iterable<Employee> findAllByTeam(Team T);

		Employee getById(int id);


}

package com.bezkoder.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bezkoder.springjwt.models.Employee;
import com.bezkoder.springjwt.models.Gender;
import com.bezkoder.springjwt.models.Team;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee,Integer> {

        Employee  findByFirstname(String firstname);

        // Search by gender
        List<Employee> findByGender(Gender gender);

        // Search by date range

        public java.lang.Iterable<Employee> findAllByTeam(Team T);

		Employee getById(int id);

        Optional<Employee> findByEmail(String email);
}

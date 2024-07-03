package com.bezkoder.springjwt.security.services;

import com.bezkoder.springjwt.models.Team;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.bezkoder.springjwt.models.Employee;
import com.bezkoder.springjwt.models.Gender;
import com.bezkoder.springjwt.repository.EmployeeRepository;
import com.bezkoder.springjwt.repository.TeamRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmployeeService {
    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);

    @Autowired
    private EmployeeRepository ER;
    @Autowired
    TeamRepository TR;

    public Employee addEmployee(Employee employee) throws IOException {
        logger.info("Attempting to add new employee: {}", employee.getEmail());
        if (employeeExists(employee.getEmail())) {
            logger.warn("Attempt to add duplicate employee: {}", employee.getEmail());
            throw new IllegalArgumentException("Employee already exists");
        }
        Employee savedEmployee = ER.save(employee);
        logger.info("Employee added successfully with ID: {}", savedEmployee.getId());
        return savedEmployee;
    }

    public boolean employeeExists(String email) {
        return ER.findByEmail(email).isPresent();
    }


    public List<Employee> getAllEmployees(){
        List<Employee> employees = new ArrayList<>();
        ER.findAll().forEach(employees::add);
        logger.info("Retrieved all employees, total count: {}", employees.size());
        return employees;
    }

    public Employee getEmployeeByID(int id) {
        logger.debug("Fetching employee by ID: {}", id);
        return ER.findById(id).orElse(null);
    }

    public Employee getEmployeeByName(String firstname) {
        logger.debug("Fetching employee by name: {}", firstname);
        return ER.findByFirstname(firstname);
    }

    public List<Employee> getEmployeesByGender(Gender gender) {
        List<Employee> employees = ER.findByGender(gender);
        logger.info("Found {} employees with gender {}", employees.size(), gender);
        return employees;
    }

    public Employee updateEmployee(Employee employee) {
        logger.info("Updating employee ID: {}", employee.getId());
        Optional<Employee> existingEMPOpt = ER.findById(employee.getId());

        if (!existingEMPOpt.isPresent()) {
            logger.error("Employee not found with ID: {}", employee.getId());
            throw new IllegalArgumentException("Employee not found with ID: " + employee.getId());
        }

        Employee existingEMP = existingEMPOpt.get();
        existingEMP.setFirstname(employee.getFirstname());
        existingEMP.setLastname(employee.getLastname());
        existingEMP.setEmail(employee.getEmail());
        existingEMP.setGender(employee.getGender());
        existingEMP.setPhone(employee.getPhone());
        existingEMP.setLinkedin(employee.getLinkedin());
        existingEMP.setRole(employee.getRole());

        if (employee.getEmployeeImages() != null && !employee.getEmployeeImages().isEmpty()) {
            existingEMP.setEmployeeImages(employee.getEmployeeImages());
        }

        Employee updatedEmployee = ER.save(existingEMP);
        logger.info("Employee updated successfully: {}", updatedEmployee.getId());
        return updatedEmployee;
    }
    public Employee updateEmployeeTeam(int employeeId, int newTeamId) {
        logger.info("Updating team for employee ID: {}", employeeId);
        Optional<Employee> employeeOpt = ER.findById(employeeId);
        Optional<Team> teamOpt = TR.findById(newTeamId);

        if (!employeeOpt.isPresent()) {
            logger.error("Employee not found with ID: {}", employeeId);
            throw new IllegalArgumentException("Employee not found with ID: " + employeeId);
        }

        if (!teamOpt.isPresent()) {
            logger.error("Team not found with ID: {}", newTeamId);
            throw new IllegalArgumentException("Team not found with ID: " + newTeamId);
        }

        Employee employee = employeeOpt.get();
        Team newTeam = teamOpt.get();
        employee.setTeam(newTeam);

        Employee updatedEmployee = ER.save(employee);
        logger.info("Employee updated successfully: {}", updatedEmployee.getId());
        return updatedEmployee;
    }
    public List<Employee> addAllEmployees(List<Employee> employees) {
        List<Employee> newEmployees = new ArrayList<>();
        for (Employee employee : employees) {
            if (!employeeExists(employee.getEmail())) {
                newEmployees.add(employee);
            }
        }
        List<Employee> addedEmployees = ER.saveAll(newEmployees);
        logger.info("Added multiple employees, count: {}", addedEmployees.size());
        return addedEmployees;
    }

    public boolean deleteEmployeeByID(int id) {
        logger.info("Deleting employee with ID: {}", id);
        Employee existingEMP = ER.getById(id);
        if (existingEMP != null) {
            ER.deleteById(id);
            logger.info("Employee deleted successfully.");
            return true;
        }
        logger.error("Failed to delete, employee not found with ID: {}", id);
        return false;
    }

    public List<Employee> getAllEmployeesByTeam(int idteam) {
        List<Employee> employees = new ArrayList<>();
        ER.findAllByTeam(TR.findById(idteam).get()).forEach(employees::add);
        logger.info("Found {} employees in team ID {}", employees.size(), idteam);
        return employees;
    }

    public String uploadImage(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(fileName);
        Files.copy(file.getInputStream(), filePath);
        logger.info("Uploaded image for filename: {}", fileName);
        return fileName;
    }

    public Long countEmployees() {
        long count = ER.count();
        logger.info("Total number of employees: {}", count);
        return count;
    }
    public boolean checkEmailExists(String email) {
        Optional<Employee> employee = ER.findByEmail(email);
        return employee.isPresent();
    }
}





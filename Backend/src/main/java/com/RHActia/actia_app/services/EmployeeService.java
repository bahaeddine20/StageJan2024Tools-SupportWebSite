package com.RHActia.actia_app.services;

import com.RHActia.actia_app.model.Employee;
import com.RHActia.actia_app.model.Gender;
import com.RHActia.actia_app.repository.EmployeeRepository;
import com.RHActia.actia_app.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Service

public class EmployeeService {
    @Autowired
    private EmployeeRepository ER;
    @Autowired
    TeamRepository TR;
    public Employee addEmployee(Employee employee) throws IOException {
        if (employeeExists(employee.getEmail())) {
            throw new IllegalArgumentException("Employee already exists");
        }

        return ER.save(employee);
    }


    public boolean employeeExists(String email) {
        Employee existingEmployee = ER.findByEmail(email);
        return existingEmployee != null;
    }

    public List<Employee> getAllEmployees(){
        List<Employee> Employee = new ArrayList<Employee>();
        ER.findAll().forEach(e -> Employee.add(e));
        return Employee;
    }
    public Employee getEmployeeByID(int id) {
        return ER.findById(id).orElse(null);

    }
    public Employee getEmployeeByName(String firstname) {
        return ER.findByFirstname(firstname);
    }
    public List<Employee> getEmployeesByGender(Gender gender) {
        return ER.findByGender(gender);
    }
    public Employee updateEmployee(Employee employee) {
        Employee existingEMP = ER.findById(employee.getId()).orElse(null);
        if(existingEMP == null) {
            throw new IllegalArgumentException("Employee not found with ID: " + employee.getId());
        } else {
            existingEMP.setFirstname(employee.getFirstname());
            existingEMP.setLastname(employee.getLastname());
            existingEMP.setEmail(employee.getEmail());
            existingEMP.setGender(employee.getGender());
            existingEMP.setEmployeeImages(employee.getEmployeeImages());
            return ER.save(existingEMP);
        }
    }

    public List<Employee> addAllEmployees(List<Employee> employees) {
        List<Employee> newEmployees = new ArrayList<>();
        for (Employee employee : employees) {
            if (!employeeExists(employee.getEmail())) {
                newEmployees.add(employee);
            }
        }
        return ER.saveAll(newEmployees);
    }

    public boolean deleteEmployeeByID(int id) {
        Employee existingEMP = ER.getById(id);
        if (existingEMP != null){
            ER.deleteById(id);
            return true;
        }
        return false;

    }
    public List<Employee> getAllEmployeesByTeam (int idteam){
        List<Employee> Employees = new ArrayList<Employee>();
        ER.findAllByTeam(TR.findById(idteam).get()).forEach(f -> Employees.add(f));
        return Employees;
    }
    public String uploadImage(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(fileName);
        Files.copy(file.getInputStream(), filePath);
        return fileName; // Retourne uniquement le nom du fichier téléchargé
    }
}
package com.RHActia.actia_app.services;
import com.RHActia.actia_app.model.Team;
import org.junit.Assert;
import org.junit.Before;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.util.ReflectionTestUtils;


import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.RHActia.actia_app.model.Employee;
import com.RHActia.actia_app.model.Gender;
import com.RHActia.actia_app.repository.EmployeeRepository;
import com.RHActia.actia_app.repository.TeamRepository;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private TeamRepository teamRepository;

    @InjectMocks
    private EmployeeService employeeService;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testAddEmployee() {
        Employee employee = new Employee();
        employee.setEmail("test@example.com");
        when(employeeRepository.findByEmail("test@example.com")).thenReturn(null);
        when(employeeRepository.save(employee)).thenReturn(employee);
        try {
            Employee savedEmployee = employeeService.addEmployee(employee);
            assertNotNull(savedEmployee);
            assertEquals("test@example.com", savedEmployee.getEmail());
        } catch (IOException e) {
            fail("IOException occurred");
        }
    }

    @Test
    public void testEmployeeExists() {
        String email = "test@example.com";
        when(employeeRepository.findByEmail(email)).thenReturn(new Employee());
        boolean exists = employeeService.employeeExists(email);
        assertTrue(exists);
    }

    @Test
    public void testGetAllEmployees() {
        List<Employee> employees = new ArrayList<>();
        employees.add(new Employee());
        employees.add(new Employee());
        when(employeeRepository.findAll()).thenReturn(employees);
        List<Employee> allEmployees = employeeService.getAllEmployees();
        assertEquals(2, allEmployees.size());
    }

    @Test
    public void testGetEmployeeByID() {
        int id = 1;
        Employee employee = new Employee();
        employee.setId(id);
        when(employeeRepository.findById(id)).thenReturn(Optional.of(employee));
        Employee retrievedEmployee = employeeService.getEmployeeByID(id);
        assertNotNull(retrievedEmployee);
        assertEquals(id, retrievedEmployee.getId());
    }

    @Test
    public void testGetEmployeeByName() {
        String firstname = "John";
        Employee employee = new Employee();
        employee.setFirstname(firstname);
        when(employeeRepository.findByFirstname(firstname)).thenReturn(employee);
        Employee retrievedEmployee = employeeService.getEmployeeByName(firstname);
        assertNotNull(retrievedEmployee);
        assertEquals(firstname, retrievedEmployee.getFirstname());
    }

    @Test
    public void testGetEmployeesByGender() {
        Gender gender = Gender.male;
        List<Employee> employees = new ArrayList<>();
        employees.add(new Employee());
        employees.add(new Employee());
        when(employeeRepository.findByGender(gender)).thenReturn(employees);
        List<Employee> retrievedEmployees = employeeService.getEmployeesByGender(gender);
        assertEquals(2, retrievedEmployees.size());
    }

    @Test
    public void testUpdateEmployee() {
        Employee employee = new Employee();
        employee.setId(1);
        when(employeeRepository.findById(employee.getId())).thenReturn(Optional.of(employee));
        when(employeeRepository.save(employee)).thenReturn(employee);
        Employee updatedEmployee = employeeService.updateEmployee(employee);
        assertNotNull(updatedEmployee);
        assertEquals(1, updatedEmployee.getId());
    }

    @Test
    public void testAddAllEmployees() {
        List<Employee> employees = new ArrayList<>();
        employees.add(new Employee());
        employees.add(new Employee());
        when(employeeRepository.saveAll(employees)).thenReturn(employees);
        List<Employee> savedEmployees = employeeService.addAllEmployees(employees);
        assertEquals(2, savedEmployees.size());
    }

    @Test
    public void testDeleteEmployeeByID() {
        int id = 1;
        Employee employee = new Employee();
        employee.setId(id);
        when(employeeRepository.getById(id)).thenReturn(employee);
        boolean deleted = employeeService.deleteEmployeeByID(id);
        assertTrue(deleted);
        verify(employeeRepository, times(1)).deleteById(id);
    }

    @Test
    public void testGetAllEmployeesByTeam() {
        int teamId = 1;
        List<Employee> employees = new ArrayList<>();
        employees.add(new Employee());
        employees.add(new Employee());
        when(teamRepository.findById(teamId)).thenReturn(Optional.of(new Team()));
        when(employeeRepository.findAllByTeam(any(Team.class))).thenReturn(employees);
        List<Employee> retrievedEmployees = employeeService.getAllEmployeesByTeam(teamId);
        assertEquals(2, retrievedEmployees.size());
    }

//    @Test
//    public void testUploadImage() {
//        MultipartFile file = mock(MultipartFile.class);
//        String fileName = "example.jpg";
//        try {
//            when(file.getOriginalFilename()).thenReturn(fileName);
//            String uploadedFileName = employeeService.uploadImage(file);
//            assertNotNull(uploadedFileName);
//            assertTrue(uploadedFileName.startsWith(fileName.split("\\.")[0])); // Check if returned filename starts with the original filename
//        } catch (IOException e) {
//            fail("IOException occurred");
//        }
//    }
}

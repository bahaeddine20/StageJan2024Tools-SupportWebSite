package com.bezkoder.springjwt.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.bezkoder.springjwt.models.Team;
import com.bezkoder.springjwt.security.services.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import com.bezkoder.springjwt.models.Employee;
import com.bezkoder.springjwt.models.Gender;
import com.bezkoder.springjwt.repository.EmployeeRepository;
import com.bezkoder.springjwt.repository.TeamRepository;

class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private TeamRepository teamRepository;

    @InjectMocks
    private EmployeeService employeeService;

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddEmployee() throws IOException {
        Employee employee = new Employee();
        employee.setEmail("test@example.com");

        when(employeeRepository.findByEmail("test@example.com")).thenReturn(null);
        when(employeeRepository.save(any(Employee.class))).thenReturn(employee);

        Employee savedEmployee = employeeService.addEmployee(employee);

        assertNotNull(savedEmployee);
        assertEquals("test@example.com", savedEmployee.getEmail());

        verify(employeeRepository, times(1)).findByEmail("test@example.com");
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    @Test
    void testAddEmployeeAlreadyExists() {
        Employee employee = new Employee();
        employee.setEmail("test@example.com");

        when(employeeRepository.findByEmail("test@example.com")).thenReturn(employee);

        assertThrows(IllegalArgumentException.class, () -> {
            employeeService.addEmployee(employee);
        });

        verify(employeeRepository, times(1)).findByEmail("test@example.com");
        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    void testGetAllEmployees() {
        List<Employee> employees = new ArrayList<>();
        employees.add(new Employee());
        employees.add(new Employee());

        when(employeeRepository.findAll()).thenReturn(employees);

        List<Employee> retrievedEmployees = employeeService.getAllEmployees();

        assertEquals(2, retrievedEmployees.size());

        verify(employeeRepository, times(1)).findAll();
    }

    @Test
    void testGetEmployeeByID() {
        Employee employee = new Employee();
        employee.setId(1);

        when(employeeRepository.findById(1)).thenReturn(Optional.of(employee));

        Employee retrievedEmployee = employeeService.getEmployeeByID(1);

        assertNotNull(retrievedEmployee);
        assertEquals(1, retrievedEmployee.getId());

        verify(employeeRepository, times(1)).findById(1);
    }

    @Test
    void testGetEmployeeByName() {
        Employee employee = new Employee();
        employee.setFirstname("John");

        when(employeeRepository.findByFirstname("John")).thenReturn(employee);

        Employee retrievedEmployee = employeeService.getEmployeeByName("John");

        assertNotNull(retrievedEmployee);
        assertEquals("John", retrievedEmployee.getFirstname());

        verify(employeeRepository, times(1)).findByFirstname("John");
    }

    @Test
    void testGetEmployeesByGender() {
        List<Employee> employees = new ArrayList<>();
        employees.add(new Employee());
        employees.add(new Employee());

        when(employeeRepository.findByGender(Gender.male)).thenReturn(employees);

        List<Employee> retrievedEmployees = employeeService.getEmployeesByGender(Gender.male);

        assertEquals(2, retrievedEmployees.size());

        verify(employeeRepository, times(1)).findByGender(Gender.male);
    }

    @Test
    void testUpdateEmployee() {
        Employee employee = new Employee();
        employee.setId(1);
        employee.setEmail("test@example.com");

        when(employeeRepository.findById(1)).thenReturn(Optional.of(employee));
        when(employeeRepository.save(any(Employee.class))).thenReturn(employee);

        Employee updatedEmployee = new Employee();
        updatedEmployee.setId(1);
        updatedEmployee.setEmail("updated@example.com");

        Employee result = employeeService.updateEmployee(updatedEmployee);

        assertNotNull(result);
        assertEquals("updated@example.com", result.getEmail());

        verify(employeeRepository, times(1)).findById(1);
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    @Test
    void testDeleteEmployeeByID() {
        Employee employee = new Employee();
        employee.setId(1);

        when(employeeRepository.getById(1)).thenReturn(employee);

        boolean result = employeeService.deleteEmployeeByID(1);

        assertTrue(result);

        verify(employeeRepository, times(1)).getById(1);
        verify(employeeRepository, times(1)).deleteById(1);
    }

    @Test
    void testDeleteEmployeeByIDNotFound() {
        when(employeeRepository.getById(1)).thenReturn(null);

        boolean result = employeeService.deleteEmployeeByID(1);

        assertFalse(result);

        verify(employeeRepository, times(1)).getById(1);
        verify(employeeRepository, never()).deleteById(anyInt());
    }

    @Test
    void testGetAllEmployeesByTeam() {
        List<Employee> employees = new ArrayList<>();
        employees.add(new Employee());
        employees.add(new Employee());

        when(teamRepository.findById(1)).thenReturn(Optional.of(new Team()));
        when(employeeRepository.findAllByTeam(any(Team.class))).thenReturn(employees);

        List<Employee> retrievedEmployees = employeeService.getAllEmployeesByTeam(1);

        assertEquals(2, retrievedEmployees.size());

        verify(teamRepository, times(1)).findById(1);
        verify(employeeRepository, times(1)).findAllByTeam(any(Team.class));
    }

    // Test for uploadImage method can be added similarly
}

package com.RHActia.actia_app.controller;

import com.RHActia.actia_app.model.Employee;
import com.RHActia.actia_app.model.Gender;
import com.RHActia.actia_app.model.ImageModel;
import com.RHActia.actia_app.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/emp")
@CrossOrigin(origins = "*") // Add the origin of your Angular application
public class EmployeeController {

    @Autowired
    private EmployeeService ES;

    // Get all employees
    @GetMapping("/getAllEmployees")
    private List<Employee> getAllEmployees() {
        return ES.getAllEmployees();
    }
    @GetMapping("/getEmployeeByID/{id}")
    private Employee getEmployeeById(@PathVariable("id") int id) {
        return ES.getEmployeeByID(id);
    }
    // Delete employee
    @DeleteMapping("/deleteEmployeeById/{id}")
    public boolean deleteEmployeeByID(@PathVariable("id") int id) {
        return ES.deleteEmployeeByID(id);
    }
    // add new employee
    @PostMapping("/addEmployee")
    public Employee addEmployee(@RequestPart("employee") Employee employee,
                                @RequestPart("imagePath") MultipartFile[] files) {
        try {
            Set<ImageModel> images = uploadImage(files); // Convertir le tableau en liste
            employee.setEmployeeImages(images);

            System.out.println(files.length);
            return ES.addEmployee(employee);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    // add more than 1 employee
    @PostMapping("/addEmployees")
    public List<Employee> addAllEmployee(@RequestBody List<Employee> employees) {
        return ES.addAllEmployees(employees);
    }
    // Get employee by Id


    // Get employee by name
    @GetMapping("/getEmployeeByName/{firstname}")
    public Employee getEmployeeByName(@PathVariable String firstname) {
        return ES.getEmployeeByName(firstname);
    }

    @GetMapping("/searchByGender/{gender}")
    public List<Employee> searchByGender(@PathVariable Gender gender) {
        return ES.getEmployeesByGender(gender);
    }

    // Update Employee
    @PutMapping("/updateEmployee/{id}")
    public Employee updateEmployee(@PathVariable int id,
                                   @RequestPart("employee") Employee employee,
                                   @RequestPart("imagePath") MultipartFile[] files) {
        try {
            Set<ImageModel> images = uploadImage(files); // Convertir le tableau en liste
            employee.setEmployeeImages(images);
            employee.setId(id);
            return ES.updateEmployee(employee);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    public Set<ImageModel> uploadImage(MultipartFile[] multipartFiles) throws IOException {
        Set<ImageModel> imageModels = new HashSet<ImageModel>();

        for (MultipartFile file : multipartFiles) {
            ImageModel imageModel = new ImageModel(file.getOriginalFilename(), file.getContentType(), file.getBytes());
            imageModels.add(imageModel);
        }
        return imageModels;
    }

    @GetMapping("/EmployeeByIdTeam/{idteam}")
    private List<Employee> getAllEmployeesByIdTeam(@PathVariable("idteam") int idteam)
    {
        return ES.getAllEmployeesByTeam(idteam);
    }
    @PostMapping("/uploadImage")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile  file) {
        try {
            String imageUrl = ES.uploadImage(file);
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
        }
    }
}

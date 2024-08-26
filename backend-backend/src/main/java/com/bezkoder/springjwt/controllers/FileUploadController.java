package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.security.services.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/files")
public class FileUploadController {

    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping("/upload/excel")
    public ResponseEntity<Map<String, Object>> uploadExcelFile(@RequestParam("file") MultipartFile file) {
        return uploadFile(file, "excel/");
    }

    @PostMapping("/upload/carry")
    public ResponseEntity<Map<String, Object>> uploadCarryFile(@RequestParam("file") MultipartFile file) {
        return uploadFile(file, "carry/");
    }

    @PostMapping("/upload/velocity")
    public ResponseEntity<Map<String, Object>> uploadVelocityFile(@RequestParam("file") MultipartFile file) {
        return uploadFile(file, "velocity/");
    }

    private ResponseEntity<Map<String, Object>> uploadFile(MultipartFile file, String directory) {
        try {
            // Upload file using the service
            String keyName = file.getOriginalFilename();
            String fileUrl = fileUploadService.uploadFile(file, directory + keyName);

            // Construct response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "File uploaded successfully");
            response.put("fileUrl", fileUrl);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}

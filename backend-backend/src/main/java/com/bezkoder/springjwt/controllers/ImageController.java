package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.security.services.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class ImageController {

    private final S3Service s3Service;

    @Autowired
    public ImageController(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @GetMapping("/list")
    public ResponseEntity<List<String>> listImages() {
        List<String> imageUrls = s3Service.listObjects();
        return ResponseEntity.ok().body(imageUrls);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            s3Service.uploadFile(file);
            return ResponseEntity.ok().body("Image uploaded successfully: " + file.getOriginalFilename());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload image: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{fileName}")
    public ResponseEntity<String> deleteImage(@PathVariable String fileName) {
        try {
            s3Service.deleteFile(fileName);
            return ResponseEntity.ok().body("Image deleted successfully: " + fileName);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete image: " + e.getMessage());
        }
    }
}

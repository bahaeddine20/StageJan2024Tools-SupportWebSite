package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.ImageHome;
import com.bezkoder.springjwt.security.services.ImageHomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class ImageHomeController {
    @Autowired

    private ImageHomeService imageHomeService;

    @PostMapping("/api/images/uploadHome")
    public ResponseEntity<ImageHome> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Création d'une nouvelle image avec les données du fichier
        ImageHome img = new ImageHome(file.getOriginalFilename(), file.getContentType(), file.getBytes());

        // Sauvegarde de l'image via le service
        ImageHome savedImage = imageHomeService.saveImage(img);

        // Retour de la réponse avec l'image sauvegardée
        return new ResponseEntity<>(savedImage, HttpStatus.OK);
    }


    @GetMapping("/getall")
    public List<ImageHome> getAllImages() {
        return imageHomeService.getAllImages();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        imageHomeService.deleteImage(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }


    // Récupérer une image par ID
    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImageById(@PathVariable Long id) {
        Optional<ImageHome> img = imageHomeService.getImageById(id);
        if (img.isPresent()) {
            ImageHome image = img.get();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(image.getType()));
            return new ResponseEntity<>(image.getPicByte(), headers, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }



}

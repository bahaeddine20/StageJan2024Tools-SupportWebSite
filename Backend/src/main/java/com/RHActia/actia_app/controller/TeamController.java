package com.RHActia.actia_app.controller;

import com.RHActia.actia_app.model.Employee;
import com.RHActia.actia_app.model.ImageModel;
import com.RHActia.actia_app.model.Team;
import com.RHActia.actia_app.services.TeamService;
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
@RequestMapping("/team")
@CrossOrigin(origins = "*")
public class TeamController {
        //autowire the ArticleService class
        @Autowired
        TeamService TS;
        //creating a get mapping that retrieves all the Article detail from the database
        @GetMapping("/getAllTeams")
        private List<Team> getAllTeams()
        {
            return TS.getAllTeams();
        }

        //creating a get mapping that retrieves the detail of a specific article
        @GetMapping("/getTeamById/{id}")
        private Team getTeamById(@PathVariable("id") int id)
        {
            return TS.getTeamById(id);
        }

        //creating a delete mapping that deletes a specified article
        @DeleteMapping("/deleteTeamById/{id}")
        private void deleteTeamById(@PathVariable("id") int id)
        {
            TS.delete(id);
        }

        //create new article
        @PostMapping("/addTeam")
        public Team addTeam(@RequestPart("team") Team team,
                                    @RequestPart("imagePath") MultipartFile[] files) {
            try {
                Set<ImageModel> images = uploadImage(files); // Convertir le tableau en liste
                team.setTeamImages(images);

                System.out.println(files.length);
                return TS.addTeam(team);
            } catch (Exception t) {
                System.out.println(t.getMessage());
                return null;
            }
        }

    @PutMapping("/updateTeam/{id}")
    public Team updateTeam(@PathVariable int id,
                                   @RequestPart("team") Team team,
                                   @RequestPart("imagePath") MultipartFile[] files) {
        try {
            Set<ImageModel> images = uploadImage(files); // Convertir le tableau en liste
            team.setTeamImages(images);
            team.setId(id);
            return TS.updateTeam(team);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    public Set<ImageModel> uploadImage(MultipartFile[] multipartFiles) throws IOException {
        Set<ImageModel> imageModels = new HashSet<ImageModel>();

        for (MultipartFile file : multipartFiles) {
            if (file.isEmpty()) {
                continue;
            }
            try {
                ImageModel imageModel = new ImageModel(file.getOriginalFilename(), file.getContentType(), file.getBytes());
                imageModels.add(imageModel);
            } catch (IOException e) {
                // Log the error or handle it as needed
                System.err.println("Failed to read bytes from file: " + file.getOriginalFilename());
            }
        }

        return imageModels;
    }

}

package com.RHActia.actia_app.Services;


import com.RHActia.actia_app.model.Team;
import com.RHActia.actia_app.repository.TeamRepository;
import com.RHActia.actia_app.services.TeamService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TeamServiceTest {

    @InjectMocks
    private TeamService teamService;

    @Mock
    private TeamRepository teamRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testGetAllTeams() {
        List<Team> teams = new ArrayList<>();
        teams.add(new Team());
        when(teamRepository.findAll()).thenReturn(teams);
        assertEquals(teams, teamService.getAllTeams());
    }

    @Test
    void testGetTeamById() {
        Team team = new Team();
        when(teamRepository.findById(1)).thenReturn(Optional.of(team));
        assertEquals(team, teamService.getTeamById(1));
    }

    @Test
    void testAddTeam() throws IOException {
        Team team = new Team();
        team.setName("Test Team");
        when(teamRepository.findByName("Test Team")).thenReturn(Optional.empty());
        when(teamRepository.save(team)).thenReturn(team);
        assertEquals(team, teamService.addTeam(team));
    }

    @Test
    void testTeamExists() {
        when(teamRepository.findByName("Test Team")).thenReturn(Optional.empty());
        assertFalse(teamService.teamExists("Test Team"));
    }

    @Test
    void testUpdateTeam() {
        Team existingTeam = new Team();
        existingTeam.setId(1);
        existingTeam.setName("Existing Team");
        when(teamRepository.findById(1)).thenReturn(Optional.of(existingTeam));

        Team updatedTeam = new Team();
        updatedTeam.setId(1);
        updatedTeam.setName("Updated Team");
        updatedTeam.setDescription("Updated Description");

        when(teamRepository.save(existingTeam)).thenReturn(updatedTeam);

        assertEquals(updatedTeam, teamService.updateTeam(updatedTeam));
    }

    @Test
    void testDelete() {
        teamService.delete(1);
        verify(teamRepository, times(1)).deleteById(1);
    }

//    @Test
//    void testUploadImage() throws IOException {
//        MultipartFile file = mock(MultipartFile.class);
//        when(file.getOriginalFilename()).thenReturn("test.jpg");
//
//        String fileName = teamService.uploadImage(file);
//        assertNotNull(fileName);
//        assertTrue(fileName.endsWith(".jpg"));
//    }
}

package com.RHActia.actia_app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table
public class Team {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        private int id;

        @Column(name = "name")
        private String name;

        @Column(name = "description")
        private String description;

        @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
        @JoinTable(name = "team_image",
                joinColumns = @JoinColumn(name = "team_id"),
                inverseJoinColumns = @JoinColumn(name = "image_id"))
        private Set<ImageModel> teamImages;

        @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<Employee> employees;

    public Team(int id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<ImageModel> getTeamImages() {
        return teamImages;
    }

    public void setTeamImages(Set<ImageModel> teamImages) {
        this.teamImages = teamImages;
    }

}
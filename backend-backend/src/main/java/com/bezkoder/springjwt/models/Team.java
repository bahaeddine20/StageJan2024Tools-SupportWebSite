package com.bezkoder.springjwt.models;



import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Size;


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
        @Size(max = 1000)
        private String description;
        @Column(name = "technologie")
        private String technologie;

        @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
        @JoinTable(name = "team_image",
                joinColumns = @JoinColumn(name = "team_id"),
                inverseJoinColumns = @JoinColumn(name = "image_id"))
        private Set<ImageModel> teamImages;

        @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore  // Ignore during serialization
        private Set<Employee> employees = new HashSet<>();
    public Team(int id, String name, String description, String technologie) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.technologie = technologie; // Assurez-vous que la variable est initialisée
    }

    public Team() {
        }
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

    public String getTechnologie() {
        return technologie;
    }

    public void setTechnologie(String technologie) {
        this.technologie = technologie;
    }

    public Set<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(Set<Employee> employees) {
        this.employees = employees;
    }
}
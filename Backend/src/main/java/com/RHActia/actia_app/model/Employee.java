package com.RHActia.actia_app.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;


@Getter
@Setter
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String firstname;
    private String lastname;
    private String email;
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "employee_images",
            joinColumns = {
                    @JoinColumn(name = "id")
            },
            inverseJoinColumns = {
                    @JoinColumn(name = "image_id")
            }
    )
    private Set<ImageModel> employeeImages;
    @ManyToOne(optional = false) // Champ obligatoire
    @JoinColumn(name = "idteam", referencedColumnName = "id")
    private Team team;
    public Set<ImageModel> getEmployeeImages() {
        return employeeImages;
    }

    public void setEmployeeImages(Set<ImageModel> employeeImages) {
        this.employeeImages = employeeImages;
    }


 }
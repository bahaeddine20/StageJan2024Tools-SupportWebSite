package com.bezkoder.springjwt.models;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table
@Getter
@Setter
@RequiredArgsConstructor
public class Sprint {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        private int id;

         @Column(name = "name")
        private String name ;

         @Column(name = "description")
        private String description ;
        @Column(name = "date_Debut")
        private Date date_Debut ;

        @Column(name = "date_Fin")
        private Date date_Fin ;


        @ManyToOne
        private  Team team;

    @Override
    public String toString() {
        return this.name;
    }

    @Override
    public boolean equals(Object obj) {
        return super.equals(obj);
    }




}

package com.bezkoder.springjwt.models;

import javax.persistence.*;
import java.util.Arrays;

@Entity
@Table(name = "imagehome")
public class ImageHome {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String nom;

    private String type;

    @Column(length = 50000000)
    private byte[] picByte;

    public ImageHome() {
        super();
    }

    public ImageHome(String nom, String type, byte[] picByte) {
        super();
        this.nom = nom;
        this.type = type;
        this.picByte = picByte;
    }

    // Getters and setters

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public byte[] getPicByte() {
        return picByte;
    }

    public void setPicByte(byte[] picByte) {
        this.picByte = picByte;
    }

    @Override
    public String toString() {
        return "ImageModel [id=" + id + ", nom=" + nom + ", type=" + type + ", picByte=" + Arrays.toString(picByte) + "]";
    }
}

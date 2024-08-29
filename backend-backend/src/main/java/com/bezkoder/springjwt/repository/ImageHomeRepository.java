package com.bezkoder.springjwt.repository;

import com.bezkoder.springjwt.models.ImageHome;
import com.bezkoder.springjwt.models.ImageModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageHomeRepository extends JpaRepository<ImageHome, Long> {
}

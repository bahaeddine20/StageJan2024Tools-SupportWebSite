package com.bezkoder.springjwt.repository;

import com.bezkoder.springjwt.models.Request;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {
    Request getById(long id);
    @Transactional
    void deleteByIdIn(List<Long> ids);

    List<Request> findByStatus(String status);
}

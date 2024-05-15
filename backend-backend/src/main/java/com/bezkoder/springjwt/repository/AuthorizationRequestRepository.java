package com.bezkoder.springjwt.repository;
import com.bezkoder.springjwt.models.AuthorizationRequest;
import com.bezkoder.springjwt.models.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthorizationRequestRepository extends JpaRepository<AuthorizationRequest, Long> {
    Optional<AuthorizationRequest> findById(Long id);
    @Transactional
    @Modifying
    @Query("DELETE FROM AuthorizationRequest ar WHERE ar.id IN :ids")
    void deleteAllauthById(@Param("ids") List<Long> ids);
    @Transactional
    void deleteByIdIn(List<Long> ids);
}

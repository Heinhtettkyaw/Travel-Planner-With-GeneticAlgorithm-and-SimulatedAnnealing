package com.example.auth.repository;

import com.example.auth.model.Trip;
import com.example.auth.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUserOrderByCreatedAtDesc(User user);
    // Updated to support pagination:
    Page<Trip> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Trip> findByUser_UsernameContainingIgnoreCaseOrCity_NameContainingIgnoreCase(String username, String cityName, Pageable pageable);
}

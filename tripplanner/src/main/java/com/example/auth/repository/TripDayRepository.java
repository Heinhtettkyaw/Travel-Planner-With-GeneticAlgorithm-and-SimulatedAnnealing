package com.example.auth.repository;

import com.example.auth.model.TripDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripDayRepository extends JpaRepository<TripDay, Long> {
}

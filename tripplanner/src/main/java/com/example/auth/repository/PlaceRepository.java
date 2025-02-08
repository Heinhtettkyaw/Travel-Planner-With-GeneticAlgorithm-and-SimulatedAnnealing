package com.example.auth.repository;

import com.example.auth.model.Place;
import com.example.auth.model.City;
import com.example.auth.model.PlaceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
    List<Place> findByCityAndCategory(City city, PlaceCategory category);
    List<Place> findByCity(City city);
}

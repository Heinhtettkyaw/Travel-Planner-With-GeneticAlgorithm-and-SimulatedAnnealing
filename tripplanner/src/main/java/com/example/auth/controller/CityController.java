package com.example.auth.controller;

import com.example.auth.model.City;
import com.example.auth.model.Place;
import com.example.auth.model.PlaceCategory;
import com.example.auth.repository.CityRepository;
import com.example.auth.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CityController {

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private PlaceRepository placeRepository;

    @GetMapping("/cities")
    public List<City> getAllCities() {
        return cityRepository.findAll();
    }
    @GetMapping("/cities/{id}")
    public ResponseEntity<City> getCityById(@PathVariable Long id) {
        City city = cityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("City not found"));
        return ResponseEntity.ok(city);
    }

    // Example: GET /api/places?cityId=1&category=HOTEL
    @GetMapping("/places")
    public List<Place> getPlacesByCityAndCategory(@RequestParam Long cityId,
                                                  @RequestParam(required = false) PlaceCategory category) {
        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new RuntimeException("City not found"));
        if (category != null) {
            return placeRepository.findByCityAndCategory(city, category);
        } else {
            return placeRepository.findByCity(city);
        }
    }
}

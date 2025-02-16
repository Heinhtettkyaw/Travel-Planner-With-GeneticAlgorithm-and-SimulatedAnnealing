package com.example.auth.controller;

import com.example.auth.model.City;
import com.example.auth.model.Place;
import com.example.auth.model.Trip;
import com.example.auth.repository.CityRepository;
import com.example.auth.repository.PlaceRepository;
import com.example.auth.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private TripRepository tripRepository;

    // --- Cities CRUD ---
    @PostMapping("/cities")
    public ResponseEntity<?> addCity(@RequestBody City city) {
        try {
            City savedCity = cityRepository.save(city);
            return ResponseEntity.ok(savedCity);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error adding city: " + ex.getMessage());
        }
    }

    @PutMapping("/cities/{id}")
    public ResponseEntity<?> updateCity(@PathVariable Long id, @RequestBody City updatedCity) {
        try {
            City existingCity = cityRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("City not found"));
            existingCity.setName(updatedCity.getName());
            existingCity.setLatitude(updatedCity.getLatitude());
            existingCity.setLongitude(updatedCity.getLongitude());
            City savedCity = cityRepository.save(existingCity);
            return ResponseEntity.ok(savedCity);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error updating city: " + ex.getMessage());
        }
    }

    @DeleteMapping("/cities/{id}")
    public ResponseEntity<?> deleteCity(@PathVariable Long id) {
        try {
            cityRepository.deleteById(id);
            return ResponseEntity.ok("City deleted successfully");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error deleting city: " + ex.getMessage());
        }
    }

    @GetMapping("/cities")
    public ResponseEntity<List<City>> getAllCities() {
        return ResponseEntity.ok(cityRepository.findAll());
    }

    // --- Places CRUD ---
    @PostMapping("/places")
    public ResponseEntity<?> addPlace(@RequestBody Place place) {
        try {
            Place savedPlace = placeRepository.save(place);
            return ResponseEntity.ok(savedPlace);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error adding place: " + ex.getMessage());
        }
    }

    @PutMapping("/places/{id}")
    public ResponseEntity<?> updatePlace(@PathVariable Long id, @RequestBody Place updatedPlace) {
        try {
            Place existingPlace = placeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Place not found"));
            existingPlace.setName(updatedPlace.getName());
            existingPlace.setCategory(updatedPlace.getCategory());
            existingPlace.setCity(updatedPlace.getCity());
            existingPlace.setLatitude(updatedPlace.getLatitude());
            existingPlace.setLongitude(updatedPlace.getLongitude());
            Place savedPlace = placeRepository.save(existingPlace);
            return ResponseEntity.ok(savedPlace);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error updating place: " + ex.getMessage());
        }
    }

    @DeleteMapping("/places/{id}")
    public ResponseEntity<?> deletePlace(@PathVariable Long id) {
        try {
            placeRepository.deleteById(id);
            return ResponseEntity.ok("Place deleted successfully");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error deleting place: " + ex.getMessage());
        }
    }

    @GetMapping("/places")
    public ResponseEntity<List<Place>> getAllPlaces() {
        return ResponseEntity.ok(placeRepository.findAll());
    }

    // --- Trips (view planned trips of all users) ---
    @GetMapping("/trips")
    public ResponseEntity<List<Trip>> getAllTrips() {
        try {
            List<Trip> trips = tripRepository.findAll();
            return ResponseEntity.ok(trips);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/trips/{id}")
    public ResponseEntity<?> getTripById(@PathVariable Long id) {
        try {
            Trip trip = tripRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Trip not found"));
            return ResponseEntity.ok(trip);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error retrieving trip: " + ex.getMessage());
        }
    }
}

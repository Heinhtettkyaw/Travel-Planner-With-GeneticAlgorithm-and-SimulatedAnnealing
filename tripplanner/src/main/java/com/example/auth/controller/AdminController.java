package com.example.auth.controller;

import com.example.auth.model.City;
import com.example.auth.model.Place;
import com.example.auth.model.Trip;
import com.example.auth.model.TripDay;
import com.example.auth.model.User;
import com.example.auth.repository.CityRepository;
import com.example.auth.repository.PlaceRepository;
import com.example.auth.repository.TripRepository;
import com.example.auth.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripRepository tripRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

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

    // --- Trips (view planned trips of all users) with Pagination ---
    @GetMapping("/trips")
    public ResponseEntity<?> getAllTrips(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "25") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<Trip> tripPage = tripRepository.findAllByOrderByCreatedAtDesc(pageable);
            List<Map<String, Object>> tripList = new ArrayList<>();
            for (Trip trip : tripPage.getContent()) {
                Map<String, Object> tripMap = new HashMap<>();
                tripMap.put("id", trip.getId());
                tripMap.put("tripName", trip.getTripName());
                tripMap.put("startDate", trip.getStartDate());
                tripMap.put("endDate", trip.getEndDate());
                tripMap.put("cityName", trip.getCity().getName());
                tripMap.put("username", trip.getUser().getUsername());
                tripList.add(tripMap);
            }
            Map<String, Object> response = new HashMap<>();
            response.put("trips", tripList);
            response.put("currentPage", tripPage.getNumber());
            response.put("totalPages", tripPage.getTotalPages());
            response.put("totalItems", tripPage.getTotalElements());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/trips/{id}")
    public ResponseEntity<?> getTripById(@PathVariable Long id) {
        try {
            Trip trip = tripRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Trip not found"));
            return ResponseEntity.ok(trip);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body("Error retrieving trip: " + ex.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting user: " + e.getMessage());
        }
    }

    @GetMapping("/review/trip/{tripId}")
    public ResponseEntity<Map<String, Object>> reviewTrip(@PathVariable Long tripId) {
        try {
            // Validate tripId
            if (tripId == null || tripId <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid tripId"));
            }

            // Retrieve the trip by ID.
            Trip trip = tripRepository.findById(tripId)
                    .orElseThrow(() -> new RuntimeException("Trip not found"));

            // Build the trip details response.
            Map<String, Object> result = new HashMap<>();
            result.put("id", trip.getId());
            result.put("tripName", trip.getTripName());
            result.put("startDate", trip.getStartDate());
            result.put("endDate", trip.getEndDate());
            result.put("cityName", trip.getCity().getName());
            result.put("numberOfDays", trip.getNumberOfDays());
            result.put("username", trip.getUser().getUsername());

            // Collect details for each trip day.
            List<Map<String, Object>> daysList = getTripDaysDetails(trip.getTripDays());
            result.put("tripDays", daysList);

            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to review trip", "message", ex.getMessage()));
        }
    }

    /**
     * Helper method to extract details for each trip day.
     */
    private List<Map<String, Object>> getTripDaysDetails(List<TripDay> tripDays) {
        List<Map<String, Object>> daysList = new ArrayList<>();
        for (TripDay tripDay : tripDays) {
            Map<String, Object> dayMap = new HashMap<>();
            dayMap.put("dayNumber", tripDay.getDayNumber());

            if (tripDay.getStartingPlace() != null) {
                dayMap.put("startingPlace", tripDay.getStartingPlace().getName());
            } else {
                dayMap.put("startingPlace", null);
            }

            if (tripDay.getOptimizedRoute() != null && !tripDay.getOptimizedRoute().isEmpty()) {
                try {
                    List<String> optimizedRouteNames = objectMapper.readValue(tripDay.getOptimizedRoute(), List.class);
                    dayMap.put("optimizedRoute", optimizedRouteNames);
                    dayMap.put("totalDistance", tripDay.getTotalDistance());
                    dayMap.put("totalTime", tripDay.getTotalTime());
                } catch (Exception e) {
                    dayMap.put("optimizedRoute", null);
                    dayMap.put("totalDistance", 0.0);
                    dayMap.put("totalTime", 0.0);
                }
            } else {
                dayMap.put("optimizedRoute", null);
                dayMap.put("totalDistance", 0.0);
                dayMap.put("totalTime", 0.0);
            }

            daysList.add(dayMap);
        }
        return daysList;
    }

    // --- New Server-Side Search Endpoint with Pagination ---
    @GetMapping("/trips/search")
    public ResponseEntity<?> searchTrips(@RequestParam("query") String query,
                                         @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "25") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<Trip> tripPage = tripRepository.findByUser_UsernameContainingIgnoreCaseOrCity_NameContainingIgnoreCase(query, query, pageable);
            List<Map<String, Object>> tripList = new ArrayList<>();
            for (Trip trip : tripPage.getContent()) {
                Map<String, Object> tripMap = new HashMap<>();
                tripMap.put("id", trip.getId());
                tripMap.put("tripName", trip.getTripName());
                tripMap.put("startDate", trip.getStartDate());
                tripMap.put("endDate", trip.getEndDate());
                tripMap.put("cityName", trip.getCity().getName());
                tripMap.put("username", trip.getUser().getUsername());
                tripList.add(tripMap);
            }
            Map<String, Object> response = new HashMap<>();
            response.put("trips", tripList);
            response.put("currentPage", tripPage.getNumber());
            response.put("totalPages", tripPage.getTotalPages());
            response.put("totalItems", tripPage.getTotalElements());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }
}

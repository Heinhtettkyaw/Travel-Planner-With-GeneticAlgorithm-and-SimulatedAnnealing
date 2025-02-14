package com.example.auth.controller;

import com.example.auth.config.CustomUserDetails;
import com.example.auth.model.*;
import com.example.auth.repository.CityRepository;
import com.example.auth.repository.PlaceRepository;
import com.example.auth.repository.TripDayRepository;
import com.example.auth.repository.TripRepository;
import com.example.auth.service.RouteOptimizationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.auth.service.RouteDetails;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/trip")
public class TripController {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private TripDayRepository tripDayRepository;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private RouteOptimizationService routeOptimizationService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Creates a new trip.
     * Expects a JSON payload with:
     * {
     *   "tripName": "My Trip",
     *   "numberOfDays": "3",
     *   "startDate": "2025-02-10",
     *   "endDate": "2025-02-12",
     *   "cityId": "1"
     * }
     */
    @PostMapping("/create")
    public ResponseEntity<?> createTrip(@RequestBody Map<String, String> tripData, Authentication auth) {
        try {
            String tripName = tripData.get("tripName");
            int numberOfDays = Integer.parseInt(tripData.get("numberOfDays"));
            LocalDate startDate = LocalDate.parse(tripData.get("startDate"));
            LocalDate endDate = LocalDate.parse(tripData.get("endDate"));
            Long cityId = Long.parseLong(tripData.get("cityId"));

            City city = cityRepository.findById(cityId)
                    .orElseThrow(() -> new RuntimeException("City not found"));

            // Retrieve the authenticated user.
            User user = ((CustomUserDetails) auth.getPrincipal()).getUser();

            Trip trip = new Trip();
            trip.setTripName(tripName);
            trip.setNumberOfDays(numberOfDays);
            trip.setStartDate(startDate);
            trip.setEndDate(endDate);
            trip.setCity(city);
            trip.setUser(user);
            trip.setCreatedAt(LocalDateTime.now());
            trip = tripRepository.save(trip);

            // Create empty TripDay entries for each day.
            List<TripDay> tripDays = new ArrayList<>();
            for (int i = 1; i <= numberOfDays; i++) {
                TripDay tripDay = new TripDay();
                tripDay.setDayNumber(i);
                tripDay.setTrip(trip);
                tripDays.add(tripDay);
            }
            tripDayRepository.saveAll(tripDays);
            trip.setTripDays(tripDays);
            tripRepository.save(trip);

            return ResponseEntity.ok(Map.of("message", "Trip created successfully", "tripId", trip.getId()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Trip creation failed", "message", ex.getMessage()));
        }
    }

    /**
     * Optimizes the route for a given trip day without a separate save step.
     *
     * Expects a JSON payload with:
     * {
     *   "selectedPlaces": [16, 18, 15, 13, 14],
     *   "startingPlaceId": "16"
     * }
     *
     * This endpoint will:
     *  - Look up the Place objects for the selected IDs.
     *  - Build a distance matrix using the TomTom API.
     *  - Run a genetic algorithm–based optimizer.
     *  - Save the optimized route (as a JSON string of place names) in the TripDay.
     *  - Return a friendly response containing the names of the places.
     */
    @PostMapping("/{tripId}/day/{dayNumber}/optimize")
    public ResponseEntity<?> optimizeRoute(@PathVariable Long tripId,
                                           @PathVariable int dayNumber,
                                           @RequestBody Map<String, Object> dayData) {
        try {
            Trip trip = tripRepository.findById(tripId)
                    .orElseThrow(() -> new RuntimeException("Trip not found"));
            Optional<TripDay> optionalTripDay = trip.getTripDays().stream()
                    .filter(td -> td.getDayNumber() == dayNumber)
                    .findFirst();
            if (optionalTripDay.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid day number"));
            }
            TripDay tripDay = optionalTripDay.get();

            Object startingPlaceObj = dayData.get("startingPlaceId");
            if (startingPlaceObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing startingPlaceId in payload"));
            }
            Object selectedPlacesObj = dayData.get("selectedPlaces");
            if (selectedPlacesObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing selectedPlaces in payload"));
            }

            Long startingPlaceId = Long.parseLong(startingPlaceObj.toString());
            Place startingPlace = placeRepository.findById(startingPlaceId)
                    .orElseThrow(() -> new RuntimeException("Starting place not found"));
            tripDay.setStartingPlace(startingPlace);
            tripDay.setSelectedPlaces(objectMapper.writeValueAsString(selectedPlacesObj));

            List<Integer> selectedPlacesIds = new ArrayList<>();
            if (selectedPlacesObj instanceof List<?>) {
                for (Object o : (List<?>) selectedPlacesObj) {
                    selectedPlacesIds.add(Integer.parseInt(o.toString()));
                }
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "selectedPlaces must be a list"));
            }

            List<Place> places = placeRepository.findAllById(
                    selectedPlacesIds.stream().map(Long::valueOf).toList()
            );

            List<Place> optimizedRoute = routeOptimizationService.optimizeRoute(startingPlace, places);

            RouteDetails routeDetails = routeOptimizationService.getRouteDetails(optimizedRoute);
            List<String> optimizedRouteNames = new ArrayList<>();
            for (Place p : optimizedRoute) {
                optimizedRouteNames.add(p.getName());
            }


            tripDay.setOptimizedRoute(objectMapper.writeValueAsString(optimizedRouteNames));
            tripDay.setTotalDistance(routeDetails.getTotalDistance());
            tripDay.setTotalTime(routeDetails.getTotalTime());
            tripDayRepository.save(tripDay);

            return ResponseEntity.ok(Map.of(
                    "message", "Route optimized successfully",
                    "optimizedRoute", optimizedRouteNames,
                    "totalDistance", routeDetails.getTotalDistance(),
                    "totalTime", routeDetails.getTotalTime()
            ));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Route optimization failed", "message", ex.getMessage()));
        }
    }

    /**
     * Retrieves the saved trip for review.
     *
     * Only the owner of the trip can review it.
     * The response includes trip details (name, dates, city, created time) and,
     * for each trip day, the day number, the starting place name (if set),
     * and the optimized route (as a list of place names, if available).
     */
    @GetMapping("/review/{tripId}")
    public ResponseEntity<?> reviewTrip(@PathVariable Long tripId, Authentication auth) {
        try {
            Trip trip = tripRepository.findById(tripId)
                    .orElseThrow(() -> new RuntimeException("Trip not found"));
            User currentUser = ((CustomUserDetails) auth.getPrincipal()).getUser();
            if (!trip.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
            }

            Map<String, Object> result = new HashMap<>();
            result.put("tripId", trip.getId());
            result.put("tripName", trip.getTripName());
            result.put("numberOfDays", trip.getNumberOfDays());
            result.put("startDate", trip.getStartDate());
            result.put("endDate", trip.getEndDate());
            result.put("cityName", trip.getCity().getName());
            result.put("createdAt", trip.getCreatedAt());

            List<Map<String, Object>> daysList = new ArrayList<>();
            for (TripDay day : trip.getTripDays()) {
                Map<String, Object> dayMap = new HashMap<>();
                dayMap.put("dayNumber", day.getDayNumber());
                dayMap.put("startingPlaceName", day.getStartingPlace() != null ? day.getStartingPlace().getName() : null);
                if (day.getOptimizedRoute() != null) {
                    List<String> optimizedRouteNames = objectMapper.readValue(day.getOptimizedRoute(), List.class);
                    dayMap.put("optimizedRoute", optimizedRouteNames);
                } else {
                    dayMap.put("optimizedRoute", null);
                }
                daysList.add(dayMap);
            }
            result.put("tripDays", daysList);

            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to review trip", "message", ex.getMessage()));
        }
    }

    /**
     * Retrieves all trips for the logged-in user.
     */
    @GetMapping("/mytrips")
    public ResponseEntity<?> getMyTrips(Authentication auth) {
        try {
            User currentUser = ((CustomUserDetails) auth.getPrincipal()).getUser();
            List<Trip> trips = tripRepository.findByUser(currentUser);
            List<Map<String, Object>> tripList = new ArrayList<>();
            for (Trip trip : trips) {
                Map<String, Object> map = new HashMap<>();
                map.put("tripId", trip.getId());
                map.put("tripName", trip.getTripName());
                map.put("startDate", trip.getStartDate());
                map.put("endDate", trip.getEndDate());
                map.put("cityName", trip.getCity().getName());
                tripList.add(map);
            }
            return ResponseEntity.ok(tripList);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to fetch trips", "message", ex.getMessage()));
        }
    }
}

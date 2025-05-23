package com.example.auth.service;

import com.example.auth.model.Place;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import java.util.Locale;

@Service
public class TomTomService {

    @Value("${tomtom.api.key}")
    private String tomTomApiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public TomTomService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Calls TomTom's calculateRoute endpoint to get the route distance (in meters)
     * between two places. If the API returns an error or the coordinates appear invalid,
     * returns a high penalty distance.
     */
    public double getRouteDistance(Place origin, Place destination) {
        try {


            // Build the URL using the origin and destination coordinates.
            String url = String.format(Locale.US,
                    "https://api.tomtom.com/routing/1/calculateRoute/%.6f,%.6f:%.6f,%.6f/json?key=%s",
                    origin.getLatitude(), origin.getLongitude(),
                    destination.getLatitude(), destination.getLongitude(),
                    tomTomApiKey);

            ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class);
            String jsonResponse = responseEntity.getBody();
            System.out.println("TomTom GET Response: " + jsonResponse);

            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode routesNode = rootNode.path("routes");
            if (routesNode.isArray() && routesNode.size() > 0) {
                JsonNode summaryNode = routesNode.get(0).path("summary");
                if (summaryNode.has("lengthInMeters")) {
                    return summaryNode.path("lengthInMeters").asDouble();
                } else {
                    throw new RuntimeException("TomTom response is missing 'lengthInMeters' in summary.");
                }
            }
            throw new RuntimeException("No route found in TomTom response.");
        } catch (HttpClientErrorException e) {
            // Log the error and return a penalty distance
            String errorBody = e.getResponseBodyAsString();
            System.err.println("Failed to get route distance from TomTom API: "
                    + e.getStatusCode() + " " + errorBody);
            return Double.MAX_VALUE;
        } catch (Exception e) {
            System.err.println("Failed to get route distance from TomTom API: " + e.getMessage());
            return Double.MAX_VALUE;
        }
    }

    /**
     * Builds a distance matrix for the given list of places.
     */
    public double[][] getDistanceMatrix(java.util.List<Place> places) {
        int n = places.size();
        double[][] matrix = new double[n][n];

        for (int i = 0; i < n; i++) {
            Place p1 = places.get(i);
            for (int j = 0; j < n; j++) {
                if (i == j) {
                    matrix[i][j] = 0.0;
                } else {
                    Place p2 = places.get(j);
                    matrix[i][j] = getRouteDistance(p1, p2);
                }
            }
        }
        return matrix;
    }
}

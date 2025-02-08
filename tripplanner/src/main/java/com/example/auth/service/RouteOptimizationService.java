package com.example.auth.service;

import com.example.auth.model.Place;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RouteOptimizationService {

    @Autowired
    private TomTomService tomTomService;

    /**
     * Combines the starting place with the list of selected places, builds a distance matrix,
     * runs the genetic algorithm, and returns the optimized route.
     */
    public List<Place> optimizeRoute(Place startingPlace, List<Place> places) {
        // Create a combined list with the starting place at index 0.
        List<Place> allPlaces = new ArrayList<>();
        allPlaces.add(startingPlace);
        for (Place p : places) {
            if (!p.getId().equals(startingPlace.getId())) {
                allPlaces.add(p);
            }
        }

        int n = allPlaces.size();
        double[][] distanceMatrix = new double[n][n];

        // Build the distance matrix using distances from the TomTom API.
        for (int i = 0; i < n; i++) {
            Place p1 = allPlaces.get(i);
            for (int j = 0; j < n; j++) {
                if (i == j) {
                    distanceMatrix[i][j] = 0.0;
                } else {
                    Place p2 = allPlaces.get(j);
                    distanceMatrix[i][j] = tomTomService.getRouteDistance(p1, p2);
                }
            }
        }

        // Set GA parameters (adjust as needed).
        int populationSize = 50;
        int generations = 200;
        double mutationRate = 0.1;

        GeneticAlgorithmTSP ga = new GeneticAlgorithmTSP(distanceMatrix, populationSize, generations, mutationRate);
        int[] bestRouteIndices = ga.run();

        // Map the optimized indices back to the corresponding Place objects.
        List<Place> optimizedRoute = new ArrayList<>();
        for (int index : bestRouteIndices) {
            optimizedRoute.add(allPlaces.get(index));
        }

        return optimizedRoute;
    }
}

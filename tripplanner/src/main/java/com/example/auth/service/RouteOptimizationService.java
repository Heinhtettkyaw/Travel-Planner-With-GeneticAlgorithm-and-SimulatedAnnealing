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

    // Helper function to calculate route distance using the distance matrix.
    private double calculateDistance(int[] route, double[][] distanceMatrix) {
        double total = 0.0;
        for (int i = 0; i < route.length - 1; i++) {
            total += distanceMatrix[route[i]][route[i + 1]];
        }
        return total;
    }

    public List<Place> optimizeRoute(Place startingPlace, List<Place> places) {
        // Combine the starting place and the other places into one list.
        List<Place> allPlaces = new ArrayList<>();
        allPlaces.add(startingPlace);
        for (Place p : places) {
            if (!p.getId().equals(startingPlace.getId())) {
                allPlaces.add(p);
            }
        }

        int n = allPlaces.size();
        double[][] distanceMatrix = new double[n][n];

        // Build the distance matrix using TomTomService.
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

        // --- Run Genetic Algorithm to generate an initial solution ---
        int populationSize = 50;      // Tune as needed.
        int generations = 1000;        // Tune as needed.
        double mutationRate = 0.1;      // Tune as needed.
        GeneticAlgorithmTSP ga = new GeneticAlgorithmTSP(distanceMatrix, populationSize, generations, mutationRate);
        int[] gaSolution = ga.run();
        double gaDistance = calculateDistance(gaSolution, distanceMatrix);

        // --- Run Simulated Annealing starting from the GA solution ---
        double initialTemperature = 10000.0;  // Tune as needed.
        double coolingRate = 0.995;           // Tune as needed.
        int iterationsPerTemperature = 500;   // Tune as needed.
        SimulatedAnnealingTSP sa = new SimulatedAnnealingTSP(distanceMatrix, initialTemperature, coolingRate, iterationsPerTemperature);
        int[] saSolution = sa.run(gaSolution);
        double saDistance = calculateDistance(saSolution, distanceMatrix);

        // Choose the best solution (or simply use the SA-refined solution).
        int[] bestSolution = (saDistance < gaDistance) ? saSolution : gaSolution;

        // Map the best solution indices back to Place objects.
        List<Place> optimizedRoute = new ArrayList<>();
        for (int index : bestSolution) {
            optimizedRoute.add(allPlaces.get(index));
        }

        // Ensure the route forms a round-trip by adding the starting place at the end if needed.
        if (!optimizedRoute.get(optimizedRoute.size() - 1).equals(startingPlace)) {
            optimizedRoute.add(startingPlace);  // Add the starting place at the end to make it a round trip.
        }

        return optimizedRoute;
    }
}

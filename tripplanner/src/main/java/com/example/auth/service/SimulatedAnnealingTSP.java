package com.example.auth.service;

import java.util.Random;

public class SimulatedAnnealingTSP {
    private final double[][] distanceMatrix;
    private double initialTemperature;
    private double coolingRate;
    private int iterationsPerTemperature;
    private final Random random;

    public SimulatedAnnealingTSP(double[][] distanceMatrix, double initialTemperature, double coolingRate, int iterationsPerTemperature) {
        this.distanceMatrix = distanceMatrix;
        this.initialTemperature = initialTemperature;
        this.coolingRate = coolingRate;
        this.iterationsPerTemperature = iterationsPerTemperature;
        this.random = new Random();
    }

    // Helper method to calculate the total distance for a route.
    public double routeDistance(int[] route) {
        double total = 0.0;
        for (int i = 0; i < route.length - 1; i++) {
            total += distanceMatrix[route[i]][route[i + 1]];
        }
        return total;
    }

    // Swap two cities (excluding the fixed starting point at index 0)
    private int[] swap(int[] route, int i, int j) {
        int[] newRoute = route.clone();
        int temp = newRoute[i];
        newRoute[i] = newRoute[j];
        newRoute[j] = temp;
        return newRoute;
    }

    // New method: Run SA using a given initial solution.
    public int[] run(int[] initialSolution) {
        int n = distanceMatrix.length;
        int[] currentSolution = initialSolution.clone();
        double currentDistance = routeDistance(currentSolution);
        int[] bestSolution = currentSolution.clone();
        double bestDistance = currentDistance;
        double temperature = initialTemperature;

        // Continue until the temperature is very low.
        while (temperature > 1e-4) {
            for (int i = 0; i < iterationsPerTemperature; i++) {
                // Generate a neighboring solution by swapping two random positions (except index 0).
                int pos1 = 1 + random.nextInt(n - 1);
                int pos2 = 1 + random.nextInt(n - 1);
                int[] newSolution = swap(currentSolution, pos1, pos2);
                double newDistance = routeDistance(newSolution);
                double delta = newDistance - currentDistance;
                // Accept new solution if it's better, or with a probability if worse.
                if (delta < 0 || Math.exp(-delta / temperature) > random.nextDouble()) {
                    currentSolution = newSolution;
                    currentDistance = newDistance;
                    if (currentDistance < bestDistance) {
                        bestSolution = currentSolution.clone();
                        bestDistance = currentDistance;
                    }
                }
            }
            // Decrease the temperature.
            temperature *= coolingRate;
        }
        return bestSolution;
    }

    // (Optional) You may retain the old run() method that creates its own initial solution.
    public int[] run() {
        int n = distanceMatrix.length;
        int[] initialSolution = new int[n];
        for (int i = 0; i < n; i++) {
            initialSolution[i] = i;
        }
        for (int i = 1; i < n; i++) {
            int j = 1 + random.nextInt(n - 1);
            int temp = initialSolution[i];
            initialSolution[i] = initialSolution[j];
            initialSolution[j] = temp;
        }
        return run(initialSolution);
    }
}

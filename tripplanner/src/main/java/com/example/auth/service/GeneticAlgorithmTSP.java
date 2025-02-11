package com.example.auth.service;

import java.util.*;

public class GeneticAlgorithmTSP {
    private final double[][] distanceMatrix;
    private final int populationSize;
    private final int generations;
    private double mutationRate;
    private final Random random;

    public GeneticAlgorithmTSP(double[][] distanceMatrix, int populationSize, int generations, double mutationRate) {
        this.distanceMatrix = distanceMatrix;
        this.populationSize = populationSize;
        this.generations = generations;
        this.mutationRate = mutationRate;
        this.random = new Random();
    }

    public class Individual {
        public int[] route;
        public double fitness;

        public Individual(int[] route) {
            this.route = route.clone();
            this.fitness = calculateFitness(this.route);
        }
    }

    // Calculate the total route distance (fitness). Lower is better.
    private double calculateFitness(int[] route) {
        double totalDistance = 0.0;
        for (int i = 0; i < route.length - 1; i++) {
            totalDistance += distanceMatrix[route[i]][route[i + 1]];
        }
        // Add the distance from the last point back to the starting point (A)
        totalDistance += distanceMatrix[route[route.length - 1]][route[0]];
        return totalDistance;
    }

    // Initialize the population with random routes (keeping the starting point fixed at index 0).
    private List<Individual> initializePopulation() {
        List<Individual> population = new ArrayList<>();
        int n = distanceMatrix.length;
        int[] baseRoute = new int[n];
        for (int i = 0; i < n; i++) {
            baseRoute[i] = i;
        }
        for (int i = 0; i < populationSize; i++) {
            int[] newRoute = baseRoute.clone();
            shuffleArray(newRoute, 1, n); // shuffle indices 1..n-1 only
            population.add(new Individual(newRoute));
        }
        return population;
    }

    // Fisher–Yates shuffle for a subarray from start (inclusive) to end (exclusive)
    private void shuffleArray(int[] array, int start, int end) {
        for (int i = end - 1; i > start; i--) {
            int j = start + random.nextInt(i - start + 1);
            int temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    // Tournament selection: selects a subset and returns the best individual from that subset.
    private Individual tournamentSelection(List<Individual> population) {
        int tournamentSize = Math.max(2, population.size() / 10); // at least 2, or 10% of population
        List<Individual> tournament = new ArrayList<>();
        for (int i = 0; i < tournamentSize; i++) {
            int randomIndex = random.nextInt(population.size());
            tournament.add(population.get(randomIndex));
        }
        return tournament.stream().min(Comparator.comparingDouble(ind -> ind.fitness)).orElse(null);
    }

    // Order Crossover (OX) operator.
    private int[] crossover(int[] parent1, int[] parent2) {
        int n = parent1.length;
        int[] child = new int[n];
        Arrays.fill(child, -1);

        int start = 1 + random.nextInt(n - 1);
        int end = start + random.nextInt(n - start);

        // Copy a slice from parent1.
        for (int i = start; i <= end; i++) {
            child[i] = parent1[i];
        }

        int currentParent2Index = 1; // starting index (skip fixed starting point)
        for (int i = 1; i < n; i++) {
            if (child[i] == -1) {
                // Find next gene from parent2 not already in child.
                while (contains(child, parent2[currentParent2Index])) {
                    currentParent2Index++;
                    if (currentParent2Index >= n) {
                        currentParent2Index = 1;
                    }
                }
                child[i] = parent2[currentParent2Index];
                currentParent2Index++;
                if (currentParent2Index >= n) {
                    currentParent2Index = 1;
                }
            }
        }
        child[0] = parent1[0]; // Ensure starting point remains fixed.
        return child;
    }

    // Check if the array already contains a value.
    private boolean contains(int[] array, int value) {
        for (int i : array) {
            if (i == value) return true;
        }
        return false;
    }

    // Swap mutation: swap two positions (excluding the starting point).
    private void mutate(int[] route) {
        int n = route.length;
        if (random.nextDouble() < mutationRate) {
            int i = 1 + random.nextInt(n - 1);
            int j = 1 + random.nextInt(n - 1);
            int temp = route[i];
            route[i] = route[j];
            route[j] = temp;
        }
    }

    // 2-opt local search: repeatedly try reversing segments of the route to see if the total distance improves.
    private int[] twoOpt(int[] route) {
        int n = route.length;
        boolean improvement = true;
        int[] bestRoute = route.clone();
        double bestDistance = calculateFitness(bestRoute);
        while (improvement) {
            improvement = false;
            for (int i = 1; i < n - 1; i++) {
                for (int j = i + 1; j < n; j++) {
                    int[] newRoute = twoOptSwap(bestRoute, i, j);
                    double newDistance = calculateFitness(newRoute);
                    if (newDistance < bestDistance) {
                        bestDistance = newDistance;
                        bestRoute = newRoute;
                        improvement = true;
                    }
                }
            }
        }
        return bestRoute;
    }

    // Reverse the order of the nodes in the route between indices i and j.
    private int[] twoOptSwap(int[] route, int i, int j) {
        int[] newRoute = route.clone();
        while (i < j) {
            int temp = newRoute[i];
            newRoute[i] = newRoute[j];
            newRoute[j] = temp;
            i++;
            j--;
        }
        return newRoute;
    }

    // Main genetic algorithm loop.
    public int[] run() {
        List<Individual> population = initializePopulation();
        // Define elitism: number of top individuals to carry over unchanged.
        int elitismCount = Math.max(1, populationSize / 10);
        // Keep track of the overall best individual.
        Individual bestIndividual = population.stream().min(Comparator.comparingDouble(ind -> ind.fitness)).orElse(null);

        for (int gen = 0; gen < generations; gen++) {
            List<Individual> newPopulation = new ArrayList<>();
            // Sort current population by fitness.
            population.sort(Comparator.comparingDouble(ind -> ind.fitness));
            // Elitism: carry over the top elitismCount individuals.
            for (int i = 0; i < elitismCount; i++) {
                newPopulation.add(population.get(i));
            }
            // Fill the rest of the new population.
            while (newPopulation.size() < populationSize) {
                Individual parent1 = tournamentSelection(population);
                Individual parent2 = tournamentSelection(population);
                int[] childRoute = crossover(parent1.route, parent2.route);
                mutate(childRoute);
                newPopulation.add(new Individual(childRoute));
            }
            population = newPopulation;
            // Update bestIndividual if a better one is found.
            Individual currentBest = population.stream().min(Comparator.comparingDouble(ind -> ind.fitness)).orElse(null);
            if (currentBest.fitness < bestIndividual.fitness) {
                bestIndividual = currentBest;
            }
            // Optionally, one could adjust mutationRate adaptively here.
        }
        // Apply a 2-opt local search to the best individual to further refine the route.
        int[] improvedRoute = twoOpt(bestIndividual.route);
        return improvedRoute;
    }
}

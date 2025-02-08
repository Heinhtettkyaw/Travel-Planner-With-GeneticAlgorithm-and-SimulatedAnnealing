package com.example.auth.service;

import java.util.*;

public class GeneticAlgorithmTSP {
    private final double[][] distanceMatrix;
    private final int populationSize;
    private final int generations;
    private final double mutationRate;
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

    // Calculate total distance (fitness) for the given route.
    private double calculateFitness(int[] route) {
        double totalDistance = 0.0;
        for (int i = 0; i < route.length - 1; i++) {
            totalDistance += distanceMatrix[route[i]][route[i + 1]];
        }
        return totalDistance;
    }

    // Initialize the population with random routes.
    private List<Individual> initializePopulation() {
        List<Individual> population = new ArrayList<>();
        int n = distanceMatrix.length;
        int[] baseRoute = new int[n];
        for (int i = 0; i < n; i++) {
            baseRoute[i] = i;
        }
        // Fix the starting point (index 0) and shuffle the rest.
        for (int i = 0; i < populationSize; i++) {
            int[] newRoute = baseRoute.clone();
            shuffleArray(newRoute, 1, n);
            population.add(new Individual(newRoute));
        }
        return population;
    }

    // Shuffle the array elements between indices start (inclusive) and end (exclusive).
    private void shuffleArray(int[] array, int start, int end) {
        for (int i = end - 1; i > start; i--) {
            int j = start + random.nextInt(i - start + 1);
            int temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    // Tournament selection: return the best individual among a random subset.
    private Individual tournamentSelection(List<Individual> population) {
        int tournamentSize = 5;
        List<Individual> tournament = new ArrayList<>();
        for (int i = 0; i < tournamentSize; i++) {
            int randomIndex = random.nextInt(population.size());
            tournament.add(population.get(randomIndex));
        }
        return tournament.stream().min(Comparator.comparingDouble(ind -> ind.fitness)).orElse(null);
    }

    // Order crossover (OX) to produce a child route.
    private int[] crossover(int[] parent1, int[] parent2) {
        int n = parent1.length;
        int[] child = new int[n];
        Arrays.fill(child, -1);

        int start = 1 + random.nextInt(n - 1);
        int end = start + random.nextInt(n - start);

        // Copy subsequence from parent1.
        for (int i = start; i <= end; i++) {
            child[i] = parent1[i];
        }

        int currentParent2Index = 1;
        for (int i = 1; i < n; i++) {
            if (child[i] == -1) {
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
        // Ensure starting point remains fixed.
        child[0] = parent1[0];
        return child;
    }

    // Check if the array already contains the value.
    private boolean contains(int[] array, int value) {
        for (int i : array) {
            if (i == value) return true;
        }
        return false;
    }

    // Mutation: swap two positions (except index 0).
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

    // Run the genetic algorithm and return the best route found.
    public int[] run() {
        List<Individual> population = initializePopulation();
        Individual bestIndividual = population.stream().min(Comparator.comparingDouble(ind -> ind.fitness)).orElse(null);

        for (int gen = 0; gen < generations; gen++) {
            List<Individual> newPopulation = new ArrayList<>();
            // Elitism: carry the best individual to the next generation.
            newPopulation.add(bestIndividual);
            while (newPopulation.size() < populationSize) {
                Individual parent1 = tournamentSelection(population);
                Individual parent2 = tournamentSelection(population);
                int[] childRoute = crossover(parent1.route, parent2.route);
                mutate(childRoute);
                newPopulation.add(new Individual(childRoute));
            }
            population = newPopulation;
            Individual currentBest = population.stream().min(Comparator.comparingDouble(ind -> ind.fitness)).orElse(null);
            if (currentBest.fitness < bestIndividual.fitness) {
                bestIndividual = currentBest;
            }
        }
        return bestIndividual.route;
    }
}

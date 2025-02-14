package com.example.auth.service;

public class RouteDetails {
    private double totalDistance;  // Distance in meters
    private double totalTime;      // Time in hours

    // Constructor
    public RouteDetails(double totalDistance, double totalTime) {
        this.totalDistance = totalDistance;
        this.totalTime = totalTime;
    }

    // Getters and setters
    public double getTotalDistance() {
        return totalDistance;
    }

    public void setTotalDistance(double totalDistance) {
        this.totalDistance = totalDistance;
    }

    public double getTotalTime() {
        return totalTime;
    }

    public void setTotalTime(double totalTime) {
        this.totalTime = totalTime;
    }
}

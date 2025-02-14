package com.example.auth.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trip_days")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TripDay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int dayNumber;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    private Trip trip;

    // Starting point for the day
    @ManyToOne
    @JoinColumn(name = "starting_place_id")
    private Place startingPlace;

    // JSON string: list of selected place IDs
    @Lob
    private String selectedPlaces;

    // JSON string: optimized route (list of place IDs in order)
    @Lob
    private String optimizedRoute;
    private double totalDistance;
    private double totalTime;
}

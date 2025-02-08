// src/components/TripReview.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TripReview = ({ token }) => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/trip/review/${tripId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setTrip(response.data);
            })
            .catch((err) => {
                console.error('Error reviewing trip:', err);
                setError('Failed to load trip details.');
            });
    }, [tripId, token]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!trip) {
        return <div>Loading trip details...</div>;
    }

    return (
        <div>
            <h2>Review Trip: {trip.tripName}</h2>
            <p>
                <strong>Trip ID:</strong> {trip.tripId}
            </p>
            <p>
                <strong>City:</strong> {trip.cityName}
            </p>
            <p>
                <strong>Start Date:</strong> {trip.startDate}
            </p>
            <p>
                <strong>End Date:</strong> {trip.endDate}
            </p>
            <p>
                <strong>Number of Days:</strong> {trip.numberOfDays}
            </p>
            <p>
                <strong>Created At:</strong> {trip.createdAt}
            </p>
            <h3>Trip Days</h3>
            {trip.tripDays && trip.tripDays.length > 0 ? (
                trip.tripDays.map((day, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <h4>Day {day.dayNumber}</h4>
                        <p>
                            <strong>Starting Place:</strong> {day.startingPlaceName ? day.startingPlaceName : 'Not set'}
                        </p>
                        <p>
                            <strong>Optimized Route:</strong>
                        </p>
                        {day.optimizedRoute ? (
                            <ul>
                                {day.optimizedRoute.map((placeName, idx) => (
                                    <li key={idx}>{placeName}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>Route not optimized yet.</p>
                        )}
                    </div>
                ))
            ) : (
                <p>No trip day data available.</p>
            )}
        </div>
    );
};

export default TripReview;

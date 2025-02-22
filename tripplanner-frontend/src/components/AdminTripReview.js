import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AdminTripReview = ({ token }) => {
    // Extract the tripId from the URL parameters
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        axios
            .get(`http://localhost:8081/admin/review/trip/${tripId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setTrip(response.data);
                setError('');
            })
            .catch((error) => {
                console.error(
                    'Error fetching trip details:',
                    error.response ? error.response.data : error.message
                );
                setError(
                    error.response ? error.response.data.message : 'An unknown error occurred'
                );
            });
    }, [tripId, token]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!trip) {
        return <div>Loading trip details...</div>;
    }

    return (
        <div>
            <h2>Trip Name: {trip.tripName}</h2>
            <p>Start Date: {trip.startDate}</p>
            <p>End Date: {trip.endDate}</p>
            <p>City: {trip.cityName}</p>
            <p>Planned By: {trip.username}</p>

            <h3>Trip Days</h3>
            <ul>
                {trip.tripDays.map((day) => (
                    <li key={day.dayNumber}>
                        <strong>Day {day.dayNumber}</strong>
                        {/* If your backend sends the key as 'startingPlace', update here accordingly */}
                        <p>Starting Place: {day.startingPlace || 'N/A'}</p>
                        <p>
                            Optimized Route: {day.optimizedRoute?.join(', ') || 'N/A'}
                        </p>
                        <p>Total Distance: {day.totalDistance} km</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminTripReview;

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
        return (
            <div className="text-center text-red-500 font-semibold mt-8">
                {error}
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="text-center text-gray-600 font-medium mt-8">
                Loading trip details...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md mt-8">
            {/* Trip Details */}
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Trip Name: {trip.tripName}</h2>
            <p className="text-gray-700 mb-2">Start Date: {trip.startDate}</p>
            <p className="text-gray-700 mb-2">End Date: {trip.endDate}</p>
            <p className="text-gray-700 mb-2">City: {trip.cityName}</p>
            <p className="text-gray-700 mb-4">Planned By: {trip.username}</p>

            {/* Trip Days as Cards */}
            <h3 className="text-xl font-semibold text-green-700 mb-4">Trip Days</h3>
            <div className="space-y-4">
                {trip.tripDays.map((day) => (
                    <div
                        key={day.dayNumber}
                        className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-4"
                    >
                        <strong className="block text-lg font-semibold text-gray-800 mb-2">
                            Day {day.dayNumber}
                        </strong>
                        <p className="text-gray-600 mb-2">
                            Starting Place: {day.startingPlace || 'N/A'}
                        </p>
                        <p className="text-gray-600 mb-2">
                            Optimized Route:{' '}
                            {day.optimizedRoute?.join(', ') || 'N/A'}
                        </p>
                        <p className="text-gray-600">
                            Total Distance: {day.totalDistance} m
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminTripReview;
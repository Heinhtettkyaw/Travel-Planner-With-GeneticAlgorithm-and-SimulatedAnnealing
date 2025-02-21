import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
const TripReview = ({ token }) => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
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
        return <div className="text-red-500">{error}</div>;
    }

    if (!trip) {
        return <div className="text-gray-600">Loading trip details...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-md shadow-lg max-w-xl w-full">
                <p className="mb-4">
                    <Link
                        to="/dashboard"
                        className="text-blue-500 hover:text-blue-600 font-medium transition duration-300"
                    >
                        Dashboard
                    </Link>{' '}
                    / Review Trip
                </p>
                <h2 className="text-2xl font-bold mb-4"> Trip Name: {trip.tripName}</h2>

                {/* Trip Details */}
                <div className="space-y-2 mb-6">
                    <p>
                        <strong className="font-semibold text-gray-700">Trip ID:</strong> {trip.tripId}
                    </p>
                    <p>
                        <strong className="font-semibold text-gray-700">City:</strong> {trip.cityName}
                    </p>
                    <p>
                        <strong className="font-semibold text-gray-700">Start Date:</strong> {trip.startDate}
                    </p>
                    <p>
                        <strong className="font-semibold text-gray-700">End Date:</strong> {trip.endDate}
                    </p>
                    <p>
                        <strong className="font-semibold text-gray-700">Number of Days:</strong>{' '}
                        {trip.numberOfDays}
                    </p>
                    <p>
                        <strong className="font-semibold text-gray-700">Created At:</strong> {trip.createdAt}
                    </p>
                </div>

                {/* Trip Days */}
                <h3 className="text-xl font-bold mb-4">Trip Days</h3>
                {trip.tripDays && trip.tripDays.length > 0 ? (
                    trip.tripDays.map((day, index) => (
                        <div
                            key={index}
                            className="border border-gray-300 rounded-md p-4 mb-4"
                        >
                            <h4 className="text-lg font-medium mb-2">Day {day.dayNumber}</h4>
                            <p>
                                <strong className="font-semibold text-gray-700">Starting Place:</strong>{' '}
                                {day.startingPlaceName || 'Not set'}
                            </p>
                            <p>
                                <strong className="font-semibold text-gray-700">Optimized Route:</strong>
                            </p>
                            {day.optimizedRoute ? (
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    {day.optimizedRoute.map((placeName, idx) => (
                                        <li key={idx} className="text-gray-700">
                                            {placeName}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600">Route not optimized yet.</p>
                            )}
                            <p className="mt-2">
                                <strong className="font-semibold text-blue-600">Total Distance: {day.totalDistance} m</strong>
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No trip day data available.</p>
                )}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Return to Dashboard
                </button>
            </div>

        </div>
    );
};

export default TripReview;
// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = ({ token, setToken }) => {
    const [trips, setTrips] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'User';

    // Fetch trips for the logged-in user
    useEffect(() => {
        axios
            .get('http://localhost:8081/api/trip/mytrips', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setTrips(response.data);
            })
            .catch((err) => {
                console.error('Error fetching trips:', err);
                setError('Failed to load trips.');
            });
    }, [token]);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken('');
        navigate('/');
    };

    // Handle trip deletion with confirmation
    const handleDeleteTrip = async (tripId) => {
        if (!window.confirm('Are you sure you want to delete this trip?')) {
            return; // Exit if user cancels
        }

        try {
            await axios.delete(`http://localhost:8081/api/trip/${tripId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Trip deleted successfully!');
            // Refresh trips after deletion
            axios
                .get('http://localhost:8081/api/trip/mytrips', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setTrips(response.data);
                });
        } catch (error) {
            console.error('Error deleting trip:', error);
            alert('Failed to delete trip.');
        }
    };

    return (
        <div className="p-4">
            {/* Header */}
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Welcome, {username}!</p>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
            >
                Logout
            </button>

            {/* Create Trip Button */}
            <Link
                to="/trip"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
            >
                Create Trip
            </Link>

            {/* Trips Section */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Your Trips</h2>
            {error && <p className="text-red-500">{error}</p>}

            {trips.length === 0 ? (
                <p>No trips found. Create a new trip.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-gray-300 pb-2">
                    {/* Table Headers */}
                    <div className="font-bold text-left">Trip Name</div>
                    <div className="font-bold text-left">City</div>
                    <div className="font-bold text-left">Dates</div>
                    <div className="font-bold text-center">Actions</div>

                    {/* Trip Rows */}
                    {trips.map((trip) => (
                        <div
                            key={trip.tripId}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-gray-200 py-2"
                        >
                            {/* Trip Name */}
                            <div>{trip.tripName}</div>

                            {/* City Name */}
                            <div>{trip.cityName}</div>

                            {/* Dates */}
                            <div>
                                {trip.startDate} to {trip.endDate}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-center gap-2">
                                {/* Review Trip Button */}
                                <Link
                                    to={`/review/${trip.tripId}`}
                                    className="bg-green-500 text-white px-2 py-1 rounded-md"
                                >
                                    Review
                                </Link>

                                {/* Delete Trip Button */}
                                <button
                                    onClick={() => handleDeleteTrip(trip.tripId)}
                                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
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
                // const sortedTrips = response.data.sort((a, b) => {
                //     return new Date(b.startDate) - new Date(a.startDate);
                // });
                // setTrips(sortedTrips);
                const sortedTrips = response.data.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt); // Sorting by createdAt in descending order
                });
                setTrips(sortedTrips);
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
        <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
            {/* Header */}
            <div className="max-w-4xl w-full bg-white p-6 rounded-md shadow-lg mb-6">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <p className="mb-4">Welcome, {username}!</p>

                {/* Logout Button */}
                <Link
                    to="/trip"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md mb-6 shadow-sm transition duration-300"
                >
                    Create Trip
                </Link>
            </div>

            {/* Create Trip Button */}


            {/* Trips Section */}
            <div className="max-w-4xl w-full bg-white p-6 rounded-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Your Trips</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {trips.length === 0 ? (
                    <p className="text-gray-500">No trips found. Create a new trip.</p>
                ) : (
                    <div className="space-y-4">
                        {/* Trip Rows */}
                        {trips.map((trip) => (
                            <div
                                key={trip.tripId}
                                className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm"
                            >
                                {/* Left Side: Trip Details */}
                                <div>
                                    <p className="font-bold text-gray-700">{trip.tripName}</p>
                                    <p className="text-gray-600">City: {trip.cityName}</p>
                                    <p className="text-gray-600">
                                        Dates: {trip.startDate} to {trip.endDate}
                                    </p>
                                </div>

                                {/* Right Side: Actions */}
                                <div className="flex gap-2">
                                    {/* Review Trip Button */}
                                    <Link
                                        to={`/review/${trip.tripId}`}
                                        className="bg-green-500 hover:bg-green-600 text-white font-medium px-2 py-1 rounded-md shadow-sm transition duration-300"
                                    >
                                        Review
                                    </Link>

                                    {/* Delete Trip Button */}
                                    <button
                                        onClick={() => handleDeleteTrip(trip.tripId)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-medium px-2 py-1 rounded-md shadow-sm transition duration-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
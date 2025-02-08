// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = ({ token, setToken }) => {
    const [trips, setTrips] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'User';

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken('');
        navigate('/');
    };

    return (
        <div>
            <header>
                <h2>Dashboard</h2>
                <p>Welcome, {username}!</p>
                <button onClick={handleLogout}>Logout</button>
            </header>
            <div style={{ margin: '20px 0' }}>
                <button onClick={() => navigate('/trip')}>Create Trip</button>
            </div>
            <h3>Your Trips</h3>
            {error && <p>{error}</p>}
            {trips.length === 0 ? (
                <p>No trips found. Create a new trip.</p>
            ) : (
                <ul>
                    {trips.map((trip) => (
                        <li key={trip.tripId}>
                            <strong>{trip.tripName}</strong> ({trip.startDate} to {trip.endDate}) in {trip.cityName} -{' '}
                            <Link to={`/review/${trip.tripId}`}>Review Trip</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;

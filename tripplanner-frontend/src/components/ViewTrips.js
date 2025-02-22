// ViewTrips.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewTrips = ({ token }) => {
    const [trips, setTrips] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTrips();
    }, [token]);

    const fetchTrips = () => {
        axios
            .get('http://localhost:8081/admin/trips', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setTrips(response.data);
                setError('');
            })
            .catch((error) => {
                console.error('Error fetching trips:', error.response ? error.response.data : error.message);
                setError(error.response ? error.response.data.message : 'An unknown error occurred');
            });
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!trips.length) {
        return <div>Loading trips...</div>;
    }

    return (
        <div>
            <h2>View All Trips</h2>
            <table>
                <thead>
                <tr>
                    <th>Trip ID</th>
                    <th>Trip Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>City</th>
                    <th>Planned By</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {trips.map((trip) => (
                    <tr key={trip.id}>
                        <td>{trip.id}</td>
                        <td>{trip.tripName}</td>
                        <td>{trip.startDate}</td>
                        <td>{trip.endDate}</td>
                        <td>{trip.cityName}</td>
                        <td>{trip.username}</td>
                        <td>
                            {/* Ensure the tripId is passed correctly */}
                            <Link
                                to={`/admin/review/trip/${trip.id}`}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                Review
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewTrips;
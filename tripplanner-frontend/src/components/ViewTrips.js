import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewTrips = ({ token }) => {
    const [trips, setTrips] = useState([]);
    const [error, setError] = useState('');

    // Fetch all trips when the component is mounted
    useEffect(() => {
        fetchTrips();
    }, [token]);

    const fetchTrips = () => {
        axios.get('http://localhost:8081/admin/trips', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setTrips(response.data);
            })
            .catch((error) => {
                console.error('Error fetching trips:', error);
                setError('Failed to fetch trips');
            });
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">View All Trips</h2>
            {error && <div className="bg-red-500 text-white p-4 mb-4">{error}</div>}
            <table className="min-w-full table-auto">
                <thead>
                <tr className="bg-gray-100">
                    <th className="px-4 py-2">Trip ID</th>
                    <th className="px-4 py-2">Trip Name</th>
                    <th className="px-4 py-2">Start Date</th>
                    <th className="px-4 py-2">End Date</th>
                    <th className="px-4 py-2">City</th>
                </tr>
                </thead>
                <tbody>
                {trips.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="text-center p-4">No trips found</td>
                    </tr>
                ) : (
                    trips.map((trip) => (
                        <tr key={trip.id} className="border-b">
                            <td className="px-4 py-2">{trip.id}</td>
                            <td className="px-4 py-2">{trip.tripName}</td>
                            <td className="px-4 py-2">{trip.startDate}</td>
                            <td className="px-4 py-2">{trip.endDate}</td>
                            <td className="px-4 py-2">{trip.cityName}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ViewTrips;

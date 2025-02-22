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
        return (
            <div className="text-center text-red-500 font-semibold mt-8">
                {error}
            </div>
        );
    }

    if (!trips.length) {
        return (
            <div className="text-center text-gray-600 font-medium mt-8">
                Loading trips...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md mt-8">
            {/* Page Title */}
            <h2 className="text-2xl font-bold text-blue-700 mb-4">View All Trips</h2>

            {/* Table */}
            <table className="w-full border-collapse">
                <thead>
                <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        Trip ID
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        Trip Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        Start Date
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        End Date
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        City
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        Planned By
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody>
                {trips.map((trip) => (
                    <tr
                        key={trip.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                    >
                        <td className="py-3 px-4 text-sm text-gray-700">{trip.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{trip.tripName}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{trip.startDate}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{trip.endDate}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{trip.cityName}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{trip.username}</td>
                        <td className="py-3 px-4 text-sm">
                            <Link
                                to={`/admin/review/trip/${trip.id}`}
                                className="text-blue-500 hover:text-blue-700 underline"
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
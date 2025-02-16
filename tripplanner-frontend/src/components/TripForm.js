import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const TripForm = ({ token }) => {
    const [tripName, setTripName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [city, setCity] = useState('');
    const [cities, setCities] = useState([]);
    const [numberOfDays, setNumberOfDays] = useState(0);
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        axios
            .get('http://localhost:8081/api/cities', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setCities(response.data);
            })
            .catch((error) => {
                console.error('Error fetching cities:', error);
            });
    }, [token]);

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (end < start) {
                setNumberOfDays(0);
            } else {
                const diffTime = end - start;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                setNumberOfDays(diffDays);
            }
        }
    }, [startDate, endDate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!tripName || !startDate || !endDate || !city) {
            alert('Please fill in all fields');
            return;
        }
        if (numberOfDays <= 0) {
            alert('End date must be after start date');
            return;
        }
        axios
            .post(
                'http://localhost:8081/api/trip/create',
                { tripName, numberOfDays, startDate, endDate, cityId: city },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => {
                const tripId = response.data.tripId;
                navigate(`/places?tripId=${tripId}&cityId=${city}&numberOfDays=${numberOfDays}`);
            })
            .catch((error) => {
                console.error('Error creating trip:', error);
                alert('Error creating trip.');
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Create Trip</h2>
                <p className="mb-4">
                    <Link
                        to="/dashboard"
                        className="text-blue-500 hover:text-blue-600 font-medium transition duration-300"
                    >
                        Dashboard
                    </Link>{' '}
                    / Create Trip
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Trip Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Trip Name:</label>
                        <input
                            type="text"
                            value={tripName}
                            onChange={(e) => setTripName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            min={today}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                            min={startDate || today}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City:</label>
                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="">Select a city</option>
                            {cities.map((cityItem) => (
                                <option key={cityItem.id} value={cityItem.id}>
                                    {cityItem.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Number of Days */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Number of Days:{' '}
                            {numberOfDays > 0 ? numberOfDays : ''}
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition duration-300"
                    >
                        Create Trip
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TripForm;
// src/TripForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TripForm = ({ token }) => {
    const [tripName, setTripName] = useState('');
    const [numberOfDays, setNumberOfDays] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8081/api/cities', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setCities(response.data);
            })
            .catch(error => {
                console.error('Error fetching cities:', error);
            });
    }, [token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/api/trip/create', {
            tripName,
            numberOfDays,
            startDate,
            endDate,
            cityId: selectedCity
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                const tripId = response.data.tripId;
                // Navigate to the places selection page, passing tripId, cityId, and numberOfDays in the query string.
                navigate(`/places?tripId=${tripId}&cityId=${selectedCity}&numberOfDays=${numberOfDays}`);
            })
            .catch(error => {
                console.error('Error creating trip:', error);
                alert('Error creating trip.');
            });
    };

    return (
        <div>
            <h2>Create Trip</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Trip Name:</label>
                    <input type="text" value={tripName} onChange={(e) => setTripName(e.target.value)} required />
                </div>
                <div>
                    <label>Number of Days:</label>
                    <input type="number" value={numberOfDays} onChange={(e) => setNumberOfDays(e.target.value)} required />
                </div>
                <div>
                    <label>Start Date:</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div>
                    <label>End Date:</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                </div>
                <div>
                    <label>City:</label>
                    <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} required>
                        <option value="">Select a city</option>
                        {cities.map(city => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Create Trip</button>
            </form>
        </div>
    );
};

export default TripForm;

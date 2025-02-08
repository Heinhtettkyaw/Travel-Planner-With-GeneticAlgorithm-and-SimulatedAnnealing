// src/components/TripForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h2>Create Trip</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Trip Name:</label>
                    <input type="text" value={tripName} onChange={(e) => setTripName(e.target.value)} required />
                </div>
                <div>
                    <label>Start Date:</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required min={today} />
                </div>
                <div>
                    <label>End Date:</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required min={startDate || today} />
                </div>
                <div>
                    <label>City:</label>
                    <select value={city} onChange={(e) => setCity(e.target.value)} required>
                        <option value="">Select a city</option>
                        {cities.map(cityItem => (
                            <option key={cityItem.id} value={cityItem.id}>{cityItem.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Number of Days: {numberOfDays > 0 ? numberOfDays : ''}</label>
                </div>
                <button type="submit">Create Trip</button>
            </form>
        </div>
    );
};

export default TripForm;

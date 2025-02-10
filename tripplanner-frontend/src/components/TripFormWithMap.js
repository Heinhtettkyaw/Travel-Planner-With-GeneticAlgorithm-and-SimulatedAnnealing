// src/components/TripFormWithMap.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapDisplay from './MapDisplay';

// Update the mapping keys to match the IDs returned by your API.
const cityCoordinatesMapping = {
    "3": [-87.6298, 41.8781], // Chicago
    "2": [-74.0060, 40.7128], // New York
    "1": [-118.2437, 34.0522]  // Los Angeles
};

const TripFormWithMap = ({ token }) => {
    const [tripName, setTripName] = useState('');
    const [cityId, setCityId] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedPlaces, setSelectedPlaces] = useState([]); // Array of place objects with id, name, latitude, longitude
    const [mapCityCoordinates, setMapCityCoordinates] = useState([-87.6298, 41.8781]); // Default to Chicago

    // Fetch cities from backend when component mounts.
    useEffect(() => {
        axios.get('http://localhost:8081/api/cities', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                console.log("Fetched cities:", response.data);
                setCities(response.data);
            })
            .catch(error => console.error('Error fetching cities:', error));
    }, [token]);

    // Update map center when the city selection changes.
    const handleCityChange = (e) => {
        const selectedCityId = e.target.value;
        setCityId(selectedCityId);
        if (cityCoordinatesMapping[selectedCityId]) {
            setMapCityCoordinates(cityCoordinatesMapping[selectedCityId]);
        }
    };

    // In a real app, fetch these from your backend based on the selected city.
    const availablePlaces = [
        { id: 101, name: "Place A", latitude: 41.8800, longitude: -87.6300 },
        { id: 102, name: "Place B", latitude: 41.8820, longitude: -87.6280 }
    ];

    // Handle selection/deselection of a place.
    const handlePlaceSelection = (place, checked) => {
        if (checked) {
            setSelectedPlaces(prev => [...prev, place]);
        } else {
            setSelectedPlaces(prev => prev.filter(p => p.id !== place.id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle trip creation (e.g., send data to your backend).
        console.log("Trip created:", { tripName, cityId });
    };

    return (
        <div style={{ display: 'flex', height: '600px' }}>
            {/* Left side: Trip Form */}
            <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                <h2>Create Trip</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Trip Name:</label>
                        <input
                            type="text"
                            value={tripName}
                            onChange={(e) => setTripName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>City:</label>
                        <select value={cityId} onChange={handleCityChange} required>
                            <option value="">Select a city</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <h3>Available Places</h3>
                        {availablePlaces.map(place => (
                            <div key={place.id}>
                                <input
                                    type="checkbox"
                                    id={`place-${place.id}`}
                                    onChange={(e) => handlePlaceSelection(place, e.target.checked)}
                                />
                                <label htmlFor={`place-${place.id}`}>{place.name}</label>
                            </div>
                        ))}
                    </div>
                    <button type="submit">Create Trip</button>
                </form>
            </div>

            {/* Right side: Map Display */}
            <div style={{ flex: 1, padding: '10px' }}>
                <MapDisplay cityCoordinates={mapCityCoordinates} markers={selectedPlaces} />
            </div>
        </div>
    );
};

export default TripFormWithMap;

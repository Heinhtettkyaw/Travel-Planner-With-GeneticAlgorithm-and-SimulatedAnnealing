// src/components/PlacesSelectionWithMap.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import MapDisplay from './MapDisplay';

// Mapping of city IDs to coordinates ([longitude, latitude])—update these keys as needed.
const cityCoordinatesMapping = {
    "1": [-118.2437, 34.0522],  // Los Angeles
    "2": [-74.0060, 40.7128],    // New York
    "3": [-87.6298, 41.8781]     // Chicago
};

const PlacesSelectionWithMap = ({ token }) => {
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const tripId = query.get('tripId');
    const cityId = query.get('cityId');
    const numberOfDays = parseInt(query.get('numberOfDays'), 10);

    // daysData is an array—one element per day.
    // Each day holds: dayNumber, selectedPlaces (array of place objects), startingPlaceId, optimizedRoute,
    // and placesByCategory (object with keys HOTEL, RESTAURANT, ATTRACTION).
    const [daysData, setDaysData] = useState([]);

    // availablePlaces holds the fetched places for each category.
    const [availablePlaces, setAvailablePlaces] = useState({
        HOTEL: [],
        RESTAURANT: [],
        ATTRACTION: []
    });

    // Initialize daysData based on numberOfDays.
    useEffect(() => {
        const initialDays = [];
        for (let i = 1; i <= numberOfDays; i++) {
            initialDays.push({
                dayNumber: i,
                selectedPlaces: [],
                startingPlaceId: null,
                optimizedRoute: null,
                isOptimizing: false,
                placesByCategory: {
                    HOTEL: [],
                    RESTAURANT: [],
                    ATTRACTION: []
                }
            });
        }
        setDaysData(initialDays);
    }, [numberOfDays]);

    // Fetch available places for each category from the backend.
    useEffect(() => {
        const categories = ['HOTEL', 'RESTAURANT', 'ATTRACTION'];
        categories.forEach((category) => {
            axios
                .get('http://localhost:8081/api/places', {
                    params: { cityId, category },
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setAvailablePlaces(prev => ({ ...prev, [category]: response.data }));
                })
                .catch((error) =>
                    console.error(`Error fetching ${category} places:`, error)
                );
        });
    }, [cityId, token]);

    // Once availablePlaces are fetched, update each day's placesByCategory.
    useEffect(() => {
        if (
            availablePlaces.HOTEL.length ||
            availablePlaces.RESTAURANT.length ||
            availablePlaces.ATTRACTION.length
        ) {
            setDaysData(prevDays =>
                prevDays.map(day => ({
                    ...day,
                    placesByCategory: { ...availablePlaces }
                }))
            );
        }
    }, [availablePlaces]);

    // Handle checkbox selection: update selectedPlaces for a given day.
    const handleCheckboxChange = (dayNumber, place, checked) => {
        setDaysData(prevDays =>
            prevDays.map(day => {
                if (day.dayNumber === dayNumber) {
                    let newSelected = day.selectedPlaces.slice();
                    if (checked) {
                        if (!newSelected.find(p => p.id === place.id)) {
                            newSelected.push(place);
                        }
                    } else {
                        newSelected = newSelected.filter(p => p.id !== place.id);
                    }
                    return { ...day, selectedPlaces: newSelected };
                }
                return day;
            })
        );
    };

    // Handle radio selection for starting point.
    const handleRadioChange = (dayNumber, placeId) => {
        setDaysData(prevDays =>
            prevDays.map(day =>
                day.dayNumber === dayNumber ? { ...day, startingPlaceId: placeId } : day
            )
        );
    };

    // Handle Optimize Route button click for a given day.
    const optimizeDay = (dayNumber) => {
        setDaysData(prevDays =>
            prevDays.map(day =>
                day.dayNumber === dayNumber ? { ...day, isOptimizing: true } : day
            )
        );

        // Find the corresponding day data.
        const day = daysData.find(d => d.dayNumber === dayNumber);
        if (!day) return;

        if (!day.selectedPlaces || day.selectedPlaces.length === 0) {
            alert(`Please select at least one place for Day ${dayNumber}`);
            setDaysData(prevDays =>
                prevDays.map(d =>
                    d.dayNumber === dayNumber ? { ...d, isOptimizing: false } : d
                )
            );
            return;
        }
        if (!day.startingPlaceId) {
            alert(`Please select a starting point for Day ${dayNumber}`);
            setDaysData(prevDays =>
                prevDays.map(d =>
                    d.dayNumber === dayNumber ? { ...d, isOptimizing: false } : d
                )
            );
            return;
        }

        // Prepare payload: send an array of selected place IDs and the startingPlaceId.
        const payload = {
            selectedPlaces: day.selectedPlaces.map(p => p.id),
            startingPlaceId: day.startingPlaceId.toString()
        };

        axios
            .post(`http://localhost:8081/api/trip/${tripId}/day/${dayNumber}/optimize`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                // The response should contain the optimized route as a list of place names.
                const optimizedRoute = response.data.optimizedRoute;
                setDaysData(prevDays =>
                    prevDays.map(d =>
                        d.dayNumber === dayNumber
                            ? { ...d, optimizedRoute, isOptimizing: false }
                            : d
                    )
                );
                alert(`Day ${dayNumber}: Optimized route created and saved successfully.`);
            })
            .catch((error) => {
                console.error(`Error optimizing Day ${dayNumber}:`, error);
                setDaysData(prevDays =>
                    prevDays.map(d =>
                        d.dayNumber === dayNumber ? { ...d, isOptimizing: false } : d
                    )
                );
                alert(`Error optimizing route for Day ${dayNumber}.`);
            });
    };

    // Combine selected places from all days for markers on the map.
    const combinedSelectedPlaces = daysData.reduce((acc, day) => acc.concat(day.selectedPlaces), []);

    return (
        <div style={{ display: 'flex' }}>
            {/* Left side: Multi-day Place Selection Form */}
            <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                <h2>Select Places for Your Trip (Days: {numberOfDays})</h2>
                {daysData.map(day => (
                    <div key={day.dayNumber} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
                        <h3>Day {day.dayNumber}</h3>
                        {['HOTEL', 'RESTAURANT', 'ATTRACTION'].map(category => (
                            <div key={category}>
                                <h4>{category}</h4>
                                {day.placesByCategory[category] && day.placesByCategory[category].map(place => (
                                    <div key={place.id}>
                                        <input
                                            type="checkbox"
                                            id={`day${day.dayNumber}-place${place.id}`}
                                            onChange={(e) => handleCheckboxChange(day.dayNumber, place, e.target.checked)}
                                        />
                                        <label htmlFor={`day${day.dayNumber}-place${place.id}`}>{place.name}</label>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div>
                            <h4>Select Starting Point</h4>
                            {day.selectedPlaces.map(place => (
                                <div key={place.id}>
                                    <input
                                        type="radio"
                                        name={`startingPoint-day${day.dayNumber}`}
                                        value={place.id}
                                        checked={Number(day.startingPlaceId) === place.id}
                                        onChange={() => handleRadioChange(day.dayNumber, place.id)}
                                    />
                                    <label>{place.name}</label>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => optimizeDay(day.dayNumber)} disabled={day.isOptimizing}>
                            {day.isOptimizing ? 'Optimizing...' : 'Optimize Route'}
                        </button>
                        {day.optimizedRoute && (
                            <div>
                                <h4>Optimized Route:</h4>
                                <ul>
                                    {day.optimizedRoute.map((placeName, idx) => (
                                        <li key={idx}>{placeName}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Right side: Map Display */}
            <div style={{ flex: 1, padding: '10px' }}>
                <MapDisplay cityCoordinates={cityCoordinatesMapping[cityId] || [-87.6298, 41.8781]} markers={combinedSelectedPlaces} />
            </div>
        </div>
    );
};

export default PlacesSelectionWithMap;

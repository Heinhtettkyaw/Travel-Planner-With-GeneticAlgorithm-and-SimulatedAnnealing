// src/PlacesSelection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlacesSelection = ({ token, tripId, cityId, numberOfDays }) => {
    const [daysData, setDaysData] = useState([]);

    useEffect(() => {
        // Initialize daysData with empty selections for each day.
        const initialDays = [];
        for (let i = 1; i <= numberOfDays; i++) {
            initialDays.push({
                dayNumber: i,
                selectedPlaces: [],
                startingPlaceId: null,
                optimizedRoute: null,
                placesByCategory: {
                    HOTEL: [],
                    RESTAURANT: [],
                    ATTRACTION: [],
                },
            });
        }
        setDaysData(initialDays);

        // Fetch places for each category from the backend using the provided cityId.
        const categories = ['HOTEL', 'RESTAURANT', 'ATTRACTION'];
        categories.forEach((category) => {
            axios
                .get('http://localhost:8081/api/places', {
                    params: { cityId, category },
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setDaysData((prevDays) =>
                        prevDays.map((day) => ({
                            ...day,
                            placesByCategory: {
                                ...day.placesByCategory,
                                [category]: response.data,
                            },
                        }))
                    );
                })
                .catch((error) => console.error(`Error fetching ${category} places:`, error));
        });
    }, [cityId, numberOfDays, token]);

    // Handle checkbox change for selecting/unselecting a place.
    const handleCheckboxChange = (dayNumber, placeId, checked) => {
        setDaysData((prevDays) =>
            prevDays.map((day) => {
                if (day.dayNumber === dayNumber) {
                    const newSelected = checked
                        ? [...day.selectedPlaces, placeId]
                        : day.selectedPlaces.filter((id) => id !== placeId);
                    return { ...day, selectedPlaces: newSelected };
                }
                return day;
            })
        );
    };

    // Handle radio button change for selecting the starting point.
    const handleStartingPointChange = (dayNumber, placeId) => {
        setDaysData((prevDays) =>
            prevDays.map((day) => {
                if (day.dayNumber === dayNumber) {
                    return { ...day, startingPlaceId: placeId };
                }
                return day;
            })
        );
    };

    // This function sends the optimization request to the backend.
    const optimizeDay = (dayNumber) => {
        const day = daysData.find((d) => d.dayNumber === dayNumber);
        if (!day) return;

        if (!day.selectedPlaces || day.selectedPlaces.length === 0) {
            alert(`Please select at least one place for Day ${dayNumber}`);
            return;
        }
        if (!day.startingPlaceId) {
            alert(`Please select a starting point for Day ${dayNumber}`);
            return;
        }

        const payload = {
            selectedPlaces: day.selectedPlaces,
            startingPlaceId: day.startingPlaceId.toString(),
        };

        axios
            .post(`http://localhost:8081/api/trip/${tripId}/day/${dayNumber}/optimize`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                const optimizedRoute = response.data.optimizedRoute;
                setDaysData((prevDays) =>
                    prevDays.map((d) => (d.dayNumber === dayNumber ? { ...d, optimizedRoute } : d))
                );
                alert(`Day ${dayNumber} optimized successfully.`);
            })
            .catch((error) => {
                console.error(`Error optimizing Day ${dayNumber}:`, error);
                alert(`Error optimizing route for Day ${dayNumber}.`);
            });
    };

    return (
        <div>
            <h2>Places Selection</h2>
            {daysData.map((day) => (
                <div
                    key={day.dayNumber}
                    style={{ border: '1px solid #ccc', marginBottom: '20px', padding: '10px' }}
                >
                    <h3>Day {day.dayNumber}</h3>
                    {['HOTEL', 'RESTAURANT', 'ATTRACTION'].map((category) => (
                        <div key={category}>
                            <h4>{category}</h4>
                            {day.placesByCategory[category].map((place) => (
                                <div key={place.id}>
                                    <input
                                        type="checkbox"
                                        id={`day${day.dayNumber}-place${place.id}`}
                                        checked={day.selectedPlaces.includes(place.id)}
                                        onChange={(e) =>
                                            handleCheckboxChange(day.dayNumber, place.id, e.target.checked)
                                        }
                                    />
                                    <label htmlFor={`day${day.dayNumber}-place${place.id}`}>{place.name}</label>
                                </div>
                            ))}
                        </div>
                    ))}
                    <div>
                        <h4>Select Starting Point</h4>
                        {day.selectedPlaces.map((placeId) => {
                            // Find the corresponding place object from any category.
                            const allPlaces = [
                                ...day.placesByCategory.HOTEL,
                                ...day.placesByCategory.RESTAURANT,
                                ...day.placesByCategory.ATTRACTION,
                            ];
                            const place = allPlaces.find((p) => p.id === placeId);
                            if (!place) return null;
                            return (
                                <div key={place.id}>
                                    <input
                                        type="radio"
                                        name={`startingPoint-day${day.dayNumber}`}
                                        value={place.id}
                                        checked={day.startingPlaceId === place.id}
                                        onChange={() => handleStartingPointChange(day.dayNumber, place.id)}
                                    />
                                    <label>{place.name}</label>
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={() => optimizeDay(day.dayNumber)}>
                        Optimize Route for Day {day.dayNumber}
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
    );
};

export default PlacesSelection;

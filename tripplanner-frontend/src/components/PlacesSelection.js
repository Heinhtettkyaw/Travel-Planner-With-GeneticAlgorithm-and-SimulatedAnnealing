// src/components/PlacesSelection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlacesSelection = ({ token, tripId, cityId, numberOfDays }) => {
    const [daysData, setDaysData] = useState([]);

    useEffect(() => {
        const initialDays = [];
        for (let i = 1; i <= numberOfDays; i++) {
            initialDays.push({
                dayNumber: i,
                selectedPlaces: [],
                startingPlaceId: null,
                optimizedRoute: null,
                isLoading: false,
                placesByCategory: {
                    HOTEL: [],
                    RESTAURANT: [],
                    ATTRACTION: [],
                },
            });
        }
        setDaysData(initialDays);

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
                .catch((error) =>
                    console.error(`Error fetching ${category} places:`, error)
                );
        });
    }, [cityId, numberOfDays, token]);

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

    const handleStartingPointChange = (dayNumber, placeId) => {
        setDaysData((prevDays) =>
            prevDays.map((day) =>
                day.dayNumber === dayNumber ? { ...day, startingPlaceId: placeId } : day
            )
        );
    };

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

        setDaysData((prevDays) =>
            prevDays.map((d) =>
                d.dayNumber === dayNumber ? { ...d, isLoading: true } : d
            )
        );

        axios
            .post(`http://localhost:8081/api/trip/${tripId}/day/${dayNumber}/optimize`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                const optimizedRoute = response.data.optimizedRoute;
                setDaysData((prevDays) =>
                    prevDays.map((d) =>
                        d.dayNumber === dayNumber ? { ...d, optimizedRoute, isLoading: false } : d
                    )
                );
                alert("Created successfully and saved the route successfully");
            })
            .catch((error) => {
                console.error(`Error optimizing Day ${dayNumber}:`, error);
                setDaysData((prevDays) =>
                    prevDays.map((d) =>
                        d.dayNumber === dayNumber ? { ...d, isLoading: false } : d
                    )
                );
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
                    {day.isLoading && <div>Loading optimized route, please wait...</div>}
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

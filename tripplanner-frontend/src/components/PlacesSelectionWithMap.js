import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import MapDisplayMarkers from './MapDisplayMarkers';
import MapDisplayOptimized from './MapDisplayOptimized';

// Mapping of city IDs to coordinates ([longitude, latitude])
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

    const [daysData, setDaysData] = useState([]);
    const [availablePlaces, setAvailablePlaces] = useState({
        HOTEL: [],
        RESTAURANT: [],
        ATTRACTION: []
    });
    const [optimizedRoute, setOptimizedRoute] = useState([]);
    const [showOptimizedMap, setShowOptimizedMap] = useState(false);

    useEffect(() => {
        const initialDays = [];
        for (let i = 1; i <= numberOfDays; i++) {
            initialDays.push({
                dayNumber: i,
                selectedPlaces: [],
                startingPlaceId: null,
                optimizedRoute: [],
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
                .catch((error) => console.error(`Error fetching ${category} places:`, error));
        });
    }, [cityId, token]);

    useEffect(() => {
        setDaysData(prevDays =>
            prevDays.map(day => ({
                ...day,
                placesByCategory: { ...availablePlaces }
            }))
        );
    }, [availablePlaces]);

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

    const handleRadioChange = (dayNumber, placeId) => {
        setDaysData(prevDays =>
            prevDays.map(day =>
                day.dayNumber === dayNumber ? { ...day, startingPlaceId: placeId } : day
            )
        );
    };

    const optimizeDay = (dayNumber) => {
        setDaysData(prevDays =>
            prevDays.map(day =>
                day.dayNumber === dayNumber ? { ...day, isOptimizing: true } : day
            )
        );
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

        const payload = {
            selectedPlaces: day.selectedPlaces.map(p => p.id),
            startingPlaceId: day.startingPlaceId.toString()
        };

        axios
            .post(`http://localhost:8081/api/trip/${tripId}/day/${dayNumber}/optimize`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                const optimizedNames = response.data.optimizedRoute;
                const combinedAvailablePlaces = [
                    ...availablePlaces.HOTEL,
                    ...availablePlaces.RESTAURANT,
                    ...availablePlaces.ATTRACTION,
                ];
                const mappedOptimizedRoute = optimizedNames.map(name => {
                    return combinedAvailablePlaces.find(p => p.name === name);
                }).filter(item => item);

                setDaysData(prevDays =>
                    prevDays.map(d =>
                        d.dayNumber === dayNumber
                            ? { ...d, optimizedRoute: mappedOptimizedRoute, isOptimizing: false }
                            : d
                    )
                );
                setOptimizedRoute(mappedOptimizedRoute);
                setShowOptimizedMap(true);
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

    const combinedSelectedPlaces = daysData.reduce((acc, day) => acc.concat(day.selectedPlaces), []);

    return (
        <div style={{ display: 'flex', height: '600px' }}>
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
                        {day.optimizedRoute && day.optimizedRoute.length > 0 && (
                            <div>
                                <h4>Optimized Route (Text):</h4>
                                <ul>
                                    {day.optimizedRoute.map((placeObj, idx) => (
                                        <li key={idx}>{placeObj.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div style={{ flex: 1, padding: '10px' }}>
                {showOptimizedMap ? (
                    <MapDisplayOptimized
                        cityCoordinates={cityCoordinatesMapping[cityId] || [-87.6298, 41.8781]}
                        route={optimizedRoute}
                        startingPlace={daysData.find(day => day.optimizedRoute.length > 0)?.optimizedRoute[0]}  // Pass the starting place
                    />
                ) : (
                    <MapDisplayMarkers
                        cityCoordinates={cityCoordinatesMapping[cityId] || [-87.6298, 41.8781]}
                        markers={combinedSelectedPlaces}
                    />
                )}
            </div>
        </div>
    );
};

export default PlacesSelectionWithMap;

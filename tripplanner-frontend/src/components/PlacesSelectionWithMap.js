import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import MapDisplayMarkers from './MapDisplayMarkers';
import MapDisplayOptimized from './MapDisplayOptimized';

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
    const dayNumberParam = query.get('dayNumber');
    let dayNumber = dayNumberParam ? parseInt(dayNumberParam, 10) : 1;
    const navigate = useNavigate();

    const [daysData, setDaysData] = useState([]);
    const [availablePlaces, setAvailablePlaces] = useState({ HOTEL: [], RESTAURANT: [], ATTRACTION: [] });
    const [optimizedRoute, setOptimizedRoute] = useState([]);
    const [showOptimizedMap, setShowOptimizedMap] = useState(false);

    // Ensure dayNumber is within valid range
    useEffect(() => {
        if (dayNumber < 1) dayNumber = 1;
        if (dayNumber > numberOfDays) dayNumber = numberOfDays;
        if (!dayNumberParam) {
            navigate({
                search: `?tripId=${tripId}&cityId=${cityId}&numberOfDays=${numberOfDays}&dayNumber=${dayNumber}`
            });
        }
    }, [dayNumber, dayNumberParam, navigate, numberOfDays, tripId, cityId]);

    // Initialize daysData
    useEffect(() => {
        const initialDays = Array.from({ length: numberOfDays }, (_, i) => ({
            dayNumber: i + 1,
            selectedPlaces: [],
            startingPlaceId: null,
            optimizedRoute: [],
            isOptimizing: false,
            placesByCategory: { HOTEL: [], RESTAURANT: [], ATTRACTION: [] }
        }));
        setDaysData(initialDays);
    }, [numberOfDays]);

    // Fetch available places
    useEffect(() => {
        const categories = ['HOTEL', 'RESTAURANT', 'ATTRACTION'];
        categories.forEach((category) => {
            axios.get('http://localhost:8081/api/places', {
                params: { cityId, category },
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    setAvailablePlaces(prev => ({ ...prev, [category]: response.data }));
                })
                .catch(error => console.error(`Error fetching ${category} places:`, error));
        });
    }, [cityId, token]);

    // Update daysData with available places
    useEffect(() => {
        setDaysData(prevDays =>
            prevDays.map(day => ({
                ...day,
                placesByCategory: { ...availablePlaces }
            }))
        );
    }, [availablePlaces]);

    // Reset optimized map on day change
    useEffect(() => {
        setShowOptimizedMap(false);
    }, [dayNumber]);

    // Event handlers using current dayNumber
    const handleCheckboxChange = (place, checked) => {
        setDaysData(prevDays =>
            prevDays.map(day => {
                if (day.dayNumber === dayNumber) {
                    let newSelected = checked
                        ? [...day.selectedPlaces, place]
                        : day.selectedPlaces.filter(p => p.id !== place.id);
                    return { ...day, selectedPlaces: newSelected };
                }
                return day;
            })
        );
    };

    const handleRadioChange = (placeId) => {
        setDaysData(prevDays =>
            prevDays.map(day =>
                day.dayNumber === dayNumber ? { ...day, startingPlaceId: placeId } : day
            )
        );
    };

    const optimizeDay = () => {
        const day = daysData.find(d => d.dayNumber === dayNumber);
        if (!day) return;

        setDaysData(prevDays =>
            prevDays.map(d =>
                d.dayNumber === dayNumber ? { ...d, isOptimizing: true } : d
            )
        );

        if (day.selectedPlaces.length === 0) {
            alert('Please select at least one place.');
            setDaysData(prevDays => prevDays.map(d => d.dayNumber === dayNumber ? { ...d, isOptimizing: false } : d));
            return;
        }

        if (!day.startingPlaceId) {
            alert('Please select a starting point.');
            setDaysData(prevDays => prevDays.map(d => d.dayNumber === dayNumber ? { ...d, isOptimizing: false } : d));
            return;
        }

        axios.post(`http://localhost:8081/api/trip/${tripId}/day/${dayNumber}/optimize`, {
            selectedPlaces: day.selectedPlaces.map(p => p.id),
            startingPlaceId: day.startingPlaceId.toString()
        }, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                const combinedPlaces = [...availablePlaces.HOTEL, ...availablePlaces.RESTAURANT, ...availablePlaces.ATTRACTION];
                const optimized = response.data.optimizedRoute.map(name =>
                    combinedPlaces.find(p => p.name === name)
                ).filter(Boolean);

                setDaysData(prevDays =>
                    prevDays.map(d =>
                        d.dayNumber === dayNumber
                            ? { ...d, optimizedRoute: optimized, isOptimizing: false }
                            : d
                    )
                );
                setOptimizedRoute(optimized);
                setShowOptimizedMap(true);
                alert('Optimized route created successfully.');
            })
            .catch(error => {
                console.error('Optimization error:', error);
                setDaysData(prevDays => prevDays.map(d => d.dayNumber === dayNumber ? { ...d, isOptimizing: false } : d));
                alert('Error optimizing route.');
            });
    };

    const currentDayData = daysData.find(day => day.dayNumber === dayNumber);
    const combinedSelectedPlaces = currentDayData?.selectedPlaces || [];

    const handleNextDay = () => {
        if (dayNumber < numberOfDays) {
            const newDay = dayNumber + 1;
            navigate({
                search: `?tripId=${tripId}&cityId=${cityId}&numberOfDays=${numberOfDays}&dayNumber=${newDay}`
            });
        }
    };

    const handlePreviousDay = () => {
        if (dayNumber > 1) {
            const newDay = dayNumber - 1;
            navigate({
                search: `?tripId=${tripId}&cityId=${cityId}&numberOfDays=${numberOfDays}&dayNumber=${newDay}`
            });
        }
    };

    return (
        <div style={{ display: 'flex', height: '600px' }}>
            <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                <h2>Day {dayNumber} of {numberOfDays}</h2>
                {currentDayData && (
                    <div style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
                        {['HOTEL', 'RESTAURANT', 'ATTRACTION'].map(category => (
                            <div key={category}>
                                <h4>{category}</h4>
                                {currentDayData.placesByCategory[category]?.map(place => (
                                    <div key={place.id}>
                                        <input
                                            type="checkbox"
                                            checked={currentDayData.selectedPlaces.some(p => p.id === place.id)}
                                            onChange={(e) => handleCheckboxChange(place, e.target.checked)}
                                        />
                                        <label>{place.name}</label>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div>
                            <h4>Starting Point</h4>
                            {currentDayData.selectedPlaces.map(place => (
                                <div key={place.id}>
                                    <input
                                        type="radio"
                                        name="startingPoint"
                                        checked={currentDayData.startingPlaceId === place.id}
                                        onChange={() => handleRadioChange(place.id)}
                                    />
                                    <label>{place.name}</label>
                                </div>
                            ))}
                        </div>
                        <button onClick={optimizeDay} disabled={currentDayData.isOptimizing}>
                            {currentDayData.isOptimizing ? 'Optimizing...' : 'Optimize Route'}
                        </button>
                        {currentDayData.optimizedRoute.length > 0 && (
                            <div>
                                <h4>Optimized Route:</h4>
                                <ul>
                                    {currentDayData.optimizedRoute.map((place, idx) => (
                                        <li key={idx}>{place.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
                <div style={{ marginTop: '10px' }}>
                    <button onClick={handlePreviousDay} disabled={dayNumber <= 1}>
                        Previous Day
                    </button>
                    <button onClick={handleNextDay} disabled={dayNumber >= numberOfDays}>
                        Next Day
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, padding: '10px' }}>
                {showOptimizedMap ? (
                    <MapDisplayOptimized
                        cityCoordinates={cityCoordinatesMapping[cityId]}
                        route={optimizedRoute}
                        startingPlace={optimizedRoute[0]}
                    />
                ) : (
                    <MapDisplayMarkers
                        cityCoordinates={cityCoordinatesMapping[cityId]}
                        markers={combinedSelectedPlaces}
                    />
                )}
            </div>
        </div>
    );
};

export default PlacesSelectionWithMap;
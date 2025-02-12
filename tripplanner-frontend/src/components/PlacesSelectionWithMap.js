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

    // Ensure dayNumber is within valid range and update URL if not present
    useEffect(() => {
        if (dayNumber < 1) dayNumber = 1;
        if (dayNumber > numberOfDays) dayNumber = numberOfDays;
        if (!dayNumberParam) {
            navigate({
                search: `?tripId=${tripId}&cityId=${cityId}&numberOfDays=${numberOfDays}&dayNumber=${dayNumber}`
            });
        }
    }, [dayNumber, dayNumberParam, navigate, numberOfDays, tripId, cityId]);

    // Initialize daysData with default values
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

    // Fetch available places for each category
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
            alert(`Please select at least one place for Day ${dayNumber}`);
            setDaysData(prevDays =>
                prevDays.map(d => d.dayNumber === dayNumber ? { ...d, isOptimizing: false } : d)
            );
            return;
        }
        if (!day.startingPlaceId) {
            alert(`Please select a starting point for Day ${dayNumber}`);
            setDaysData(prevDays =>
                prevDays.map(d => d.dayNumber === dayNumber ? { ...d, isOptimizing: false } : d)
            );
            return;
        }

        const payload = {
            selectedPlaces: day.selectedPlaces.map(p => p.id),
            startingPlaceId: day.startingPlaceId.toString()
        };

        axios.post(`http://localhost:8081/api/trip/${tripId}/day/${dayNumber}/optimize`, payload, {
            headers: { Authorization: `Bearer ${token}` }
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
                        d.dayNumber === dayNumber ? { ...d, optimizedRoute: mappedOptimizedRoute, isOptimizing: false } : d
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

    // Navigation: Next and Previous Day buttons.
    const handleNextDay = () => {
        if (dayNumber < numberOfDays) {
            navigate({
                search: `?tripId=${tripId}&cityId=${cityId}&numberOfDays=${numberOfDays}&dayNumber=${dayNumber + 1}`
            });
        } else {
            // Last day: Navigate to Dashboard.
            navigate('/dashboard');
        }
    };

    const handlePreviousDay = () => {
        if (dayNumber > 1) {
            navigate({
                search: `?tripId=${tripId}&cityId=${cityId}&numberOfDays=${numberOfDays}&dayNumber=${dayNumber - 1}`
            });
        }
    };

    const currentDayData = daysData.find(day => day.dayNumber === dayNumber) || { selectedPlaces: [], placesByCategory: { HOTEL: [], RESTAURANT: [], ATTRACTION: [] }, optimizedRoute: [], isOptimizing: false };
    const combinedSelectedPlaces = currentDayData.selectedPlaces || [];

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
                                            id={`day${dayNumber}-place${place.id}`}
                                            checked={currentDayData.selectedPlaces.some(p => p.id === place.id)}
                                            onChange={(e) => handleCheckboxChange(place, e.target.checked)}
                                        />
                                        <label htmlFor={`day${dayNumber}-place${place.id}`}>{place.name}</label>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div>
                            <h4>Select Starting Point</h4>
                            {currentDayData.selectedPlaces.map(place => (
                                <div key={place.id}>
                                    <input
                                        type="radio"
                                        name={`startingPoint-day${dayNumber}`}
                                        value={place.id}
                                        checked={Number(currentDayData.startingPlaceId) === place.id}
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
                                <h4>Optimized Route (Text):</h4>
                                <ul>
                                    {currentDayData.optimizedRoute.map((placeObj, idx) => (
                                        <li key={idx}>{placeObj.name}</li>
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
                    {dayNumber < numberOfDays ? (
                        <button onClick={handleNextDay}>
                            Next Day
                        </button>
                    ) : (
                        <button onClick={handleNextDay}>
                            Go to Dashboard
                        </button>
                    )}
                </div>
            </div>

            <div style={{ flex: 1, padding: '10px' }}>
                {showOptimizedMap ? (
                    <MapDisplayOptimized
                        cityCoordinates={cityCoordinatesMapping[cityId] || [-87.6298, 41.8781]}
                        route={optimizedRoute}
                        startingPlace={currentDayData.optimizedRoute[0]}
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

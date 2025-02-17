import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import MapDisplayMarkers from './MapDisplayMarkers';
import MapDisplayOptimized from './MapDisplayOptimized';

const PlacesSelectionWithMap = ({ token }) => {
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const tripId = query.get('tripId');
    const cityId = query.get('cityId');
    const numberOfDays = parseInt(query.get('numberOfDays'), 10);
    const dayNumberParam = query.get('dayNumber');
    let dayNumber = dayNumberParam ? parseInt(dayNumberParam, 10) : 1;
    const navigate = useNavigate();

    const [cityCoordinates, setCityCoordinates] = useState([0, 0]); // Default coordinates
    const [daysData, setDaysData] = useState([]);
    const [availablePlaces, setAvailablePlaces] = useState({ HOTEL: [], RESTAURANT: [], ATTRACTION: [] });
    const [optimizedRoute, setOptimizedRoute] = useState([]);
    const [showOptimizedMap, setShowOptimizedMap] = useState(false);
    const [optimizedDistance, setOptimizedDistance] = useState(null);
    const [optimizedTime, setOptimizedTime] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

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

    // Fetch city coordinates from the backend
    useEffect(() => {
        if (cityId) {
            axios.get(`http://localhost:8081/api/cities/${cityId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    const { latitude, longitude } = response.data;
                    setCityCoordinates([longitude, latitude]); // Update city coordinates dynamically
                })
                .catch(error => console.error('Error fetching city coordinates:', error));
        }
    }, [cityId, token]);

    // Initialize daysData with default values when numberOfDays is available
    useEffect(() => {
        if (numberOfDays) {
            const initialDays = Array.from({ length: numberOfDays }, (_, i) => ({
                dayNumber: i + 1,
                selectedPlaces: [],
                startingPlaceId: null,
                optimizedRoute: [],
                isOptimizing: false,
                placesByCategory: { HOTEL: [], RESTAURANT: [], ATTRACTION: [] }
            }));
            setDaysData(initialDays);
        }
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

    // Get the current day's data or a default object if not yet available
    const currentDayData = daysData.find(day => day.dayNumber === dayNumber) || {
        selectedPlaces: [],
        placesByCategory: { HOTEL: [], RESTAURANT: [], ATTRACTION: [] },
        optimizedRoute: [],
        isOptimizing: false,
        startingPlaceId: null
    };

    // Event handler for checkbox change (max 9 places)
    const handleCheckboxChange = (place, checked) => {
        const maxPlaces = 9;
        setDaysData(prevDays =>
            prevDays.map(day => {
                if (day.dayNumber === dayNumber) {
                    let newSelected = checked
                        ? [...day.selectedPlaces, place]
                        : day.selectedPlaces.filter(p => p.id !== place.id);

                    // Limit to 9 places per day
                    if (newSelected.length > maxPlaces) {
                        alert(`You can select a maximum of ${maxPlaces} places per day.`);
                        return day; // No changes if exceeded
                    } else {
                        setErrorMessage('');
                        return { ...day, selectedPlaces: newSelected };
                    }
                }
                return day;
            })
        );
    };

    // Event handler for selecting starting point (radio button)
    const handleRadioChange = (placeId) => {
        setDaysData(prevDays =>
            prevDays.map(day =>
                day.dayNumber === dayNumber ? { ...day, startingPlaceId: placeId } : day
            )
        );
    };

    // Optimize the route for the current day
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
            setDaysData(prevDays =>
                prevDays.map(d =>
                    d.dayNumber === dayNumber ? { ...d, isOptimizing: false } : d
                )
            );
            return;
        }

        if (!day.startingPlaceId) {
            alert('Please select a starting point.');
            setDaysData(prevDays =>
                prevDays.map(d =>
                    d.dayNumber === dayNumber ? { ...d, isOptimizing: false } : d
                )
            );
            return;
        }

        axios.post(`http://localhost:8081/api/trip/${tripId}/day/${dayNumber}/optimize`, {
            selectedPlaces: day.selectedPlaces.map(p => p.id),
            startingPlaceId: day.startingPlaceId.toString()
        }, { headers: { Authorization: `Bearer ${token}` } })
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
                setOptimizedDistance(response.data.totalDistance);
                setOptimizedTime(response.data.totalTime);

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

    return (
        <div className="flex h-[7   00px]">
            {/* Left Panel */}
            <div className="flex-1 p-2.5 overflow-y-auto">
                <h2 className="text-lg font-bold">Day {dayNumber} of {numberOfDays}</h2>
                {daysData.length > 0 && (
                    <div className="border border-gray-300 mb-2.5 p-2.5">
                        {['HOTEL', 'RESTAURANT', 'ATTRACTION'].map(category => (
                            <div key={category}>
                                <h4 className="text-base font-semibold">{category}</h4>
                                {currentDayData.placesByCategory[category]?.map(place => (
                                    <div key={place.id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`day${dayNumber}-place${place.id}`}
                                            checked={currentDayData.selectedPlaces.some(p => p.id === place.id)}
                                            onChange={(e) => handleCheckboxChange(place, e.target.checked)}
                                            className="form-checkbox"
                                        />
                                        <label htmlFor={`day${dayNumber}-place${place.id}`} className="cursor-pointer">
                                            {place.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div>
                            <h4 className="text-base font-semibold">Select Starting Point</h4>
                            {currentDayData.selectedPlaces.map(place => (
                                <div key={place.id} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name={`startingPoint-day${dayNumber}`}
                                        value={place.id}
                                        checked={Number(currentDayData.startingPlaceId) === place.id}
                                        onChange={() => handleRadioChange(place.id)}
                                        className="form-radio"
                                    />
                                    <label className="cursor-pointer">{place.name}</label>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={optimizeDay}
                            disabled={currentDayData.isOptimizing}
                            className="mt-2.5 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                        >
                            {currentDayData.isOptimizing ? 'Optimizing...' : 'Optimize Route'}
                        </button>
                        {currentDayData.optimizedRoute.length > 0 && (
                            <div>
                                <h4 className="text-base font-semibold mt-2.5">Optimized Route (Text):</h4>
                                <ul className="list-disc pl-5">
                                    {currentDayData.optimizedRoute.map((placeObj, idx) => (
                                        <li key={idx}>{placeObj.name}</li>
                                    ))}
                                </ul>
                                <h4 className="text-base font-semibold mt-2.5">Total Distance: {optimizedDistance} m</h4>
                            </div>
                        )}
                    </div>
                )}
                <div className="mt-2.5 flex justify-between">
                    <button
                        onClick={() => navigate({
                            search: `?tripId=${tripId}&cityId=${cityId}&numberOfDays=${numberOfDays}&dayNumber=${Math.max(dayNumber - 1, 1)}`
                        })}
                        disabled={dayNumber <= 1}
                        className="px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-400"
                    >
                        Previous Day
                    </button>
                    {dayNumber < numberOfDays ? (
                        <button
                            onClick={() => navigate({
                                search: `?tripId=${tripId}&cityId=${cityId}&numberOfDays=${numberOfDays}&dayNumber=${dayNumber + 1}`
                            })}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Next Day
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-4 py-2 bg-green-500 text-white rounded"
                        >
                            Go to Dashboard
                        </button>
                    )}
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 p-2.5">
                {showOptimizedMap ? (
                    <MapDisplayOptimized cityCoordinates={cityCoordinates} route={optimizedRoute} />
                ) : (
                    <MapDisplayMarkers cityCoordinates={cityCoordinates} markers={currentDayData.selectedPlaces}/>
                )}
            </div>
        </div>
    );
};

export default PlacesSelectionWithMap;
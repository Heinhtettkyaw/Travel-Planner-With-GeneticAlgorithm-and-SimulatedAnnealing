// src/components/PlacesSelectionWithMap.js
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
    const [availablePlaces, setAvailablePlaces] = useState({
        HOTEL: [],
        RESTAURANT: [],
        ATTRACTION: [],
    });
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
                search: `?tripId=${tripId}&cityId=${cityId}&numberOfDays=${numberOfDays}&dayNumber=${dayNumber}`,
            });
        }
    }, [dayNumber, dayNumberParam, navigate, numberOfDays, tripId, cityId]);

    // Fetch city coordinates from the backend
    useEffect(() => {
        if (cityId) {
            axios
                .get(`http://localhost:8081/api/cities/${cityId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    const { latitude, longitude } = response.data;
                    setCityCoordinates([longitude, latitude]);
                })
                .catch((error) =>
                    console.error('Error fetching city coordinates:', error)
                );
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
                optimizedDistance: null,
                optimizedTime: null,
                isOptimizing: false,
                placesByCategory: { HOTEL: [], RESTAURANT: [], ATTRACTION: [] },
            }));
            setDaysData(initialDays);
        }
    }, [numberOfDays]);

    // Fetch available places for each category
    useEffect(() => {
        const categories = ['HOTEL', 'RESTAURANT', 'ATTRACTION'];
        categories.forEach((category) => {
            axios
                .get('http://localhost:8081/api/places', {
                    params: { cityId, category },
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setAvailablePlaces((prev) => ({ ...prev, [category]: response.data }));
                })
                .catch((error) =>
                    console.error(`Error fetching ${category} places:`, error)
                );
        });
    }, [cityId, token]);

    // Update daysData with available places
    useEffect(() => {
        setDaysData((prevDays) =>
            prevDays.map((day) => ({
                ...day,
                placesByCategory: { ...availablePlaces },
            }))
        );
    }, [availablePlaces]);

    // When dayNumber or daysData changes, update optimized route data accordingly.
    useEffect(() => {
        const currentDay = daysData.find((day) => day.dayNumber === dayNumber);
        if (currentDay && currentDay.optimizedRoute.length > 0) {
            setOptimizedRoute(currentDay.optimizedRoute);
            setOptimizedDistance(currentDay.optimizedDistance);
            setOptimizedTime(currentDay.optimizedTime);
            setShowOptimizedMap(true);
        } else {
            setOptimizedRoute([]);
            setOptimizedDistance(null);
            setOptimizedTime(null);
            setShowOptimizedMap(false);
        }
    }, [dayNumber, daysData]);

    // Get the current day's data or a default object if not yet available
    const currentDayData =
        daysData.find((day) => day.dayNumber === dayNumber) || {
            selectedPlaces: [],
            placesByCategory: { HOTEL: [], RESTAURANT: [], ATTRACTION: [] },
            optimizedRoute: [],
            optimizedDistance: null,
            optimizedTime: null,
            isOptimizing: false,
            startingPlaceId: null,
        };

    // Helper function to get the earliest day a place was selected in previous days
    const getVisitedDay = (placeId) => {
        let earliest = null;
        daysData.forEach((day) => {
            if (day.dayNumber < dayNumber && day.selectedPlaces.some((p) => p.id === placeId)) {
                if (earliest === null || day.dayNumber < earliest) {
                    earliest = day.dayNumber;
                }
            }
        });
        return earliest;
    };

    // Compute a set of visited place IDs from previous days (for informational display)
    const visitedPlaceIds = new Set();
    daysData.forEach((day) => {
        if (day.dayNumber < dayNumber) {
            day.selectedPlaces.forEach((p) => visitedPlaceIds.add(p.id));
        }
    });

    // Event handler for checkbox change (max 9 places)
    const handleCheckboxChange = (place, checked) => {
        const maxPlaces = 9;
        setDaysData((prevDays) =>
            prevDays.map((day) => {
                if (day.dayNumber === dayNumber) {
                    let newSelected = checked
                        ? [...day.selectedPlaces, place]
                        : day.selectedPlaces.filter((p) => p.id !== place.id);
                    if (newSelected.length > maxPlaces) {
                        alert(`You can select a maximum of ${maxPlaces} places per day.`);
                        return day;
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
        setDaysData((prevDays) =>
            prevDays.map((day) =>
                day.dayNumber === dayNumber ? { ...day, startingPlaceId: placeId } : day
            )
        );
    };

    // Optimize the route for the current day
    const optimizeDay = () => {
        const day = daysData.find((d) => d.dayNumber === dayNumber);
        if (!day) return;

        setDaysData((prevDays) =>
            prevDays.map((d) =>
                d.dayNumber === dayNumber ? { ...d, isOptimizing: true } : d
            )
        );

        if (day.selectedPlaces.length === 0) {
            alert('Please select at least one place.');
            setDaysData((prevDays) =>
                prevDays.map((d) =>
                    d.dayNumber === dayNumber ? { ...d, isOptimizing: false } : d
                )
            );
            return;
        }

        if (!day.startingPlaceId) {
            alert('Please select a starting point.');
            setDaysData((prevDays) =>
                prevDays.map((d) =>
                    d.dayNumber === dayNumber ? { ...d, isOptimizing: false } : d
                )
            );
            return;
        }

        axios
            .post(
                `http://localhost:8081/api/trip/${tripId}/day/${dayNumber}/optimize`,
                {
                    selectedPlaces: day.selectedPlaces.map((p) => p.id),
                    startingPlaceId: day.startingPlaceId.toString(),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => {
                const optimizedNames = response.data.optimizedRoute;
                const combinedAvailablePlaces = [
                    ...availablePlaces.HOTEL,
                    ...availablePlaces.RESTAURANT,
                    ...availablePlaces.ATTRACTION,
                ];
                const mappedOptimizedRoute = optimizedNames
                    .map((name) => combinedAvailablePlaces.find((p) => p.name === name))
                    .filter((item) => item);

                setDaysData((prevDays) =>
                    prevDays.map((d) =>
                        d.dayNumber === dayNumber
                            ? {
                                ...d,
                                optimizedRoute: mappedOptimizedRoute,
                                isOptimizing: false,
                                optimizedDistance: response.data.totalDistance,
                                optimizedTime: response.data.totalTime,
                            }
                            : d
                    )
                );
                setOptimizedRoute(mappedOptimizedRoute);
                setOptimizedDistance(response.data.totalDistance);
                setOptimizedTime(response.data.totalTime);
                setShowOptimizedMap(true);

                alert(`Day ${dayNumber}: Optimized route created and saved successfully.`);
            })
            .catch((error) => {
                console.error(`Error optimizing Day ${dayNumber}:`, error);
                setDaysData((prevDays) =>
                    prevDays.map((d) =>
                        d.dayNumber === dayNumber ? { ...d, isOptimizing: false } : d
                    )
                );
                alert(`Error optimizing route for Day ${dayNumber}.`);
            });
    };

    // Format optimized route as a string: "Place A -> Place B -> Place C"
    const optimizedRouteText = optimizedRoute.map((place) => place.name).join(' -> ');

    // Handle Next Day: If last day, redirect to the Review page
    const handleNextDay = () => {
        if (dayNumber < numberOfDays) {
            navigate({
                search: `?tripId=${tripId}&cityId=${cityId}&numberOfDays=${numberOfDays}&dayNumber=${dayNumber + 1}`,
            });
        } else {
            navigate(`/review/${tripId}`);
        }
    };

    return (
        <div className="min-h-screen max-w-full bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-6xl">
                {/* Header */}
                <h2 className="text-2xl font-bold mb-6">Plan Your Trip</h2>
                <p className="mb-4">
                    Day {dayNumber} of {numberOfDays}
                </p>

                {/* Two-Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Place Selection */}
                    <div>
                        {/* Navigation Buttons */}
                        <div className="flex justify-between mb-6">
                            <button
                                onClick={() =>
                                    navigate({
                                        search: `?tripId=${tripId}&cityId=${cityId}&numberOfDays=${numberOfDays}&dayNumber=${Math.max(
                                            dayNumber - 1,
                                            1
                                        )}`,
                                    })
                                }
                                disabled={dayNumber <= 1}
                                className={`px-4 py-2 rounded-md ${
                                    dayNumber <= 1
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                            >
                                Previous Day
                            </button>
                            <button
                                onClick={handleNextDay}
                                className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                {dayNumber < numberOfDays ? 'Next Day' : 'Review Trip'}
                            </button>
                        </div>
                        {/* Optimized Route Display */}
                        {currentDayData.optimizedRoute.length > 0 && (
                            <div className="mt-6 mb-6">
                                <h3 className="text-lg font-bold mb-2 text-blue-600">Optimized Route:</h3>
                                <p className="text-blue-700 font-medium">{optimizedRouteText}</p>
                                <p className="mt-2 text-blue-600 font-medium">
                                    Total Distance: {optimizedDistance} m
                                </p>
                            </div>
                        )}

                        {/* Place Selection Section */}
                        {['HOTEL', 'RESTAURANT', 'ATTRACTION'].map((category) => (
                            <div key={category} className="mb-6 mt-6">
                                <h3 className="text-lg font-medium mb-2">{category}</h3>
                                <ul className="space-y-2">
                                    {currentDayData.placesByCategory[category]?.map((place) => {
                                        const visitedDay = getVisitedDay(place.id);
                                        return (
                                            <li key={place.id} className="flex flex-col">
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`day${dayNumber}-place${place.id}`}
                                                        checked={currentDayData.selectedPlaces.some((p) => p.id === place.id)}
                                                        onChange={(e) => handleCheckboxChange(place, e.target.checked)}
                                                        className="form-checkbox h-5 w-5 text-blue-500"
                                                    />
                                                    <label htmlFor={`day${dayNumber}-place${place.id}`}>
                                                        {place.name}
                                                    </label>
                                                </div>
                                                {visitedDay && (
                                                    <span className="text-xs text-red-500 ml-7">
                                                        (This place was already visited in day {visitedDay})
                                                    </span>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}

                        {/* Starting Point Selection */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-2">Select Starting Point</h3>
                            <ul className="space-y-2">
                                {currentDayData.selectedPlaces.map((place) => (
                                    <li key={place.id} className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name={`startingPoint-day${dayNumber}`}
                                            value={place.id}
                                            checked={currentDayData.startingPlaceId === place.id}
                                            onChange={() => handleRadioChange(place.id)}
                                            className="form-radio h-5 w-5 text-blue-500"
                                        />
                                        <label>{place.name}</label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Optimize Route Button */}
                        <button
                            onClick={optimizeDay}
                            disabled={currentDayData.isOptimizing}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition duration-300"
                        >
                            {currentDayData.isOptimizing ? 'Optimizing...' : 'Optimize Route'}
                        </button>
                    </div>

                    {/* Right Column: Map Display */}
                    <div>
                        {showOptimizedMap ? (
                            <MapDisplayOptimized
                                cityCoordinates={cityCoordinates}
                                route={optimizedRoute}
                            />
                        ) : (
                            <MapDisplayMarkers
                                cityCoordinates={cityCoordinates}
                                markers={currentDayData.selectedPlaces}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlacesSelectionWithMap;

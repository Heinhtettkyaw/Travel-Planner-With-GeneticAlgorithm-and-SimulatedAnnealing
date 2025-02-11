// src/components/MapDisplayOptimized.js
import React, { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const MapDisplayOptimized = ({ cityCoordinates, route }) => {
    const mapElement = useRef(null);
    const map = useRef(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // Initialize the map on mount.
    useEffect(() => {
        map.current = tt.map({
            key: 'Bz6tdTkL7VBF5mO0OXKVnu7ZGpQulMkD', // Replace with your actual TomTom API key.
            container: mapElement.current,
            center: cityCoordinates, // [longitude, latitude]
            zoom: 12,
        });

        map.current.on('load', () => {
            setIsMapLoaded(true);
            console.log("Map style loaded");
        });

        return () => {
            if (map.current) {
                map.current.remove();
            }
        };
    }, [cityCoordinates]);

    // Update map center when cityCoordinates change.
    useEffect(() => {
        if (map.current) {
            map.current.setCenter(cityCoordinates);
        }
    }, [cityCoordinates]);

    // Log route data for debugging.
    useEffect(() => {
        console.log("Optimized route received:", route);
    }, [route]);

    // When the optimized route changes and the map is loaded, add the polyline layer.
    useEffect(() => {
        if (!map.current || !isMapLoaded) {
            console.log("Map not loaded yet");
            return;
        }

        // Remove existing polyline layer and source if present.
        if (map.current.getLayer('routeLayer')) {
            map.current.removeLayer('routeLayer');
        }
        if (map.current.getSource('routeSource')) {
            map.current.removeSource('routeSource');
        }

        // Ensure we have a valid route with at least two points.
        if (route && route.length > 1 && route.every(place => place.latitude && place.longitude)) {
            const coordinates = route.map(place => [Number(place.longitude), Number(place.latitude)]);
            console.log("Calculated coordinates:", coordinates);

            const geojson = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates,
                },
            };

            map.current.addSource('routeSource', {
                type: 'geojson',
                data: geojson,
            });

            map.current.addLayer({
                id: 'routeLayer',
                type: 'line',
                source: 'routeSource',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                    'visibility': 'visible'
                },
                paint: {
                    'line-color': '#FF0000',
                    'line-width': 6,
                },
            });

            console.log("Route layer added with coordinates:", coordinates);

            // Use a timeout to call fitBounds after the layer has been added.
            setTimeout(() => {
                try {
                    const bounds = coordinates.reduce((bounds, coord) => bounds.extend(coord), new tt.LngLatBounds(coordinates[0], coordinates[0]));
                    map.current.fitBounds(bounds, { padding: 50 });
                    console.log("Map bounds set to:", bounds);
                } catch (error) {
                    console.error("Error fitting bounds:", error);
                }
            }, 1000);
        } else {
            console.error("Optimized route does not contain valid latitude/longitude data.");
        }
    }, [route, isMapLoaded]);

    return <div ref={mapElement} style={{ width: '100%', height: '100%' }}></div>;
};

export default MapDisplayOptimized;

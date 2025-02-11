// src/components/MapDisplayOptimized.js
import React, { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const MapDisplayOptimized = ({ cityCoordinates, route }) => {
    const mapElement = useRef(null);
    const map = useRef(null);
    const markersRef = useRef([]);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // Initialize the map when the component mounts.
    useEffect(() => {
        map.current = tt.map({
            key: 'Bz6tdTkL7VBF5mO0OXKVnu7ZGpQulMkD', // Replace with your actual TomTom API key.
            container: mapElement.current,
            center: cityCoordinates, // [longitude, latitude]
            zoom: 12,
        });

        // Wait for the map style to fully load.
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

    // Update the map center when cityCoordinates change.
    useEffect(() => {
        if (map.current) {
            map.current.setCenter(cityCoordinates);
        }
    }, [cityCoordinates]);

    // Debug: log the route whenever it changes.
    useEffect(() => {
        console.log("Optimized route received:", route);
    }, [route]);

    // Add polyline layer for the optimized route.
    useEffect(() => {
        if (!map.current || !isMapLoaded) {
            console.log("Map not loaded yet");
            return;
        }
        // Remove existing polyline layer and source.
        if (map.current.getLayer('routeLayer')) {
            map.current.removeLayer('routeLayer');
        }
        if (map.current.getSource('routeSource')) {
            map.current.removeSource('routeSource');
        }
        // Validate that we have at least two points with numeric lat/lon.
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
                    'line-color': '#0e54f1', // Green polyline.
                    'line-width': 6,
                },
            });
            console.log("Route layer added with coordinates:", coordinates);

            // Fit the map bounds to the polyline.
            setTimeout(() => {
                try {
                    const bounds = coordinates.reduce(
                        (bounds, coord) => bounds.extend(coord),
                        new tt.LngLatBounds(coordinates[0], coordinates[0])
                    );
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

    // Add markers (with labels) for each point in the optimized route.
    useEffect(() => {
        if (!map.current || !isMapLoaded) return;
        // Remove existing markers.
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        if (route && route.length > 0) {
            route.forEach((place, index) => {
                if (place.latitude && place.longitude) {
                    // If index === 0, assume it's the starting point.
                    const isStartingPoint = index === 0;
                    const markerColor = isStartingPoint ? 'green' : 'red';
                    const label = isStartingPoint ? `Starting Point: ${place.name}` : place.name;
                    // Create a popup for the marker.
                    const popup = new tt.Popup({ offset: 30, closeButton: false })
                        .setHTML(`<div>${label}</div>`);
                    // Create the marker.
                    const marker = new tt.Marker({ color: markerColor })
                        .setLngLat([Number(place.longitude), Number(place.latitude)])
                        .setPopup(popup)
                        .addTo(map.current);
                    // Optionally, you can open the popup automatically:
                    // marker.getPopup().toggle();
                    markersRef.current.push(marker);
                }
            });
            console.log("Markers with labels added for optimized route");
        }
    }, [route, isMapLoaded]);

    return <div ref={mapElement} style={{ width: '100%', height: '100%' }}></div>;
};

export default MapDisplayOptimized;

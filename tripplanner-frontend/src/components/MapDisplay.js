// src/components/MapDisplay.js
import React, { useEffect, useRef } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const MapDisplay = ({ cityCoordinates, markers, route }) => {
    const mapElement = useRef(null);
    const map = useRef(null);
    const markersRef = useRef([]);

    // Initialize the map on mount.
    useEffect(() => {
        if (!map.current) {
            map.current = tt.map({
                key: 'Bz6tdTkL7VBF5mO0OXKVnu7ZGpQulMkD', // Replace with your actual TomTom API key.
                container: mapElement.current,
                center: cityCoordinates, // [longitude, latitude]
                zoom: 12,
            });
        } else {
            map.current.setCenter(cityCoordinates);
        }
    }, [cityCoordinates]);

    // Update markers when the markers prop changes.
    useEffect(() => {
        if (!map.current) return;
        // Remove existing markers.
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        // Add markers for each selected place.
        if (markers && markers.length > 0) {
            markers.forEach(place => {
                const marker = new tt.Marker({ color: 'red' })
                    .setLngLat([place.longitude, place.latitude])
                    .addTo(map.current);
                markersRef.current.push(marker);
            });
        }
    }, [markers]);

    // Update or add the polyline layer when the "route" prop changes.
    useEffect(() => {
        if (!map.current) return;

        // Remove existing route layer and source if they exist.
        if (map.current.getLayer('routeLayer')) {
            map.current.removeLayer('routeLayer');
        }
        if (map.current.getSource('routeSource')) {
            map.current.removeSource('routeSource');
        }

        // Only add the route if a valid route is provided (at least two points).
        if (route && route.length > 1) {
            const routeCoordinates = route.map(place => [place.longitude, place.latitude]);

            const geojson = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: routeCoordinates,
                },
            };

            // Add a new source and layer for the route.
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
                },
                paint: {
                    'line-color': '#FF0000',
                    'line-width': 4,
                },
            });
        }
    }, [route]);

    return <div ref={mapElement} style={{ height: '100%', width: '100%' }}></div>;
};

export default MapDisplay;

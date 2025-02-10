// src/components/MapDisplay.js
import React, { useEffect, useRef } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const MapDisplay = ({ cityCoordinates, markers }) => {
    const mapElement = useRef(null);
    const map = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (!map.current) {
            map.current = tt.map({
                key: 'Bz6tdTkL7VBF5mO0OXKVnu7ZGpQulMkD',  // Replace with your TomTom API key.
                container: mapElement.current,
                center: cityCoordinates,
                zoom: 12,
            });
        } else {
            map.current.setCenter(cityCoordinates);
        }
    }, [cityCoordinates]);

    useEffect(() => {
        // Remove existing markers.
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        // Add a marker for each selected place.
        if (markers && markers.length > 0) {
            markers.forEach(place => {
                const marker = new tt.Marker({ color: 'red' })
                    .setLngLat([place.longitude, place.latitude])
                    .addTo(map.current);
                markersRef.current.push(marker);
            });
        }
    }, [markers]);

    return (
        <div ref={mapElement} style={{ height: '100%', width: '100%' }}></div>
    );
};

export default MapDisplay;

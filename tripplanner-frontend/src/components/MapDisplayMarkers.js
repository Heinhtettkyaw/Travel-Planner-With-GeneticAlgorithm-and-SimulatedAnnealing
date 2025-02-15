// src/components/MapDisplayMarkers.js
import React, { useEffect, useRef } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const MapDisplayMarkers = ({ cityCoordinates, markers }) => {
    const mapElement = useRef(null);
    const map = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        map.current = tt.map({
            key: 'uNSdjqZ8dnSQJcmSSCqsZfUrQLKQQ9l6', // Replace with your actual TomTom API key.
            container: mapElement.current,
            center: cityCoordinates,
            zoom: 12,
        });
        return () => {
            if (map.current) {
                map.current.remove();
            }
        };
    }, [cityCoordinates]);

    useEffect(() => {
        // Remove any existing markers.
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        if (markers && markers.length > 0) {
            markers.forEach(place => {
                const marker = new tt.Marker({ color: 'red' })
                    .setLngLat([place.longitude, place.latitude])
                    .addTo(map.current);
                markersRef.current.push(marker);
            });
        }
    }, [markers]);

    return <div ref={mapElement} style={{ width: '100%', height: '100%' }}></div>;
};

export default MapDisplayMarkers;
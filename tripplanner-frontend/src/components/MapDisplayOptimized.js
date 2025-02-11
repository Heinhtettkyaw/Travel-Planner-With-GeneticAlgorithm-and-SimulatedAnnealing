import React, { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const MapDisplayOptimized = ({ cityCoordinates, route }) => {
    const mapElement = useRef(null);
    const map = useRef(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // Refs to hold markers and label markers for cleanup.
    const markersRef = useRef([]);
    const labelsRef = useRef([]);

    // Initialize the map.
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

    // Update the map center when cityCoordinates change.
    useEffect(() => {
        if (map.current) {
            map.current.setCenter(cityCoordinates);
        }
    }, [cityCoordinates]);

    // Add markers for each place in the route.
    // Every place whose id equals route[0].id (the starting point) is colored green.
    useEffect(() => {
        if (!map.current || !isMapLoaded) return;

        // Remove any existing markers.
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        if (route && route.length > 0) {
            route.forEach((place, index) => {
                if (place.latitude && place.longitude) {
                    // If the place id equals the starting point's id, mark it green; otherwise, red.
                    const markerColor = (place.id === route[0].id) ? 'green' : 'red';

                    // Create a marker using TomTom's default marker with the specified color.
                    const marker = new tt.Marker({ color: markerColor })
                        .setLngLat([Number(place.longitude), Number(place.latitude)])
                        .addTo(map.current);

                    markersRef.current.push(marker);
                }
            });
            console.log("Place markers added for optimized route");
        }
    }, [route, isMapLoaded]);

    // Draw the polyline and add numbered labels along the polyline.
    useEffect(() => {
        if (!map.current || !isMapLoaded) return;

        // Remove any existing polyline layer and source.
        if (map.current.getLayer('routeLayer')) {
            map.current.removeLayer('routeLayer');
        }
        if (map.current.getSource('routeSource')) {
            map.current.removeSource('routeSource');
        }
        // Remove any existing label markers.
        labelsRef.current.forEach(labelMarker => labelMarker.remove());
        labelsRef.current = [];

        if (route && route.length > 1 && route.every(place => place.latitude && place.longitude)) {
            // Build an array of coordinates.
            const coordinates = route.map(place => [Number(place.longitude), Number(place.latitude)]);
            console.log("Coordinates for polyline:", coordinates);

            // Create and add a GeoJSON source and layer for the polyline.
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
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#0e54f1', // Blue polyline.
                    'line-width': 6,
                },
            });
            console.log("Polyline layer added");

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

            // Add numbered labels along the polyline at midpoints of each segment.
            for (let i = 0; i < coordinates.length - 1; i++) {
                const startCoord = coordinates[i];
                const endCoord = coordinates[i + 1];
                const midpoint = [
                    (startCoord[0] + endCoord[0]) / 2,
                    (startCoord[1] + endCoord[1]) / 2,
                ];

                const labelDiv = document.createElement('div');
                // Style the label as desired.
                labelDiv.style.backgroundColor = 'transparent';
                labelDiv.style.color = 'black';
                labelDiv.style.fontSize = '18px';
                labelDiv.style.fontWeight = 'bold';
                labelDiv.style.textAlign = 'center';
                labelDiv.textContent = (i + 1).toString();

                const labelMarker = new tt.Marker({ element: labelDiv })
                    .setLngLat(midpoint)
                    .addTo(map.current);

                labelsRef.current.push(labelMarker);
            }
            console.log("Numbered labels added along the polyline");
        }
    }, [route, isMapLoaded]);

    return <div ref={mapElement} style={{ width: '100%', height: '100%' }}></div>;
};

export default MapDisplayOptimized;

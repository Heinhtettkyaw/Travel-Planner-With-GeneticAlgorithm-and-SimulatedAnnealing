import React, { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const MapDisplayOptimized = ({ cityCoordinates, route }) => {
    const mapElement = useRef(null);
    const map = useRef(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    // Refs to hold markers and label markers for cleanup.
    const markersRef = useRef([]);
    const labelsRef = useRef([]);

    // Initialize the map
    useEffect(() => {
        map.current = tt.map({
            key: 'uNSdjqZ8dnSQJcmSSCqsZfUrQLKQQ9l6', // Replace with your actual TomTom API key.
            container: mapElement.current,
            center: cityCoordinates, // [longitude, latitude]
            zoom: 12,
        });

        map.current.on('load', () => {
            setIsMapLoaded(true);
            console.log("Map style loaded");
            attemptToAddPolyline();
        });

        return () => {
            if (map.current) {
                map.current.remove();
            }
        };
    }, [cityCoordinates]);

    // Retry logic to check if the style is loaded
    useEffect(() => {
        if (!isMapLoaded && retryCount < 5) {
            const timeout = setTimeout(() => {
                setRetryCount(prev => prev + 1);
                console.log("Retrying to load the map style...");
                map.current?.resize();  // Force a resize to check if the map can load the style
            }, 1000);

            return () => clearTimeout(timeout); // Cleanup timeout on unmount or change
        }
    }, [isMapLoaded, retryCount]);

    // Add markers and polyline once the map is fully loaded
    useEffect(() => {
        if (!map.current || !isMapLoaded || !route || route.length === 0) return;

        // Remove previous markers and polyline if any
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        labelsRef.current.forEach(label => label.remove());
        labelsRef.current = [];

        // Add markers
        route.forEach((place, index) => {
            if (place.latitude && place.longitude) {
                const markerColor = place.id === route[0].id ? 'green' : 'red';
                const marker = new tt.Marker({ color: markerColor })
                    .setLngLat([Number(place.longitude), Number(place.latitude)])
                    .addTo(map.current);

                markersRef.current.push(marker);
            }
        });

        console.log("Place markers added");

        // Create polyline
        const coordinates = route.map(place => [Number(place.longitude), Number(place.latitude)]);
        const geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: coordinates,
            },
        };

        // Add polyline layer if map style is fully loaded
        if (map.current.getLayer('routeLayer')) {
            map.current.removeLayer('routeLayer');
        }
        if (map.current.getSource('routeSource')) {
            map.current.removeSource('routeSource');
        }

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
                'line-color': '#0e54f1', // Blue polyline
                'line-width': 6,
            },
        });

        console.log("Polyline layer added");

        // Fit the map bounds to the polyline
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

        // Add numbered labels along the polyline
        for (let i = 0; i < coordinates.length - 1; i++) {
            const startCoord = coordinates[i];
            const endCoord = coordinates[i + 1];
            const midpoint = [
                (startCoord[0] + endCoord[0]) / 2,
                (startCoord[1] + endCoord[1]) / 2,
            ];

            const labelDiv = document.createElement('div');
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
    }, [route, isMapLoaded]);

    // Retry polyline addition if style loading fails or polyline doesn't show
    const attemptToAddPolyline = () => {
        if (!isMapLoaded) {
            console.log("Map style not loaded, retrying...");
            setTimeout(() => {
                if (retryCount < 5) {
                    setRetryCount(prev => prev + 1);
                    attemptToAddPolyline();
                } else {
                    console.error("Failed to load map style after multiple attempts.");
                }
            }, 1000);
        } else {
            // Add polyline logic if map style is loaded
            console.log("Attempting to add polyline...");
            const coordinates = route.map(place => [Number(place.longitude), Number(place.latitude)]);
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
                },
                paint: {
                    'line-color': '#0e54f1',
                    'line-width': 6,
                },
            });
        }
    };

    return <div ref={mapElement} style={{ width: '100%', height: '100%' }}></div>;
};

export default MapDisplayOptimized;

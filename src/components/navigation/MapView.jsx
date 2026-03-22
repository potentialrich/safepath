import React, { useRef, useEffect, useState } from 'react';
import { GoogleMap, Polyline, Marker, InfoWindow } from '@react-google-maps/api';

// Hardcoded custom map style matching the existing design
const darkModeStyle = [
  { elementType: "geometry", stylers: [{ color: "#10082B" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#20104D" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#E2F1FF" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#00D4FF" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#FFD2E8" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#13233F" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#00F0FF" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#20104D" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#13233F" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#E2F1FF" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#FF4A9A" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#10082B" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#FFFFFF" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#13233F" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#FFB800" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0B162C" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#00D4FF" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#10082B" }],
  },
  {
    featureType: "poi",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "transit",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }]
  }
];

// Helper to generate SVG data URIs for map icons
const getIconDataUri = (type, method) => {
    let color = type === 'HIGH_RISK' ? '#EB5757' : (type === 'WARNING' ? '#F59E0B' : '#FCD34D');
    
    // Override colors for certain methods exactly as requested
    const m = method.toUpperCase();
    if (m === 'GUN') color = '#EB5757';       // Red
    if (m === 'KNIFE') color = '#F97316';     // Orange
    
    let path = ``;
    if (m === 'GUN') {
        path = `<path d="M19 8H7C6.4 8 6 8.4 6 9v2H4c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h2v-4h2v5c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-4h5c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/>`;
    } else if (m === 'KNIFE' || m.includes('STAB')) {
        path = `<path d="M2.2 21.8c-.3-.3-.3-.8 0-1.1l7.6-7.6l2.1 2.1l-7.6 7.6c-.3.3-.8.3-1.1 0l-1-1zm19.6-19.6c-.3-.3-1 .4-2.1 1.5l-6.4 6.4l2.1 2.1l6.4-6.4c1.1-1.1 1.8-1.8 1.5-2.1l-1.5-1.5z"/>`;
    } else if (m.includes('ROBBERY') || m.includes('MASK')) {
        // Ski Mask
        path = `<path d="M12 2C6.48 2 2 6.48 2 12v6c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4v-6c0-5.52-4.48-10-10-10zm-4 10c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2zm8 0c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2zm-4 6c-2.21 0-4-1.79-4-4h8c0 2.21-1.79 4-4 4z"/>`;
    } else {
        // Generic warning circle
        path = `<circle cx="12" cy="12" r="10" />`;
    }

    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="#10082B" stroke-width="1">${path}</svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgString);
};

// eslint-disable-next-line react/prop-types
const MapView = ({ onLoad, center, zoom, safeRoute, standardRoute, dangerNodes, isNavigating, userLocation }) => {
    const mapRef = useRef(null);
    const [activeMarker, setActiveMarker] = useState(null);

    const handleLoad = (map) => {
        mapRef.current = map;
        if (onLoad) onLoad(map);
    };

    // Calculate bounding box for routes
    useEffect(() => {
        if (!mapRef.current || !window.google) return;
        
        let pathBounds = new window.google.maps.LatLngBounds();
        let hasPoints = false;

        const addPointsToBounds = (route) => {
            if (route && route.length > 0) {
                route.forEach(point => pathBounds.extend(point));
                hasPoints = true;
            }
        };

        if (!isNavigating) {
            addPointsToBounds(safeRoute);
            addPointsToBounds(standardRoute);
            
            if (hasPoints) {
                mapRef.current.fitBounds(pathBounds, { padding: 80 });
            }
        }
    }, [safeRoute, standardRoute, isNavigating]);

    return (
        <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={zoom}
            onLoad={handleLoad}
            options={{
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                gestureHandling: 'greedy',
                tilt: isNavigating ? 65 : 0, // Tilt for 3D navigation
                heading: isNavigating && userLocation ? userLocation.heading : 0,
            }}
        >
            {/* Standard/Fastest Route (Background) */}
            {standardRoute && standardRoute.length > 0 && !isNavigating && (
                <Polyline
                    path={standardRoute}
                    options={{
                        strokeColor: '#FF4A9A', // Pink color to distinguish from the cyan SafePath
                        strokeOpacity: 0.5,
                        strokeWeight: 4,
                        clickable: false,
                        zIndex: 1,
                    }}
                />
            )}

            {/* Main Safe Route (Foreground) */}
            {safeRoute && safeRoute.length > 0 && (
                <Polyline
                    path={safeRoute}
                    options={{
                        strokeColor: '#00D4FF', // Cyan for safe
                        strokeOpacity: 1,
                        strokeWeight: isNavigating ? 10 : 6,
                        clickable: false,
                        zIndex: 10,
                        geodesic: true,
                    }}
                />
            )}

            {/* Danger Nodes */}
            {dangerNodes && dangerNodes.map((node, index) => (
                <Marker
                    key={`danger-${index}`}
                    position={{ lat: node.lat, lng: node.lng }}
                    icon={{
                        url: getIconDataUri(node.type, node.method),
                        scaledSize: new window.google.maps.Size(20, 20),
                        anchor: new window.google.maps.Point(10, 10)
                    }}
                    zIndex={5}
                    onClick={() => setActiveMarker(node)}
                />
            ))}

            {/* Danger Node Info Window */}
            {activeMarker && (
                <InfoWindow
                    position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
                    onCloseClick={() => setActiveMarker(null)}
                    options={{ pixelOffset: new window.google.maps.Size(0, -10) }}
                >
                    <div style={{ padding: '8px', color: '#10082B', minWidth: '150px' }}>
                        <h3 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', color: activeMarker.type === 'HIGH_RISK' ? '#EB5757' : '#D97706' }}>
                            {activeMarker.type === 'HIGH_RISK' ? 'High Risk Incident' : 'Warning'}
                        </h3>
                        <p style={{ fontSize: '13px', textTransform: 'capitalize', fontWeight: 'bold', marginBottom: '2px' }}>
                            {activeMarker.offense.toLowerCase()}
                        </p>
                        <p style={{ fontSize: '11px', color: '#4B5563', textTransform: 'capitalize' }}>
                            Method: {activeMarker.method.toLowerCase()}
                        </p>
                    </div>
                </InfoWindow>
            )}

            {/* User Location Marker (for Live Navigation) */}
            {isNavigating && userLocation && (
                <Marker
                    position={{ lat: userLocation.lat, lng: userLocation.lng }}
                    icon={{
                        path: window.google?.maps?.SymbolPath?.FORWARD_CLOSED_ARROW || 1,
                        scale: 8,
                        fillColor: '#FF4A9A',
                        fillOpacity: 1,
                        strokeColor: '#FFFFFF',
                        strokeWeight: 2,
                        rotation: userLocation.heading || 0
                    }}
                    zIndex={100}
                />
            )}
        </GoogleMap>
    );
};

export default MapView;

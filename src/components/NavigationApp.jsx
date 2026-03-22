import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';

// New Architecture Imports
import { routingService } from '../services/api';
import { useLocationStore } from '../stores/useLocationStore';
import { calculateHeading } from '../services/location';

// Sub-components
import MapView from './navigation/MapView';
import SearchPanel from './navigation/SearchPanel';
import RouteResults from './navigation/RouteResults';
import NavigationOverlay from './navigation/NavigationOverlay';
import AntLogo from './AntLogo';

// Libraries needed for Google Maps Places API
const GOOGLE_LIBRARIES = ['places', 'geometry'];

const NavigationApp = () => {
    const navigate = useNavigate();
    
    // Global Location State via Zustand
    const userLocation = useLocationStore(state => state.userLocation);
    const isTrackingActive = useLocationStore(state => state.isTrackingActive);
    const startTracking = useLocationStore(state => state.startTracking);
    const stopTracking = useLocationStore(state => state.stopTracking);

    // Component State
    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({ lat: 38.8977, lng: -77.0365 }); // Default DC
    const [zoom, setZoom] = useState(13);
    
    const [safeRoute, setSafeRoute] = useState([]);
    const [standardRoute, setStandardRoute] = useState([]);
    const [dangerNodes, setDangerNodes] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [routeEndpoints, setRouteEndpoints] = useState(null); // { from, to }
    
    const [isCalculating, setIsCalculating] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const dashboardRef = useRef(null);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: GOOGLE_LIBRARIES
    });

    // GSAP animations on load
    useEffect(() => {
        if (dashboardRef.current) {
            gsap.from(dashboardRef.current, {
                x: -50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        }
    }, [isLoaded]);

    // 3D Navigation Camera update loop
    useEffect(() => {
        if (isTrackingActive && userLocation && map) {
            // Update center
            map.setCenter({ lat: userLocation.lat, lng: userLocation.lng });
            
            // Adjust zoom dynamically
            map.setZoom(19); 
            
            // Smoothly animate the map heading
            if (userLocation.heading !== null && userLocation.heading !== undefined) {
                gsap.to(map, {
                    heading: userLocation.heading,
                    duration: 1,
                    ease: "power2.out",
                    onUpdate: () => map.setHeading(map.heading)
                });
            } else {
                // If no real compass heading, guess heading based on route progression
                if (safeRoute.length > 1) {
                    const h = calculateHeading(userLocation.lat, userLocation.lng, safeRoute[1].lat, safeRoute[1].lng);
                    map.setHeading(h);
                }
            }
        }
    }, [userLocation, isTrackingActive, map, safeRoute]);

    const handleCalculateRoute = async (from, to) => {
        setIsCalculating(true);
        setApiError(null);
        setSafeRoute([]);
        setStandardRoute([]);
        setAnalysis(null);
        setDangerNodes([]);
        setRouteEndpoints({ from, to });
        
        try {
            const data = await routingService.calculateRoute(from.lat, from.lng, to.lat, to.lng);
            
            // The API returns [[lat, lng], [lat, lng]] in data.routes.safepath
            const parsePath = (path) => path.map(p => ({ lat: p[0], lng: p[1] }));
            
            setSafeRoute(parsePath(data.routes.safepath));
            setStandardRoute(parsePath(data.routes.standard));
            setDangerNodes(data.analysis.danger_nodes || []);
            setAnalysis({
                totalDodged: data.analysis.total_incidents_avoided,
                severeDodged: data.analysis.severe_incidents_avoided,
                safetyScore: data.analysis.safety_score || 100,
                costSaved: 0 // placeholder
            });
            
            // Keep sidebar open on desktop, close on mobile to show map
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            }
        } catch (error) {
            console.error(error);
            setApiError(error.message || "Cannot reach navigation server");
        } finally {
            setIsCalculating(false);
        }
    };

    const handleStartNavigation = () => {
        setIsSidebarOpen(false);
        startTracking(null, (err) => {
             alert(err.message || "GPS connection lost. Navigation paused.");
        });
    };

    const handleEndNavigation = () => {
        stopTracking();
        setIsSidebarOpen(true);
        // Reset tilt and zoom
        if (map) {
            map.setTilt(0);
            map.setHeading(0);
            map.setZoom(14);
        }
    };

    if (loadError) return <div className="min-h-screen flex text-white bg-background items-center justify-center font-heading">Error loading Google Maps. Check API Key.</div>;
    if (!isLoaded) return <div className="min-h-screen flex text-white bg-background items-center justify-center font-heading">Initializing Navigation Core...</div>;

    return (
        <div className="h-screen w-full flex bg-background overflow-hidden relative font-sans">
            {/* Navigating Overlay */}
            {isTrackingActive && (
                <NavigationOverlay onEndNavigation={handleEndNavigation} />
            )}

            {/* Left Sidebar Panel */}
            <div 
                ref={dashboardRef}
                className={`
                    absolute lg:relative z-40 h-full w-full lg:w-[450px] bg-surface/95 lg:bg-surface/100 backdrop-blur-xl border-t lg:border-t-0 lg:border-r border-border-subtle flex flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${isSidebarOpen || (!isTrackingActive && !analysis) ? 'translate-y-0 lg:translate-x-0 bottom-0' : 'translate-y-[150%] lg:-translate-x-[150%] bottom-0'}
                    rounded-t-3xl lg:rounded-none
                `}
            >
                {/* Mobile Drag Handle Indicator (Clickable to collapse) */}
                <div
                    className="w-full flex justify-center pt-3 pb-1 lg:hidden shrink-0 cursor-pointer"
                    onClick={() => analysis ? setIsSidebarOpen(!isSidebarOpen) : null}
                >
                    <div className="w-12 h-1.5 bg-text-muted/40 rounded-full hover:bg-text-muted transition-colors"></div>
                </div>

                {/* Header */}
                <div className="p-6 pb-2 flex items-center justify-between z-10 border-b border-border-subtle lg:border-0 shrink-0">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <button
                            className="w-10 h-10 rounded-full bg-card text-text-muted flex items-center justify-center hover:bg-white/10 transition-colors shadow-md lg:hidden"
                            aria-label="Go back"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        </button>
                        <AntLogo variant="minimal" className="w-8 h-8 lg:w-6 lg:h-6 text-primary group-hover:drop-shadow-[0_0_8px_rgba(255,74,154,0.8)] transition-all" />
                        <h1 className="text-2xl lg:text-xl font-heading font-black tracking-tight text-text-main m-0 leading-none">SafePath <span className="text-accent font-medium text-lg italic hidden sm:inline">System</span></h1>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                    <h1 className="text-3xl font-heading font-bold mb-6 tracking-tight text-text-main lg:block hidden">Find your <span className="text-primary">Route</span></h1>
                    
                    <SearchPanel 
                        map={map}
                        onCalculateRoute={handleCalculateRoute}
                        isCalculating={isCalculating}
                        apiError={apiError}
                    />

                    {analysis && !isTrackingActive && (
                        <RouteResults 
                            analysis={analysis} 
                            safeRoute={safeRoute} 
                            onStartNavigation={handleStartNavigation}
                            origin={routeEndpoints?.from}
                            destination={routeEndpoints?.to}
                        />
                    )}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 h-full relative z-0">
                {/* Map View Extracted Component */}
                <MapView 
                    onLoad={setMap}
                    center={center}
                    zoom={zoom}
                    safeRoute={safeRoute}
                    standardRoute={standardRoute}
                    dangerNodes={dangerNodes}
                    isNavigating={isTrackingActive}
                    userLocation={userLocation}
                />
            </div>
        </div>
    );
};

export default NavigationApp;

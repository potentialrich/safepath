import React, { useState, useEffect, useMemo } from 'react';
import AntLogo from '../AntLogo';
import Badge from '../ui/Badge';
import { calculateDistance } from '../../services/location';
import { buildExportUrls } from '../../services/routeExport';

// eslint-disable-next-line react/prop-types
const RouteResults = ({ analysis, safeRoute, onStartNavigation, origin, destination }) => {
    const [distanceFromStart, setDistanceFromStart] = useState(Infinity);

    useEffect(() => {
        // Find current physical location to see if user is close enough to start
        if (navigator.geolocation && safeRoute?.length > 0) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const startLat = safeRoute[0].lat;
                const startLng = safeRoute[0].lng;
                const dist = calculateDistance(pos.coords.latitude, pos.coords.longitude, startLat, startLng);
                setDistanceFromStart(dist);
            });
        }
    }, [safeRoute]);

    // Build export URLs only when route + endpoints are available
    const exportUrls = useMemo(() => {
        if (!safeRoute?.length || !origin || !destination) return null;
        return buildExportUrls(safeRoute, origin, destination);
    }, [safeRoute, origin, destination]);

    const isCloseEnough = distanceFromStart < 150; // Enable if within 150 meters

    return (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-heading font-bold mb-4 text-text-main">Live Route Analysis</h3>

            <div className="space-y-4">
                {/* SafePath Route Card */}
                <div className="bg-card/80 border border-accent/30 rounded-xl p-4 flex items-start gap-4 shadow-[0_0_15px_rgba(0,212,255,0.1)] relative overflow-hidden backdrop-blur-md">
                    <AntLogo className="absolute -right-4 -bottom-4 w-24 h-24 text-accent opacity-[0.05] -rotate-12" />
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1 relative z-10 border border-accent/50">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <div className="relative z-10 max-w-full">
                        <h4 className="font-bold text-text-main text-lg flex items-center flex-wrap gap-2">
                            SafePath Route
                            <Badge variant="info">Recommended</Badge>
                        </h4>
                        <p className="text-sm text-text-subtle mt-1">Colony bypassed <span className="text-accent font-semibold">{analysis.totalDodged}</span> high-risk zones using active algorithms.</p>
                    </div>
                </div>

                {/* Safety Score Card */}
                <div className="bg-card/50 border border-primary/30 rounded-xl p-4 flex items-center gap-4 backdrop-blur-md">
                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-border-subtle"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                className={analysis.safetyScore > 80 ? "text-accent" : analysis.safetyScore > 50 ? "text-yellow-500" : "text-danger"}
                                strokeDasharray={`${analysis.safetyScore}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex items-center justify-center text-lg font-bold text-text-main">
                            {analysis.safetyScore}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-text-main text-lg flex items-center gap-2">
                            Safety Score
                            <span className="text-[10px] uppercase font-bold text-text-muted bg-surface/50 border border-border-subtle px-2 py-0.5 rounded-md tracking-wider">Default Route</span>
                        </h4>
                        <p className="text-sm text-text-subtle mt-1">Shows how unsafe the standard route is without SafePath.</p>
                    </div>
                </div>

                {/* Start Navigation Action */}
                {isCloseEnough ? (
                    <button
                        onClick={onStartNavigation}
                        className="w-full mt-4 bg-gradient-to-r from-accent to-[#0B59AA] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] transition-all flex items-center justify-center gap-2 group"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        Start Live Navigation
                    </button>
                ) : (
                    <div className="w-full mt-4 bg-card/80 border border-border-subtle text-text-subtle font-semibold py-4 rounded-xl flex items-center justify-center gap-2 text-center px-4 leading-tight">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        Move to Starting Point to Navigate {distanceFromStart < Infinity && `(${Math.round(distanceFromStart)}m away)`}
                    </div>
                )}

                {/* ── Open in Navigation App ── */}
                {exportUrls && (
                    <div className="mt-2 pt-4 border-t border-border-subtle">
                        <p className="text-xs text-text-muted mb-3 flex items-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            Safe junction points sent to preserve your route
                        </p>
                        <div className="flex justify-center">
                            {/* Google Maps */}
                            <a
                                href={exportUrls.googleMaps}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-3 bg-card/60 border border-border-subtle rounded-xl p-4 hover:border-white/20 hover:bg-white/5 transition-all group"
                            >
                                <svg viewBox="0 0 48 48" className="w-8 h-8 shrink-0" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="48" height="48" rx="10" fill="#fff"/>
                                    <path fill="#4285F4" d="M24 8C17.37 8 12 13.37 12 20c0 9 12 22 12 22s12-13 12-22c0-6.63-5.37-12-12-12z"/>
                                    <path fill="#34A853" d="M24 8C17.37 8 12 13.37 12 20c0 0.84.09 1.66.25 2.46L24 8z" opacity="0.3"/>
                                    <path fill="#FBBC05" d="M12 20c0 4.55 2.54 8.51 6.28 10.57L24 8c-6.63 0-12 5.37-12 12z" opacity="0.4"/>
                                    <circle cx="24" cy="20" r="4.5" fill="white"/>
                                </svg>
                                <span className="text-sm font-semibold text-text-subtle group-hover:text-text-main transition-colors">Open in Google Maps</span>
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RouteResults;


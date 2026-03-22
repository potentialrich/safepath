/**
 * routeExport.js
 * 
 * Extracts key "junction" waypoints from the SafePath route by detecting
 * significant bearing changes. This preserves the safe street decisions
 * made by the ACO algorithm without random downsampling.
 */

/**
 * Calculate compass bearing from one point to the next (in degrees 0-360)
 */
const getBearing = (lat1, lng1, lat2, lng2) => {
    const toRad = (d) => (d * Math.PI) / 180;
    const toDeg = (r) => (r * 180) / Math.PI;

    const dLng = toRad(lng2 - lng1);
    const y = Math.sin(dLng) * Math.cos(toRad(lat2));
    const x =
        Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
        Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);

    return (toDeg(Math.atan2(y, x)) + 360) % 360;
};

/**
 * Angular difference between two bearings (0-180)
 */
const bearingDiff = (b1, b2) => {
    const d = Math.abs(b1 - b2) % 360;
    return d > 180 ? 360 - d : d;
};

/**
 * Extract key junction waypoints from a route.
 * 
 * Strategy: Walk the route and detect points where the heading changes
 * significantly (>= threshold degrees). These are the "turn decisions" 
 * the ACO made to avoid danger zones. We keep those and discard straight-line 
 * intermediate points.
 * 
 * @param {Array<{lat, lng}>} routePoints - Full SafePath route
 * @param {number} maxWaypoints - Max intermediate waypoints (excl. start/end)
 * @param {number} thresholdDeg - Min bearing change to count as a junction
 * @returns {Array<{lat, lng}>} - Key junction points (intermediate only, no start/end)
 */
export const extractJunctionWaypoints = (routePoints, maxWaypoints = 8, thresholdDeg = 20) => {
    if (!routePoints || routePoints.length < 3) return [];

    const junctions = [];

    // Walk from index 1 to n-2 (skip start and end)
    for (let i = 1; i < routePoints.length - 1; i++) {
        const inBearing  = getBearing(routePoints[i - 1].lat, routePoints[i - 1].lng, routePoints[i].lat, routePoints[i].lng);
        const outBearing = getBearing(routePoints[i].lat, routePoints[i].lng, routePoints[i + 1].lat, routePoints[i + 1].lng);
        const change     = bearingDiff(inBearing, outBearing);

        if (change >= thresholdDeg) {
            junctions.push({ ...routePoints[i], bearingChange: change });
        }
    }

    // If we have more junctions than the limit, prioritise the sharpest turns
    // (they represent the most deliberate route decisions)
    if (junctions.length > maxWaypoints) {
        junctions.sort((a, b) => b.bearingChange - a.bearingChange);
        // Take top N but re-sort by position in route so the URL is in order
        const top = junctions.slice(0, maxWaypoints);
        top.sort((a, b) => {
            const ai = routePoints.findIndex(p => p.lat === a.lat && p.lng === a.lng);
            const bi = routePoints.findIndex(p => p.lat === b.lat && p.lng === b.lng);
            return ai - bi;
        });
        return top;
    }

    return junctions;
};

/**
 * Build a Google Maps directions URL.
 * Uses walking mode since SafePath is pedestrian-focused.
 */
export const buildGoogleMapsUrl = (origin, destination, waypoints) => {
    const fmt = (p) => `${p.lat},${p.lng}`;
    const base = 'https://www.google.com/maps/dir/?api=1';
    const params = new URLSearchParams({
        origin: fmt(origin),
        destination: fmt(destination),
        travelmode: 'walking',
    });

    if (waypoints && waypoints.length > 0) {
        params.set('waypoints', waypoints.map(fmt).join('|'));
    }

    return `${base}&${params.toString()}`;
};


/**
 * One-shot helper: given the full safe route + raw origin/destination,
 * return export URLs.
 */
export const buildExportUrls = (safeRoute, origin, destination) => {
    const waypoints = extractJunctionWaypoints(safeRoute, 8);
    return {
        googleMaps: buildGoogleMapsUrl(origin, destination, waypoints),
    };
};

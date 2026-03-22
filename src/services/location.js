/**
 * Location Utils
 * Wraps Google Maps geometry calculations to keep components clean
 */

export const calculateHeading = (fromLat, fromLng, toLat, toLng) => {
    if (!window.google?.maps?.geometry?.spherical) return 0;
    
    return window.google.maps.geometry.spherical.computeHeading(
        new window.google.maps.LatLng(fromLat, fromLng),
        new window.google.maps.LatLng(toLat, toLng)
    );
};

export const calculateDistance = (fromLat, fromLng, toLat, toLng) => {
    if (!window.google?.maps?.geometry?.spherical) return Infinity;
    
    return window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(fromLat, fromLng),
        new window.google.maps.LatLng(toLat, toLng)
    );
};

export const reverseGeocode = async (lat, lng) => {
    if (!window.google?.maps?.Geocoder) throw new Error("Geocoder not loaded");
    
    const geocoder = new window.google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
                // Return just the first part of the address (e.g., "1600 Pennsylvania Avenue NW")
                resolve(results[0].formatted_address.split(',')[0]);
            } else {
                reject(new Error("Reverse geocoding failed"));
            }
        });
    });
};

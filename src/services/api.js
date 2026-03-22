/**
 * Central API Service Layer
 * Abstracts away fetch calls, environment URLs, and error handling.
 * Makes it trivial to add new endpoints (user profiles, saved routes, reporting).
 */

const getBaseUrl = () => {
    // Determine the environment
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // Fallback for local development or device testing (requires proper capacitor config)
    return `http://${window.location.hostname}:8000`;
};

const BASE_URL = getBaseUrl();

/**
 * Generic fetch wrapper with error handling and JSON parsing
 */
const fetchAPI = async (endpoint, options = {}) => {
    try {
        const url = `${BASE_URL}${endpoint}`;
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        const response = await fetch(url, config);
        
        // Handle normal non-okay responses
        if (!response.ok) {
            let errorMsg = 'An unknown API error occurred';
            try {
                const data = await response.json();
                errorMsg = data.detail || data.message || errorMsg;
            } catch (e) {
                // Not JSON returned
                errorMsg = response.statusText;
            }
            throw new Error(`API Error (${response.status}): ${errorMsg}`);
        }

        return await response.json();
    } catch (error) {
        // Network errors or thrown aborts
        console.error(`[API] Failed to fetch ${endpoint}:`, error);
        throw error;
    }
};

/**
 * Routing Service
 */
export const routingService = {
    /**
     * Calculates standard and safe routes between origin and destination
     */
    calculateRoute: async (startLat, startLng, endLat, endLng) => {
        return fetchAPI('/calculate-route', {
            method: 'POST',
            body: JSON.stringify({
                start_lat: startLat,
                start_lng: startLng,
                end_lat: endLat,
                end_lng: endLng
            }),
        });
    },

    /**
     * Checks if the API mapping engine is healthy
     */
    checkHealth: async () => {
        return fetchAPI('/health', { method: 'GET' });
    }
};

// Ready for future expansions
export const userService = {
    // getProfile: async (id) => fetchAPI(`/api/v1/users/${id}`),
    // updatePreferences: async (prefs) => fetchAPI('/api/v1/users/me/prefs', { method: 'PUT', body: JSON.stringify(prefs) }),
};

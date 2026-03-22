import { create } from 'zustand';

export const useLocationStore = create((set, get) => ({
    // User GPS tracking
    userLocation: null,
    isTrackingActive: false,
    watchId: null,
    
    // Set explicit location (e.g., from search input or manual ping)
    setUserLocation: (lat, lng, address = null) => 
        set({ userLocation: { lat, lng, address } }),

    // Start live GPS tracking (abstracted out from NavigationApp component)
    startTracking: (onSuccess, onError) => {
        if (get().isTrackingActive) return;
        
        if (!navigator.geolocation) {
            onError?.(new Error("Geolocation not supported by this browser."));
            return;
        }

        const id = navigator.geolocation.watchPosition(
            (position) => {
                set({
                    userLocation: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        heading: position.coords.heading,
                        speed: position.coords.speed,
                    }
                });
                onSuccess?.(position);
            },
            (error) => {
                console.error("GPS Tracking Error:", error);
                onError?.(error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            }
        );
        
        set({ isTrackingActive: true, watchId: id });
    },

    stopTracking: () => {
        const { watchId } = get();
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
        }
        set({ isTrackingActive: false, watchId: null });
    },
    
    // Future expansion: buddy tracking
    friendsLocations: [],
    updateFriendLocation: (friendId, locationData) => set((state) => ({
        friendsLocations: {
            ...state.friendsLocations,
            [friendId]: locationData
        }
    })),
}));

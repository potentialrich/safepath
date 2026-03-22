import { useRef, useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { reverseGeocode } from '../../services/location';
import Button from '../ui/Button';

// eslint-disable-next-line react/prop-types
const SearchPanel = ({ map, onCalculateRoute, isCalculating, apiError }) => {
    const originAutocompleteRef = useRef();
    const destinationRef = useRef();
    const [isFetchingGPS, setIsFetchingGPS] = useState(false);
    
    const [originValue, setOriginValue] = useState('');
    const [fromLoc, setFromLoc] = useState(null);
    const [toLoc, setToLoc] = useState(null);

    const handleOriginPlaceChanged = () => {
        if (!originAutocompleteRef.current) return;
        const place = originAutocompleteRef.current.getPlace();
        if (place && place.geometry) {
            setOriginValue(place.formatted_address || place.name);
            setFromLoc({
                address: place.formatted_address || place.name,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            });
        }
    };

    const handleDestPlaceChanged = () => {
        if (!destinationRef.current) return;
        const place = destinationRef.current.getPlace();
        if (place && place.geometry) {
            setToLoc({
                address: place.formatted_address || place.name,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            });
        }
    };

    const handleFetchCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        
        setIsFetchingGPS(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                try {
                    const address = await reverseGeocode(lat, lng);
                    setOriginValue(`Current Location: ${address}`);
                    setFromLoc({ address, lat, lng });
                } catch (e) {
                    console.error("Geocoding failed", e);
                    // Fallback: use raw coordinates if reverse geocoding fails
                    const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                    setOriginValue(`Current Location: ${fallback}`);
                    setFromLoc({ address: fallback, lat, lng });
                } finally {
                    setIsFetchingGPS(false);
                }
            },
            (error) => {
                console.error("GPS Error:", error);
                alert('Could not get your location. Please check your browser permissions.');
                setIsFetchingGPS(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (fromLoc && toLoc) {
            onCalculateRoute(fromLoc, toLoc);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative">
            {/* Connecting Line between inputs */}
            <div className="absolute left-[23px] top-[30px] h-[60px] w-[2px] bg-border-subtle z-0 hidden sm:block"></div>

            {/* From Input */}
            <div className="relative z-20 flex items-center gap-4">
                <div className="w-8 h-8 bg-card border-2 border-border-subtle rounded-full shadow-inner flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-text-muted"></div>
                </div>
                <div className="flex-grow bg-card rounded-xl flex items-center focus-within:ring-2 focus-within:ring-accent/40 focus-within:bg-[#1C2E4A] transition-all overflow-hidden border border-border-subtle relative">
                    <Autocomplete
                        onLoad={ref => originAutocompleteRef.current = ref}
                        onPlaceChanged={handleOriginPlaceChanged}
                        className="w-full"
                    >
                        <input
                            type="text"
                            value={originValue}
                            onChange={e => setOriginValue(e.target.value)}
                            className="w-full bg-transparent border-none outline-none px-4 py-3 pr-12 text-base font-medium text-text-main placeholder:text-text-muted/40"
                            placeholder="Current or any location"
                        />
                    </Autocomplete>

                    {/* GPS Button */}
                    <button
                        type="button"
                        onClick={handleFetchCurrentLocation}
                        title="Use my current location"
                        disabled={isFetchingGPS}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isFetchingGPS ? 'text-accent animate-spin' : 'text-text-muted/50 hover:text-accent hover:bg-white/5'}`}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <circle cx="12" cy="12" r="3"></circle>
                            <line x1="12" y1="2" x2="12" y2="4"></line>
                            <line x1="12" y1="20" x2="12" y2="22"></line>
                            <line x1="20" y1="12" x2="22" y2="12"></line>
                            <line x1="2" y1="12" x2="4" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>

            {/* To Input */}
            <div className="relative z-10 flex items-center gap-4">
                <div className="w-8 h-8 bg-card border-2 border-overlay shadow-sm flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                </div>
                <div className="flex-grow bg-card rounded-xl flex items-center focus-within:ring-2 focus-within:ring-accent/40 focus-within:bg-[#1C2E4A] transition-all overflow-hidden border border-border-subtle">
                    <Autocomplete
                        onLoad={ref => destinationRef.current = ref}
                        onPlaceChanged={handleDestPlaceChanged}
                        className="w-full"
                        options={{ bounds: map?.getBounds(), strictBounds: false }}
                    >
                        <input
                            type="text"
                            className="w-full bg-transparent border-none outline-none px-4 py-3 text-base font-medium text-text-main placeholder:text-text-muted/40"
                            placeholder="Destination"
                            required
                        />
                    </Autocomplete>
                </div>
            </div>

            {apiError && (
                <div className="text-primary text-sm mt-2 bg-primary/10 p-3 rounded-lg border border-primary/30">
                    ⚠️ {apiError}
                </div>
            )}

            <Button
                type="submit"
                variant="primary"
                disabled={isCalculating}
                fullWidth
                className="mt-4 py-4 text-lg"
            >
                {isCalculating ? 'Simulating Colony Math...' : 'Calculate Safe Route'}
            </Button>
        </form>
    );
};

export default SearchPanel;

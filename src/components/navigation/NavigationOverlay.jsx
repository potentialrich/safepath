import React from 'react';
import Button from '../ui/Button';

// eslint-disable-next-line react/prop-types
const NavigationOverlay = ({ onEndNavigation }) => {
    return (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-500">
            <div className="bg-overlay/90 backdrop-blur border border-accent/30 px-6 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent animate-ping"></div>
                <span className="font-bold text-text-main tracking-widest uppercase text-sm">Navigating</span>
            </div>

            <Button
                variant="danger"
                onClick={onEndNavigation}
                className="px-8"
            >
                End Walkthrough
            </Button>
        </div>
    );
};

export default NavigationOverlay;

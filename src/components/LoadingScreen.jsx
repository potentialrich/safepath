import React from 'react';
import AntLogo from './AntLogo';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#040B16] z-50">
            {/* Unified Bold Red Ant Logo */}
            <div className="relative animate-[bounce_2s_infinite]">
                <AntLogo className="w-32 h-32 text-[#E63B2E] drop-shadow-[0_0_20px_rgba(230,59,46,0.6)]" />
            </div>

            <div className="mt-8 flex flex-col items-center">
                <span className="font-heading font-bold text-[#E2F1FF] text-xl tracking-[0.2em] mb-4">DOWNLOADING MAP DATA</span>
                {/* Bouncing dots */}
                <div className="flex gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#E63B2E] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 rounded-full bg-[#E63B2E] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 rounded-full bg-[#E63B2E] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;

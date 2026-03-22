import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import gsap from 'gsap';

const MobileAppMockup = () => {
    const mockupRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate the stroke drawing of the safe paths
            gsap.fromTo('.safe-path',
                { strokeDasharray: 1000, strokeDashoffset: 1000 },
                { strokeDashoffset: 0, duration: 4, ease: 'power2.inOut', repeat: -1, repeatDelay: 1 }
            );

            // Pulse nodes
            gsap.to('.secure-node', {
                scale: 1.3,
                opacity: 0.9,
                duration: 1.5,
                yoyo: true,
                repeat: -1,
                stagger: 0.2,
                ease: 'sine.inOut',
                transformOrigin: "center center"
            });

            // Subtle floating animation for the phone
            gsap.to('.phone-frame', {
                y: -15,
                duration: 3,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut'
            });

        }, mockupRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={mockupRef} className="relative w-full h-full min-h-[500px] flex items-center justify-center pt-16 lg:pt-0">
            {/* The Phone Frame */}
            <div className="phone-frame relative w-[280px] h-[560px] sm:w-[320px] sm:h-[640px] bg-[#040B16] rounded-[3rem] border-[8px] border-[#13233F] shadow-[0_20px_60px_-15px_rgba(0,212,255,0.2)] overflow-hidden flex flex-col">

                {/* Dynamic Island / Notch area */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-[#13233F] rounded-b-[1.5rem] z-50"></div>

                {/* App Content Header */}
                <div className="px-6 pt-12 pb-4 bg-gradient-to-b from-[#0B162C] to-[#0A1222] z-40 flex justify-between items-center shadow-lg">
                    <div className="flex flex-col">
                        <span className="font-heading font-medium text-xl text-[#E2F1FF]">SafePath</span>
                        <span className="font-heading text-xs text-[#00D4FF]">Finding best route...</span>
                    </div>
                </div>

                {/* Map Area */}
                <div className="relative flex-1 bg-[#13233F] overflow-hidden">
                    {/* Background Soft Grid */}
                    <div className="absolute inset-0 bg-[#0A1222]">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(226,241,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(226,241,255,0.03)_1px,transparent_1px)] bg-[size:15px_15px]"></div>
                    </div>

                    {/* The SVG Map Routes */}
                    <svg viewBox="0 0 320 400" className="absolute inset-0 w-full h-full z-20 overflow-visible">

                        {/* Base Roads */}
                        <path d="M 40 50 L 150 140 L 280 80" fill="none" stroke="#1C2E4A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M 150 140 L 200 250 L 100 350" fill="none" stroke="#1C2E4A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M 150 140 L 100 220 L 200 350" fill="none" stroke="#1C2E4A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Risky Path (Red/Orange) */}
                        <g>
                            <path d="M 150 140 L 100 220 L 200 350" fill="none" stroke="#EB5757" strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round" strokeLinejoin="round" />
                        </g>

                        {/* Risky Path Warning Icon */}
                        <g transform="translate(85, 210)">
                            <circle cx="12" cy="12" r="10" fill="#040B16" stroke="#EB5757" strokeWidth="2" />
                            <path d="M12 7v5M12 15h.01" stroke="#EB5757" strokeWidth="2" strokeLinecap="round" />
                        </g>

                        {/* Safe Path (Glowing Blue/Green) */}
                        <g>
                            <path className="safe-path" d="M 40 50 L 150 140 L 200 250 L 100 350" fill="none" stroke="#00D4FF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                        </g>

                        {/* Origin and Destination Nodes */}
                        <circle cx="40" cy="50" r="8" fill="#E2F1FF" stroke="#040B16" strokeWidth="3" className="secure-node" />
                        <circle cx="100" cy="350" r="10" fill="#00D4FF" stroke="#040B16" strokeWidth="3" className="secure-node" />
                        <circle cx="150" cy="140" r="5" fill="#E2F1FF" className="secure-node" />
                        <circle cx="200" cy="250" r="5" fill="#E2F1FF" className="secure-node" />

                        {/* Overlay Labels */}
                        <rect x="25" y="20" width="30" height="15" rx="4" fill="#0B162C" stroke="#E2F1FF" strokeWidth="1" />
                        <text x="32" y="31" fill="#E2F1FF" fontSize="8" fontFamily="sans-serif" fontWeight="bold">HOME</text>

                        <rect x="85" y="370" width="30" height="15" rx="4" fill="#00D4FF" />
                        <text x="94" y="381" fill="#040B16" fontSize="8" fontFamily="sans-serif" fontWeight="bold">WORK</text>

                        {/* Status overlays */}
                        <rect x="180" y="220" width="70" height="18" rx="9" fill="#040B16" stroke="#00D4FF" strokeWidth="1" />
                        <circle cx="190" cy="229" r="3" fill="#00D4FF" className="animate-pulse" />
                        <text x="198" y="232" fill="#00D4FF" fontSize="7" fontFamily="sans-serif" fontWeight="bold">SAFE ROUTE</text>
                    </svg>
                </div>

                {/* App Bottom Navigation / Drawer */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#0B162C] rounded-t-[2rem] p-6 z-40 border-t border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                    <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4"></div>
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <div className="text-[#E2F1FF]/60 text-xs mb-1">Estimated Time</div>
                            <div className="text-3xl font-heading font-bold text-[#E2F1FF]">24 <span className="text-lg text-[#E2F1FF]/60 font-normal">min</span></div>
                        </div>
                        <div className="text-right">
                            <div className="text-[#E2F1FF]/60 text-xs mb-1">Safety Index</div>
                            <div className="text-xl font-heading font-bold text-[#00D4FF]">98/100</div>
                        </div>
                    </div>
                    <button className="w-full py-3 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#040B16] font-semibold text-sm rounded-full transition-colors flex items-center justify-center gap-2">
                        Start Navigation
                    </button>
                </div>
            </div>
        </div>
    );
};

// eslint-disable-next-line react/prop-types
const Hero = ({ onLaunchApp }) => {
    const containerRef = useRef(null);
    const isNative = Capacitor.isNativePlatform();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hero-elem', {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power3.out',
                delay: 0.2
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full h-[100dvh] overflow-hidden bg-[#040B16]">
            {/* Background Image - toned down to let mapping shine */}
            <div
                className="absolute inset-0 w-full h-full object-cover opacity-10 bg-center bg-cover"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-c6a4d14cdce8?q=80&w=2000&auto=format&fit=crop")', filter: 'grayscale(100%)' }}
            ></div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#040B16] via-[#040B16]/60 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#040B16] via-[#040B16]/80 to-transparent pointer-events-none"></div>

            {/* Content wrapper */}
            <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 pt-16 md:pt-32 pb-8 md:pb-16 flex flex-col lg:flex-row items-center justify-between">

                {/* Left Side: Typography */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center h-full">
                    <div className="max-w-2xl mt-auto lg:mt-0">
                        {/* Mobile mockup visible only on smaller screens */}
                        <div className="hero-elem w-full flex md:hidden items-center justify-center mb-0 mt-4 transform scale-[0.6] origin-top h-[320px]">
                            <MobileAppMockup />
                        </div>

                        <h1 className="flex flex-col mb-4 md:mb-8">
                            <span className="hero-elem font-heading font-bold text-[#E2F1FF] text-3xl md:text-5xl lg:text-6xl tracking-tighter mb-1 md:mb-2">
                                Navigation meets
                            </span>
                            <span className="hero-elem font-drama italic text-[#00D4FF] text-5xl md:text-7xl lg:text-[110px] leading-[1.1] md:leading-[0.9] tracking-tight drop-shadow-[0_0_30px_rgba(0,212,255,0.3)]">
                                Peace of mind.
                            </span>
                        </h1>

                        <p className="hero-elem font-heading text-base md:text-xl text-[#E2F1FF]/80 mb-6 md:mb-10 max-w-md lg:max-w-lg font-light tracking-wide leading-relaxed">
                            SafePath is a elegantly designed navigation app built to prioritize your personal safety for everyday walking and commuting.
                        </p>

                        <div className="hero-elem flex flex-col md:flex-row gap-6 items-center md:items-start mt-4 w-full md:w-auto">
                            {/* Primary Action */}
                            <button
                                onClick={onLaunchApp}
                                className="group relative overflow-hidden font-heading text-lg font-bold tracking-tight rounded-full px-10 py-5 w-full md:w-auto transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.03] bg-[#FF4A9A] text-white shadow-[0_0_20px_rgba(255,74,154,0.4)]"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    Find your SafePath
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </span>
                                <span className="absolute inset-0 z-0 translate-y-[101%] bg-[#E63B2E] transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-y-0"></span>
                            </button>

                            {/* Secondary Action - Stores */}
                            {!isNative && (
                                <div className="flex flex-col gap-2 items-center md:items-start">
                                    <span className="font-heading text-xs text-white/50 tracking-wider uppercase mb-1 hidden md:block">Or download the app</span>
                                    <div className="flex gap-3">
                                        {/* App Store */}
                                        <div className="flex items-center justify-center gap-2 px-4 py-3 border border-white/20 rounded-xl bg-white/5 hover:bg-white/10 hover:-translate-y-1 transition-all cursor-pointer backdrop-blur-sm shadow-lg group">
                                            <svg viewBox="0 0 384 512" className="w-5 h-5 fill-white group-hover:scale-110 transition-transform">
                                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 24 184.8 8 277.3c-19 119.5 45.4 220 84.4 222.8 19 1.4 39.1-13.3 62.4-13.3 23.3 0 41 12.9 61.4 12.9 44.8 0 77.2-101.4 77.2-101.4-40.4-17.7-61.9-58.4-61.2-102.1zM245.8 91.5c15.8-19.2 26.6-45.9 23.8-72.2-22.1 1.4-50.6 15.6-67.6 35.8-14.7 17.6-27.1 45.2-23.5 70.8 24.3 2.1 49.6-13.5 67.3-34.4z" />
                                            </svg>
                                            <div className="flex flex-col items-start leading-none">
                                                <span className="text-[9px] text-white/70">Download on the</span>
                                                <span className="text-[13px] font-semibold text-white">App Store</span>
                                            </div>
                                        </div>
                                        {/* Google Play */}
                                        <div className="flex items-center justify-center gap-2 px-4 py-3 border border-white/20 rounded-xl bg-white/5 hover:bg-white/10 hover:-translate-y-1 transition-all cursor-pointer backdrop-blur-sm shadow-lg group">
                                            <svg viewBox="0 0 512 512" className="w-5 h-5 fill-white group-hover:scale-110 transition-transform">
                                                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                                            </svg>
                                            <div className="flex flex-col items-start leading-none">
                                                <span className="text-[9px] text-white/70">GET IT ON</span>
                                                <span className="text-[13px] font-semibold text-white">Google Play</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Dynamic Mobile App Animation */}
                <div className="hero-elem w-full lg:w-1/2 h-full hidden md:flex items-center justify-center">
                    <MobileAppMockup />
                </div>

            </div>
        </section>
    );
};

export default Hero;

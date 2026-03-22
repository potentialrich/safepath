import { useState, useRef } from 'react';
import AntLogo from './AntLogo';
const InteractiveCookie = () => {
    const [bites, setBites] = useState(0);
    const maxBites = 4;
    const cookieRef = useRef(null);

    const handleHover = () => {
        if (bites === 0) setBites(1);
    };

    const handleBlockClick = () => {
        if (bites < maxBites) {
            const nextBites = bites + 1;
            setBites(nextBites);

            // Playful boop effect
            if (cookieRef.current) {
                cookieRef.current.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    if (cookieRef.current) cookieRef.current.style.transform = 'scale(1)';
                }, 100);
            }

            // If this click *just* finished the cookie, redirect after 1s so they can read "nom nom"
            if (nextBites === maxBites) {
                setTimeout(() => {
                    window.location.href = "https://buymeacoffee.com";
                }, 1000);
            }
        }
    };

    const handleButtonClick = (e) => {
        e.stopPropagation(); // Prevent block click

        if (bites === maxBites) {
            // Already eaten, just go
            window.location.href = "https://buymeacoffee.com";
            return;
        }

        // Fast biting sequence if not fully eaten
        let currentBites = bites;
        const biteInterval = setInterval(() => {
            currentBites += 1;
            setBites(currentBites);

            // Little jiggle
            if (cookieRef.current) {
                cookieRef.current.style.transform = `scale(${1 - (currentBites * 0.05)}) rotate(${(currentBites % 2 === 0 ? 5 : -5)}deg)`;
            }

            if (currentBites >= maxBites) {
                clearInterval(biteInterval);
                setTimeout(() => {
                    window.location.href = "https://buymeacoffee.com";
                }, 800);
            }
        }, 150);
    };

    // Calculate clip path based on bites (simple polygon trick or just emoji swap, but let's use clip-path on an SVG for realism)
    const getClipPath = () => {
        switch (bites) {
            case 0: return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'; // Full
            case 1: return 'polygon(0% 0%, 80% 0%, 60% 20%, 80% 50%, 100% 40%, 100% 100%, 0% 100%)'; // 1 bite
            case 2: return 'polygon(0% 0%, 60% 0%, 40% 30%, 60% 50%, 40% 70%, 80% 90%, 100% 100%, 0% 100%)'; // 2 bites
            case 3: return 'polygon(0% 0%, 40% 0%, 20% 30%, 40% 60%, 10% 80%, 20% 100%, 0% 100%)'; // 3 bites
            case 4: return 'circle(0% at 50% 50%)'; // Gone
            default: return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
        }
    };

    return (
        <div
            id="support"
            onClick={handleBlockClick}
            onMouseEnter={handleHover}
            className="group max-w-7xl mx-auto mt-24 mb-8 relative z-10 flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent border border-white/20 overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
        >
            <div className="absolute inset-0 bg-[#FF4A9A]/10 blur-3xl rounded-full pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
                {/* The Cookie Graphic */}
                <div
                    ref={cookieRef}
                    className="w-24 h-24 mb-6 transition-all duration-300 ease-out"
                    style={{ clipPath: getClipPath() }}
                >
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="48" fill="#D28F50" />
                        <circle cx="50" cy="50" r="48" stroke="#874B1F" strokeWidth="4" />
                        {/* Chips */}
                        <circle cx="30" cy="30" r="6" fill="#4A2E15" />
                        <circle cx="65" cy="25" r="5" fill="#4A2E15" />
                        <circle cx="45" cy="55" r="7" fill="#4A2E15" />
                        <circle cx="75" cy="65" r="6" fill="#4A2E15" />
                        <circle cx="25" cy="70" r="5" fill="#4A2E15" />
                        <circle cx="80" cy="45" r="4" fill="#4A2E15" />
                    </svg>
                </div>

                <h3 className="font-heading font-bold text-3xl text-[#FFFFFF] mb-4 tracking-tight drop-shadow-md">Support the Project</h3>
                <p className="font-heading text-[#FFFFFF]/80 text-lg font-medium leading-relaxed max-w-2xl mx-auto mb-8">
                    {bites < maxBites
                        ? "Like the idea? Help us build a safer, better version—buy us a cookie. We’re two DC-based developers making it happen."
                        : "Nom nom nom... Thanks! Redirecting..."}
                </p>

                <button
                    onClick={handleButtonClick}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF4A9A] hover:bg-[#FF4A9A]/90 text-white font-bold text-base rounded-full transition-transform duration-300 hover:scale-[1.05] shadow-[0_0_25px_rgba(255,74,154,0.5)] active:scale-95"
                >
                    Buy Us a Cookie 🍪
                </button>
            </div>
        </div>
    );
};

const Footer = () => {
    // Minimalist Ant Logo SVG replaced with shared component
    return (
        <footer className="relative bg-[#02050B] mt-24 rounded-t-[4rem] px-6 py-16 md:py-24 overflow-hidden border-t border-white/5">

            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-[#00D4FF]/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-16">

                {/* Brand & Purpose */}
                <div className="max-w-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <AntLogo className="w-6 h-6 text-[#00D4FF]" />
                        <span className="font-heading font-bold text-xl tracking-tight text-[#E2F1FF]">SafePath</span>
                    </div>
                    <p className="font-heading text-[#E2F1FF]/50 text-sm font-light leading-relaxed mb-8">
                        A beautifully designed navigation app prioritizing your daily safety and peace of mind.
                    </p>

                    {/* Operational Status */}
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 inline-flex">
                        <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
                        <span className="font-data text-[10px] text-[#E2F1FF]/70 tracking-widest uppercase">
                            System Operational
                        </span>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto">

                    <div className="flex flex-col gap-4">
                        <span className="font-data text-[10px] text-[#E2F1FF]/40 tracking-widest uppercase mb-2">App</span>
                        <a href="#" className="font-heading text-sm text-[#E2F1FF]/70 hover:text-[#00D4FF] transition-colors">Features</a>
                        <a href="#" className="font-heading text-sm text-[#E2F1FF]/70 hover:text-[#00D4FF] transition-colors">Philosophy</a>
                        <a href="#" className="font-heading text-sm text-[#E2F1FF]/70 hover:text-[#00D4FF] transition-colors">Safety</a>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span className="font-data text-[10px] text-[#E2F1FF]/40 tracking-widest uppercase mb-2">Security</span>
                        <a href="#" className="font-heading text-sm text-[#E2F1FF]/70 hover:text-[#00D4FF] transition-colors">Data Privacy</a>
                        <a href="#" className="font-heading text-sm text-[#E2F1FF]/70 hover:text-[#00D4FF] transition-colors">Encryption Methods</a>
                        <a href="#" className="font-heading text-sm text-[#E2F1FF]/70 hover:text-[#00D4FF] transition-colors">API Architecture</a>
                    </div>

                    <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
                        <span className="font-data text-[10px] text-[#E2F1FF]/40 tracking-widest uppercase mb-2">Legal</span>
                        <a href="#" className="font-heading text-sm text-[#E2F1FF]/70 hover:text-[#FF4A9A] transition-colors">Terms of Service</a>
                        <a href="#" className="font-heading text-sm text-[#E2F1FF]/70 hover:text-[#FF4A9A] transition-colors">Privacy Policy</a>
                        <a href="#" className="font-heading text-sm text-[#E2F1FF]/70 hover:text-[#FF4A9A] transition-colors">Data Ethics</a>
                    </div>

                </div>
            </div>

            <InteractiveCookie />

            {/* Copyright */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
                <span className="font-data text-[10px] text-[#E2F1FF]/30 tracking-widest uppercase">
                    © {new Date().getFullYear()} SafePath. All rights reserved.
                </span>
                <span className="font-data text-[10px] text-[#E2F1FF]/30 tracking-widest uppercase">
                    Navigate safely.
                </span>
            </div>

        </footer>
    );
};

export default Footer;

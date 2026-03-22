import { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AntLogo from './AntLogo';
gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
    const navRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const isNative = Capacitor.isNativePlatform();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance animation
            gsap.from(navRef.current, {
                y: -20,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.2
            });
        });
        return () => ctx.revert();
    }, []);

    // Minimalist Hybrid Ant Face Logo replaced with shared component

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 w-full mix-blend-difference pointer-events-none">
            <nav
                ref={navRef}
                className={`pointer-events-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 w-full max-w-5xl ${isScrolled
                    ? 'bg-[#040B16]/60 backdrop-blur-xl border border-white/10 text-[#E2F1FF]'
                    : 'bg-transparent text-[#E2F1FF]'
                    }`}
            >
                <div className="flex items-center gap-2">
                    <AntLogo className="w-6 h-6 text-[#E63B2E]" />
                    <span className="font-heading font-bold text-lg tracking-tight">SafePath</span>
                </div>

                <div className="hidden md:flex items-center gap-8 font-heading text-sm font-medium tracking-tight">
                    <a href="#features" className="hover:-translate-y-[1px] transition-transform duration-300">Features</a>
                    <a href="#philosophy" className="hover:-translate-y-[1px] transition-transform duration-300">Philosophy</a>
                    <a href="#protocol" className="hover:-translate-y-[1px] transition-transform duration-300">Safety</a>
                </div>

                <div className="flex items-center">
                    {!isNative && (
                        <button
                            className="group relative overflow-hidden font-heading text-sm font-semibold tracking-tight rounded-full px-5 py-2.5 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.03] bg-[#00D4FF] text-[#040B16]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Download App
                            </span>
                            <span className="absolute inset-0 z-0 translate-y-[101%] bg-white transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-y-0"></span>
                        </button>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;

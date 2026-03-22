import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const Philosophy = () => {
    const sectionRef = useRef(null);
    const textRef1 = useRef(null);
    const textRef2 = useRef(null);
    const card1Ref = useRef(null);
    const card2Ref = useRef(null);
    const card3Ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax background
            gsap.to('.parallax-bg', {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                }
            });

            // True Ant Colony Path Animation using MotionPathPlugin
            const ants = gsap.utils.toArray('.bg-ant');

            ants.forEach((ant, i) => {
                // Determine their starting progress on the path (0 to 1)
                const startProgress = i / ants.length;

                // Animate them infinitely along the entire path
                gsap.to(ant, {
                    motionPath: {
                        path: "#safe-path-track",
                        align: "#safe-path-track",
                        autoRotate: 90, // Orient Ant head forward
                        alignOrigin: [0.5, 0.5],
                        start: startProgress,
                        end: startProgress + 1
                    },
                    duration: 25, // Slow, purposeful crawl
                    repeat: -1,
                    ease: "none",
                    opacity: 1 // make sure they are visible
                });
            });

            // Text reveal for statement 1
            const words1 = textRef1.current.querySelectorAll('.word');
            gsap.from(words1, {
                scrollTrigger: {
                    trigger: textRef1.current,
                    start: 'top 85%',
                },
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: 'power2.out'
            });

            // Text reveal for statement 2
            const words2 = textRef2.current.querySelectorAll('.word');
            gsap.from(words2, {
                scrollTrigger: {
                    trigger: textRef2.current,
                    start: 'top 80%',
                },
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.08,
                ease: 'power3.out'
            });

            // Floating Cards Entrance
            gsap.from([card1Ref.current, card2Ref.current, card3Ref.current], {
                y: 60,
                opacity: 0,
                stagger: 0.2,
                duration: 1.2,
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 40%",
                }
            });

            // Gentle floating animation for cards
            gsap.to(card1Ref.current, { y: "-=15", duration: 3.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
            gsap.to(card2Ref.current, { y: "+=12", duration: 3.8, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.5 });
            gsap.to(card3Ref.current, { y: "-=18", duration: 4.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1 });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Helper to split text for animation
    const splitText = (text) => {
        return text.split(' ').map((word, i) => (
            <span key={i} className="word inline-block mr-[0.25em] will-change-transform">{word}</span>
        ));
    };

    return (
        <section id="philosophy" ref={sectionRef} className="relative w-full py-32 md:py-48 bg-[#030811] overflow-hidden flex items-center justify-center z-0">

            {/* Dynamic Map Background - Hardware Accelerated Parallax */}
            <div className="parallax-bg absolute inset-0 w-full h-[150%] -top-1/4 opacity-[0.6] pointer-events-none flex items-center justify-center overflow-hidden z-0 will-change-transform transform-gpu translate-z-0">
                <svg viewBox="0 0 1200 800" className="w-[150%] h-[150%] md:w-full md:h-full" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        {/* More detailed Ant Icon */}
                        <g id="icon-ant" transform="scale(0.8)">
                            {/* Ant Body Parts */}
                            <ellipse cx="0" cy="8" rx="3" ry="5" fill="#E63B2E" /> {/* Abdomen */}
                            <ellipse cx="0" cy="0" rx="2" ry="3" fill="#FF4A9A" /> {/* Thorax */}
                            <circle cx="0" cy="-5" r="3" fill="#E63B2E" /> {/* Head */}
                            {/* Antennae */}
                            <path d="M-1,-7 Q-3,-10 -5,-9" fill="none" stroke="#E63B2E" strokeWidth="1" />
                            <path d="M1,-7 Q3,-10 5,-9" fill="none" stroke="#E63B2E" strokeWidth="1" />
                            {/* Legs Left */}
                            <path d="M-1,0 L-6,-3 M-1,1 L-7,2 M-2,3 L-6,7" fill="none" stroke="#E63B2E" strokeWidth="1" />
                            {/* Legs Right */}
                            <path d="M1,0 L6,-3 M1,1 L7,2 M2,3 L6,7" fill="none" stroke="#E63B2E" strokeWidth="1" />
                        </g>

                        {/* Clearer Threat Icons */}
                        <g id="threat-area" transform="translate(-15, -15)">
                            <circle cx="15" cy="15" r="15" fill="#040B16" stroke="#EB5757" strokeWidth="2" />
                            <path d="M15 8v8M15 20h.01" stroke="#EB5757" strokeWidth="3" strokeLinecap="round" />
                        </g>

                        {/* Precise City Blocks */}
                        <pattern id="street-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                            <rect width="100" height="100" fill="#040B16" />
                            {/* Minor streets */}
                            <path d="M 0 50 L 100 50 M 50 0 L 50 100" className="stroke-[#0B162C] stroke-[2]" fill="none" />
                            {/* Buildings / Blocks */}
                            <rect x="5" y="5" width="40" height="40" rx="4" fill="#0A1222" stroke="#13233F" strokeWidth="1" />
                            <rect x="55" y="5" width="40" height="40" rx="4" fill="#0A1222" stroke="#13233F" strokeWidth="1" />
                            <rect x="5" y="55" width="40" height="40" rx="4" fill="#0A1222" stroke="#13233F" strokeWidth="1" />
                            <rect x="55" y="55" width="40" height="40" rx="4" fill="#0A1222" stroke="#13233F" strokeWidth="1" />
                        </pattern>

                        {/* Red glow for dangers */}
                        <radialGradient id="danger-glow">
                            <stop offset="0%" stopColor="#EB5757" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#EB5757" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#EB5757" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    {/* Highly Structured Map Grid */}
                    <rect width="100%" height="100%" fill="url(#street-grid)" />

                    {/* Major Arterial Roads - Dark Blue */}
                    <g className="stroke-[#13233F] stroke-[12] fill-none stroke-linecap-round stroke-linejoin-round">
                        <path d="M -100 300 L 400 350 L 700 150 L 1300 100" />
                        <path d="M 200 -100 L 250 300 L 100 900" />
                        <path d="M 1300 500 L 800 550 L 600 800" />
                        <path d="M -50 700 L 400 700 L 800 900" />
                    </g>
                    {/* Inner styling for major roads */}
                    <g className="stroke-[#1C2E4A] stroke-[6] fill-none stroke-linecap-round stroke-linejoin-round">
                        <path d="M -100 300 L 400 350 L 700 150 L 1300 100" />
                        <path d="M 200 -100 L 250 300 L 100 900" />
                        <path d="M 1300 500 L 800 550 L 600 800" />
                        <path d="M -50 700 L 400 700 L 800 900" />
                    </g>

                    {/* High-Risk Areas (Precise and visible) */}
                    {[
                        { x: 400, y: 350, r: 120 },
                        { x: 800, y: 550, r: 100 },
                        { x: 250, y: 750, r: 90 },
                        { x: 1000, y: 250, r: 150 },
                        { x: 650, y: 150, r: 80 }
                    ].map((zone, i) => (
                        <g key={`danger-${i}`}>
                            <circle cx={zone.x} cy={zone.y} r={zone.r} fill="url(#danger-glow)" />
                            {/* Dotted danger perimeter */}
                            <circle cx={zone.x} cy={zone.y} r={zone.r * 0.7} fill="none" stroke="#EB5757" strokeWidth="1" strokeDasharray="4 8" opacity="0.5" />
                            {/* Threat Icon at epicenter */}
                            <use href="#threat-area" x={zone.x} y={zone.y} />
                        </g>
                    ))}

                    {/* Safe Routing Data Flow (Ant Colony Path) */}
                    <g>
                        {/* Visually Distinct Dashed Safe Path "- - - -" */}
                        <path
                            id="safe-path-track"
                            d="M 50 850 C 150 700, 100 500, 300 450 C 500 400, 550 300, 750 250 C 950 200, 1050 350, 1250 -50"
                            className="stroke-[#00D4FF] stroke-[4] fill-none"
                            strokeLinecap="round"
                            strokeDasharray="12 16"
                        />

                        {/* Thicker faint glow behind the dashed line */}
                        <path
                            d="M 50 850 C 150 700, 100 500, 300 450 C 500 400, 550 300, 750 250 C 950 200, 1050 350, 1250 -50"
                            className="stroke-[#00D4FF] stroke-[15] fill-none opacity-10"
                            strokeLinecap="round"
                        />

                        {/* Nodes along the safe path */}
                        <circle cx="300" cy="450" r="5" fill="#E2F1FF" stroke="#00D4FF" strokeWidth="2" />
                        <circle cx="750" cy="250" r="5" fill="#E2F1FF" stroke="#00D4FF" strokeWidth="2" />

                        {/* The GSAP Animated Colony Ants */}
                        {Array.from({ length: 30 }).map((_, i) => (
                            <use key={i} href="#icon-ant" className="bg-ant opacity-0 will-change-transform transform-gpu" />
                        ))}
                    </g>
                </svg>
            </div>

            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#040B16] via-transparent to-[#040B16] z-10 pointer-events-none"></div>

            <div className="relative z-20 max-w-6xl mx-auto px-6 w-full flex flex-col items-center min-h-[60vh] justify-center">

                {/* Main Philosophy Text Block */}
                <div className="text-center relative w-full pt-16 pb-24">

                    {/* Feature Card 1: Live Data Sync */}
                    <div ref={card1Ref} className="absolute top-0 md:-top-12 -left-4 md:left-4 lg:-left-12 w-[180px] md:w-56 p-4 rounded-2xl bg-[#0B162C]/80 backdrop-blur-md border border-white/10 shadow-2xl z-30 transform -rotate-6 md:hover:rotate-0 transition-transform duration-500 will-change-transform transform-gpu">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 shrink-0 rounded-full bg-[#E63B2E]/20 flex items-center justify-center border border-[#E63B2E]/40">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E63B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                            </div>
                            <span className="font-heading text-xs font-bold text-white tracking-widest uppercase text-left leading-tight">Live Sync</span>
                        </div>
                        <p className="font-sans text-[10px] md:text-xs text-white/60 leading-tight text-left">Aggregating official city incident streams in real-time.</p>
                        {/* Mini Visual: Grid Scanner (Animation Removed for Performance) */}
                        <div className="mt-3 w-full h-16 border border-white/10 grid grid-cols-6 grid-rows-3 gap-[2px] p-1 bg-[#040B16] relative overflow-hidden rounded-md">
                            {Array.from({ length: 18 }).map((_, i) => (
                                <div key={i} className={`rounded-[1px] ${(i % 5 === 0 || i % 8 === 0) ? 'bg-[#E63B2E]/60' : 'bg-white/5'}`}></div>
                            ))}
                            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#E63B2E] shadow-[0_0_10px_rgba(230,59,46,0.8)]"></div>
                        </div>
                    </div>

                    {/* Feature Card 2: Safety Scoring */}
                    <div ref={card2Ref} className="hidden md:block absolute -bottom-16 md:-bottom-24 lg:-bottom-12 -right-4 md:right-8 lg:-right-8 w-[180px] md:w-56 p-4 rounded-2xl bg-[#0B162C]/80 backdrop-blur-md border border-white/10 shadow-2xl z-30 transform rotate-3 hover:-rotate-0 transition-transform duration-500 will-change-transform transform-gpu">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 shrink-0 rounded-full bg-[#00D4FF]/20 flex items-center justify-center border border-[#00D4FF]/40">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            </div>
                            <span className="font-heading text-xs font-bold text-white tracking-widest uppercase text-left leading-tight">Safety Scoring</span>
                        </div>
                        <p className="font-sans text-[10px] md:text-xs text-white/60 leading-tight text-left">Proprietary logic mapping localized safety curves.</p>
                        {/* Mini Visual: Double Helix / Concentric (Animation Removed for Performance) */}
                        <div className="mt-3 w-full h-16 bg-[#040B16] rounded-md border border-white/5 flex items-center justify-center overflow-hidden">
                            <div className="w-12 h-12 border border-[#00D4FF]/40 rounded-full flex items-center justify-center relative">
                                <div className="w-8 h-8 border border-[#00D4FF]/60 rounded-full absolute relative">
                                    <div className="w-2 h-2 bg-[#00D4FF] rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Card 3: Smart Routing */}
                    <div ref={card3Ref} className="absolute top-[85%] md:top-[15%] right-0 md:right-4 lg:-right-24 w-[180px] md:w-52 p-4 rounded-2xl bg-[#0B162C]/80 backdrop-blur-md border border-white/10 shadow-2xl z-30 transform md:rotate-6 hover:rotate-0 transition-transform duration-500 will-change-transform transform-gpu">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 shrink-0 rounded-full bg-[#FF4A9A]/20 flex items-center justify-center border border-[#FF4A9A]/40">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF4A9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            </div>
                            <span className="font-heading text-xs font-bold text-white tracking-widest uppercase text-left leading-tight">Smart Routing</span>
                        </div>
                        <p className="font-sans text-[10px] md:text-xs text-white/60 leading-tight text-left">Calculating optimal paths via dynamic safe node mapping.</p>
                        {/* Mini Visual: Pulse waveform (Animation Removed for Performance) */}
                        <div className="mt-3 w-full h-12 bg-[#040B16] rounded-md border border-white/5 flex items-center justify-center overflow-hidden">
                            <svg viewBox="0 0 200 100" className="w-[120%] stroke-[#FF4A9A] fill-none stroke-2">
                                <path d="M 0 50 L 40 50 L 50 20 L 60 80 L 70 50 L 130 50 L 140 10 L 150 90 L 160 50 L 200 50" />
                            </svg>
                        </div>
                    </div>

                    <p ref={textRef1} className="font-heading text-[#E2F1FF]/60 text-xl md:text-2xl font-light mb-12 tracking-wide mt-12 md:mt-0">
                        {splitText("Most standard navigation platforms index simply for:")}
                        <br />
                        <span className="font-medium text-[#E2F1FF]/80 mt-2 inline-block">
                            {splitText("velocity and convenience.")}
                        </span>
                    </p>

                    <div className="relative inline-block mt-8 mb-4">
                        <svg className="absolute -top-12 -left-16 w-24 h-24 text-[#FF4A9A]/20" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                        </svg>
                        <h2 ref={textRef2} className="font-drama italic text-5xl md:text-7xl lg:text-8xl text-[#FFFFFF] leading-[1.2] tracking-tight max-w-4xl mx-auto relative z-10">
                            {splitText("We index exclusively for ")}
                            <span className="text-[#00F0FF] relative inline-block whitespace-nowrap">
                                {splitText("your personal safety.")}
                                <div className="absolute -bottom-1 lg:-bottom-3 left-0 w-full h-[4px] bg-[#FF4A9A]/60 rounded-full"></div>
                            </span>
                        </h2>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Philosophy;

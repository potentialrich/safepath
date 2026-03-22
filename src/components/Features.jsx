import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// -------------------------------------------------------------
// Card 1: Buddy Link (Student Safety Feature)
// -------------------------------------------------------------
const BuddyLinkFeature = () => {
    const [buddies, setBuddies] = useState([
        { id: 1, name: 'Sarah', status: 'Arrived Safe 🏡', color: '#10B981', delay: 0 },
        { id: 2, name: 'Mike', status: 'On the way 🚶‍♂️ 5m', color: '#FFB800', delay: 1000 },
        { id: 3, name: 'You', status: 'Navigating 🗺️', color: '#FF4A9A', delay: 2000 }
    ]);

    useEffect(() => {
        // Simple animation loop effect
        const interval = setInterval(() => {
            setBuddies(prev => {
                const newArr = [...prev];
                const first = newArr.shift();
                newArr.push(first);
                return newArr;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#20104D] border border-white/5 rounded-[2rem] p-8 shadow-2xl flex flex-col h-[420px] relative overflow-hidden group">
            <div className="mb-8 z-10">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🤝</span>
                    <h3 className="font-heading font-bold text-xl text-[#FFFFFF] tracking-tight">Buddy Link</h3>
                </div>
                <p className="font-heading text-sm text-[#FFFFFF]/70 font-light leading-relaxed">Walking home after a late night? Link your navigation with friends and make sure everyone gets back safe.</p>
            </div>

            <div className="flex-1 relative w-full flex flex-col justify-end pb-4 z-10 gap-3">
                {buddies.map((buddy, index) => {
                    const isTop = index === 2;
                    return (
                        <div
                            key={buddy.id}
                            className="w-full bg-[#10082B] border border-white/10 rounded-2xl p-4 flex items-center justify-between transition-all duration-500 ease-out"
                            style={{
                                transform: isTop ? 'scale(1.05)' : 'scale(1)',
                                opacity: isTop ? 1 : 0.7,
                                borderColor: isTop ? `${buddy.color}50` : 'rgba(255,255,255,0.1)',
                                boxShadow: isTop ? `0 8px 25px -5px ${buddy.color}40` : 'none'
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: buddy.color, color: '#10082B' }}>
                                    {buddy.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-heading font-medium text-sm text-[#FFFFFF]">{buddy.name}</span>
                                    <span className="font-heading text-xs" style={{ color: buddy.color }}>{buddy.status}</span>
                                </div>
                            </div>
                            {isTop && (
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: buddy.color }}></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// -------------------------------------------------------------
// Card 2: Late Night Bite (Food Routing)
// -------------------------------------------------------------
const LateNightBiteFeature = () => {
    const [foodType, setFoodType] = useState('🍕 Pizza');
    const [distance, setDistance] = useState('0.4 mi');

    useEffect(() => {
        const foods = [
            { t: '🍕 Pizza', d: '0.4 mi' },
            { t: '🍩 Donuts', d: '0.8 mi' },
            { t: '🌮 Tacos', d: '1.2 mi' },
            { t: '🍔 Burgers', d: '0.3 mi' }
        ];
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % foods.length;
            setFoodType(foods[i].t);
            setDistance(foods[i].d);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#20104D] border border-white/5 rounded-[2rem] p-8 shadow-2xl flex flex-col h-[420px] relative overflow-hidden group">
            <div className="mb-8 z-10 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🍟</span>
                        <h3 className="font-heading font-bold text-xl text-[#FFFFFF] tracking-tight">Late Night Bite</h3>
                    </div>
                    <p className="font-heading text-sm text-[#FFFFFF]/70 font-light leading-relaxed max-w-[95%]">Craving food at 2 AM? Find the most well-lit, populated, and safe paths to your nearest 24/7 spots.</p>
                </div>
            </div>

            <div className="flex-1 bg-[#10082B] rounded-2xl border border-white/5 p-5 mt-2 relative overflow-hidden flex flex-col justify-between">

                {/* Simulated Map Path */}
                <div className="relative h-24 w-full flex items-center justify-center">
                    <svg viewBox="0 0 200 80" className="w-full h-full overflow-visible drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
                        <path className="animate-pulse" d="M 20 60 Q 60 20 100 40 T 180 20" fill="none" stroke="#00F0FF" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 6" />
                        <circle cx="20" cy="60" r="6" fill="#FFFFFF" />
                        <circle cx="180" cy="20" r="8" fill="#FFB800" className="animate-bounce" />
                    </svg>
                </div>

                <div className="bg-[#2D1669] p-4 rounded-xl flex items-center justify-between border border-white/10">
                    <div className="flex flex-col">
                        <span className="font-heading font-medium text-lg text-white transition-all">{foodType}</span>
                        <span className="font-heading text-sm text-[#00F0FF]">Safest Route: {distance}</span>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-[#00F0FF] flex items-center justify-center hover:scale-110 transition-transform text-[#10082B] shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                        ➔
                    </button>
                </div>
            </div>
        </div>
    );
};

// -------------------------------------------------------------
// Card 3: Neighborhood Vibe Check (Safety Score Dashboard)
// -------------------------------------------------------------
const NeighborhoodVibeFeature = () => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const [activeDay, setActiveDay] = useState(3); // Wednesday

    return (
        <div className="bg-[#20104D] border border-white/5 rounded-[2rem] p-8 shadow-2xl flex flex-col h-[420px] relative overflow-hidden group">
            <div className="mb-4 z-10">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🔮</span>
                    <h3 className="font-heading font-bold text-xl text-[#FFFFFF] tracking-tight">Neighborhood Vibe</h3>
                </div>
                <p className="font-heading text-sm text-[#FFFFFF]/70 font-light leading-relaxed">Get a quick, fun safety vibe check for your neighborhood or destination before you head out.</p>
            </div>

            <div className="flex-1 mt-auto relative pt-4 z-10 flex flex-col justify-end">
                <div className="bg-[#10082B] rounded-2xl border border-white/10 p-5">
                    <div className="flex justify-between items-center mb-6">
                        {days.map((day, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveDay(i)}
                                className={`w-8 h-10 rounded-xl flex items-center justify-center font-heading font-bold text-xs cursor-pointer transition-all duration-300 ${activeDay === i ? 'bg-[#FF4A9A] text-white shadow-[0_0_15px_rgba(255,74,154,0.4)] scale-110' : 'text-white/40 bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center bg-[#2D1669] p-4 rounded-xl border border-white/5">
                        <div className="flex flex-col">
                            <span className="text-3xl mb-1">{activeDay === 5 ? '🎉' : '✨'}</span>
                            <div className="font-heading font-bold text-lg text-[#FFFFFF]">
                                {activeDay === 5 ? 'Vibrant & Safe' : 'Chill Vibes'}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-data text-[#00F0FF] mb-1 uppercase tracking-widest font-bold">Safety Score</div>
                            <div className="font-heading font-black text-3xl text-[#FFFFFF]">
                                {activeDay === 5 ? '87' : '94'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// -------------------------------------------------------------
// Features Section Layout
// -------------------------------------------------------------
const Features = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.feature-card', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                },
                y: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out'
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="features" ref={sectionRef} className="py-24 md:py-32 px-6 bg-[#10082B]">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <h2 className="font-drama italic text-4xl md:text-5xl lg:text-6xl text-[#00F0FF] mb-4">Our Next Big Ideas.</h2>
                        <p className="font-heading text-[#FFFFFF]/70 text-lg font-light leading-relaxed">
                            We're constantly exploring new ways to make daily navigation safer and more fun. Here's what we're cooking up next.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <a href="#support" className="px-6 py-3 bg-[#FF4A9A] hover:bg-[#FF4A9A]/90 text-white font-bold text-sm rounded-full transition-transform hover:scale-105 shadow-[0_0_15px_rgba(255,74,154,0.4)]">
                            Support Us 🍪
                        </a>
                        <a href="mailto:safepathideas@gmail.com" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm rounded-full transition-transform hover:scale-105 backdrop-blur-sm">
                            💡 Give your Idea
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    <div className="feature-card"><BuddyLinkFeature /></div>
                    <div className="feature-card"><LateNightBiteFeature /></div>
                    <div className="feature-card"><NeighborhoodVibeFeature /></div>
                </div>
            </div>
        </section>
    );
};

export default Features;

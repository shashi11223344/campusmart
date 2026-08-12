

import { useSiteContent } from '../../contexts/SiteContentContext';

const TickerBar = () => {
    const { content } = useSiteContent();
    const announcements = (Array.isArray(content.ticker_announcements) ? content.ticker_announcements : null) || [
        "Digital Transformation Summit: 15 May 2026",
        "New AI-Powered Learning Stations now available for pre-order",
        "Join our upcoming Campus Design Webinar on 15th April 2026",
        "Latest UGC Guidelines for Digital Campus implemented across 50+ institutions",
        "Explore our new range of ergonomic Campus Furniture in the Lookbook",
    ];

    return (
        <div className="w-full relative overflow-hidden flex flex-col" style={{ backgroundColor: '#222b5c' }}>
            {/* Top Gold Bar */}
            <div className="w-full h-[5px]" style={{ backgroundColor: '#dca842' }} />

            {/* Container */}
            <div className="relative w-full h-[40px] flex items-stretch">

                {/* Left 'Tab' area with angled right edge */}
                <div
                    className="relative z-10 flex items-center pl-4 md:pl-6 pr-8 h-full flex-shrink-0"
                    style={{
                        backgroundColor: '#f1f2f2',
                        clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%)'
                    }}
                >
                    {/* Target/Bullseye Icon similar to KT */}
                    <div className="w-4 h-4 rounded-full border-[3px] flex items-center justify-center mr-2 lg:mr-3" style={{ borderColor: '#12395b' }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#12395b' }} />
                    </div>
                    <span
                        className="font-extrabold text-[12px] md:text-[14px] tracking-wide"
                        style={{ color: '#12395b', fontFamily: 'Georgia, serif' }}
                    >
                        LATEST UPDATES
                    </span>
                </div>

                {/* Scrolling Ticker Area */}
                <div className="flex-1 overflow-hidden flex items-center relative">
                    <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-[13px] md:text-sm font-medium" style={{ color: '#f8f9fa' }}>
                        {announcements.map((item: string, i: number) => (
                            <span key={i} className="hover:text-[#dca842] transition-colors cursor-pointer">{item}</span>
                        ))}
                        {/* Duplicate for seamless looping */}
                        {announcements.map((item: string, i: number) => (
                            <span key={`dup-${i}`} aria-hidden="true" className="hover:text-[#dca842] transition-colors cursor-pointer">{item}</span>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TickerBar;

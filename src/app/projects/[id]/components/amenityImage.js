import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Amenities({ amenities }) {
    const containerRef = useRef(null); // Ref to access the container element
    const [isOverflowed, setIsOverflowed] = useState(false); // State to track overflow

    const handleScroll = (scrollOffset) => {
        const container = containerRef.current;
        if (container) {
            const { scrollLeft, scrollWidth, clientWidth } = container;
            let newScrollLeft = scrollLeft + scrollOffset;
    
            // If scrolling beyond the end, reset to the start
            if (newScrollLeft >= scrollWidth - clientWidth) {
                newScrollLeft = 0;
            }
    
            container.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth', // Smooth scrolling
            });
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const handleResize = () => {
                // Check if the container is overflowed
                setIsOverflowed(container.scrollWidth > container.clientWidth);
            };
            handleResize(); // Initial check
            window.addEventListener('resize', handleResize); // Listen for resize events
            return () => {
                window.removeEventListener('resize', handleResize); // Clean up the listener
            };
        }
    }, []);

    useEffect(() => {
        let timer;
        if (isOverflowed) {
            timer = setInterval(() => {
                handleScroll(220);
            }, 3000); // Scroll every 3 seconds
        }
        return () => {
            clearInterval(timer);
        };
    }, [isOverflowed]);


    if (!amenities || amenities.length === 0) {
        return <></>;
    }

    return (
        <div className="p-5 relative">
            <div className="flex justify-between items-center">
                {isOverflowed && ( // Render the arrows only if container is overflowed
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => handleScroll(-220)}>
                        {/* Left arrow icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 hover:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                )}
                <div ref={containerRef} className="flex gap-5 overflow-x-auto scrollbar-hide">
                    {amenities.map((data) => (
                        <div className='relative flex-shrink-0 h-[200px] w-[150px]' key={data.id}>
                            {/* Image component */}
                            {/* <img src={data.amenityUrl} alt={data.id} className='object-cover aspect-square w-full h-full' /> */}
                            <Image src={data.amenityUrl} quality={100} width={200} height={200} alt={data.id} className='object-cover aspect-square w-full h-full' />
                        </div>
                    ))}
                </div>
                {isOverflowed && ( // Render the arrows only if container is overflowed
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => handleScroll(220)}>
                        {/* Right arrow icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 hover:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}

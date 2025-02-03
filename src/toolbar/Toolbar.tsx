import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FiSun, FiMoon, FiDownload, FiUpload } from 'react-icons/fi';

export const Toolbar: React.FC = () => {
    const toolbarRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const toolbar = toolbarRef.current;
        if (!toolbar) return;

        gsap.set(toolbar, {
            y: '80%'
        });

        // hover
        const tl = gsap.timeline({ paused: true });
        tl.to(toolbar, {
            y: '0%',
            duration: 0.3,
            ease: 'power2.out'
        });

        const handleMouseEnter = () => tl.play();
        const handleMouseLeave = () => tl.reverse();

        toolbar.addEventListener('mouseenter', handleMouseEnter);
        toolbar.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            toolbar.removeEventListener('mouseenter', handleMouseEnter);
            toolbar.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div 
            ref={toolbarRef}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 
                       rounded-t-lg shadow-[0px_0px_8px_2px_rgba(128,128,128,0.8)] px-6 py-3 flex gap-4 items-center
                       transition-colors duration-200 cursor-pointer"
        >
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <FiSun className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <FiDownload className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <FiUpload className="w-5 h-5" />
            </button>
        </div>
    );
};
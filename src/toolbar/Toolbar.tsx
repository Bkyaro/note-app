import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FiSun, FiMoon, FiDownload, FiUpload } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

export const Toolbar: React.FC = () => {
    const toolbarRef = useRef<HTMLDivElement>(null);
    const { isDarkMode, toggleDarkMode } = useTheme();

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
                       rounded-t-lg shadow-[0px_0px_8px_2px_rgba(128,128,128,0.6)] dark:shadow-[0px_0px_8px_2px_rgba(255,255,255,0.4)]  px-6 py-3 flex gap-4 items-center
                       cursor-pointer"
        >
            <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300"
            >
                {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                <FiDownload className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                <FiUpload className="w-5 h-5" />
            </button>
        </div>
    );
};
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FiSun, FiMoon, FiDownload, FiUpload } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';

interface ToolbarProps {
    onExport: () => void;
    onImport: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onExport, onImport }) => {
    const toolbarRef = useRef<HTMLDivElement>(null);
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const toolbar = toolbarRef.current;
        if (!toolbar) return;

        const mediaQuery = window.matchMedia('(min-width: 768px)');

        if (mediaQuery.matches) {
            gsap.set(toolbar, {
                y: '70%'
            });

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
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'zh' ? 'en' : 'zh';
        changeLanguage(newLang);
    };

    return (
        <div
            ref={toolbarRef}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 
                       rounded-t-lg shadow-[0px_0px_8px_2px_rgba(128,128,128,0.6)] dark:shadow-[0px_0px_8px_2px_rgba(255,255,255,0.4)] 
                       px-4 md:px-6 py-2 md:py-3 flex gap-2 md:gap-4 items-center
                       cursor-pointer max-w-full md:[transform:translateY(70%)]"
        >
            <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300"
            >
                {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            <button
                onClick={onExport}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300"
                title={t('export.note')}
            >
                <FiDownload className="w-5 h-5" />
            </button>
            <button
                onClick={onImport}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300"
                title={t('import.note')}
            >
                <FiUpload className="w-5 h-5" />
            </button>
            <button
                onClick={toggleLanguage}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300"
                title={t('switch.language')}
            >
                {i18n.language === 'zh' ? 'EN' : '中'}
            </button>
        </div>
    );
};
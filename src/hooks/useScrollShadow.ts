import { useEffect, useRef } from 'react';

export const useScrollShadow = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtTop = scrollTop === 0;
        const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
        const hasScroll = scrollHeight > clientHeight;

        container.style.setProperty('--top-shadow-opacity', (!isAtTop && hasScroll) ? '1' : '0');
        container.style.setProperty('--bottom-shadow-opacity', (!isAtBottom && hasScroll) ? '1' : '0');
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('scroll', handleScroll);
        handleScroll();

        const resizeObserver = new ResizeObserver(handleScroll);
        resizeObserver.observe(container);

        return () => {
            container.removeEventListener('scroll', handleScroll);
            resizeObserver.disconnect();
        };
    }, []);

    return containerRef;
}; 
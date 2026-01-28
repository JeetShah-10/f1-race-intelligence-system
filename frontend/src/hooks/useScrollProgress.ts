import { useScroll, type MotionValue } from 'framer-motion';
import { type RefObject } from 'react';

interface ScrollProgressReturn {
    scrollProgress: MotionValue<number>;
    scrollY: MotionValue<number>;
}

export function useScrollProgress(containerRef?: RefObject<HTMLElement>): ScrollProgressReturn {
    const { scrollYProgress, scrollY } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    return {
        scrollProgress: scrollYProgress,
        scrollY,
    };
}

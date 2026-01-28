import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CountUpNumberProps {
    target: number;
    duration?: number;
    suffix?: string;
    triggerOnView?: boolean;
    className?: string;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
    target,
    duration = 2000,
    suffix = "",
    triggerOnView = true,
    className = "",
}) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (triggerOnView && !isInView) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(target); // Ensure we hit exact target at end
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [isInView, target, duration, triggerOnView]);

    return (
        <span ref={ref} className={className}>
            {count}{suffix}
        </span>
    );
};

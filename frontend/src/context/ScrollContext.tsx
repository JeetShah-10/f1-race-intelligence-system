import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollContextValue {
    scrollProgress: number;
    scrollY: number;
    velocity: number;
    lenis: Lenis | null;
    isLoaded: boolean;
    setIsLoaded: (loaded: boolean) => void;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

interface ScrollProviderProps {
    children: ReactNode;
}

export function ScrollProvider({ children }: ScrollProviderProps) {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const [velocity, setVelocity] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        lenis.on('scroll', (e: { scroll: number; limit: number; velocity: number }) => {
            setScrollY(e.scroll);
            setVelocity(e.velocity);
            setScrollProgress(e.limit > 0 ? e.scroll / e.limit : 0);
            ScrollTrigger.update();
        });

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove((time) => {
                lenis.raf(time * 1000);
            });
        };
    }, []);

    return (
        <ScrollContext.Provider
            value={{
                scrollProgress,
                scrollY,
                velocity,
                lenis: lenisRef.current,
                isLoaded,
                setIsLoaded,
            }}
        >
            {children}
        </ScrollContext.Provider>
    );
}

export function useScroll() {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error('useScroll must be used within a ScrollProvider');
    }
    return context;
}

export function useSectionProgress(sectionRef: React.RefObject<HTMLElement | null>) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!sectionRef.current) return;

        const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
                setProgress(self.progress);
            },
        });

        return () => {
            trigger.kill();
        };
    }, [sectionRef]);

    return progress;
}

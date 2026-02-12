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
    const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
    const rafCallbackRef = useRef<((time: number) => void) | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLenisInstance(lenis);

        lenis.on('scroll', (e: { scroll: number; limit: number; velocity: number }) => {
            setScrollY(e.scroll);
            setVelocity(e.velocity);
            setScrollProgress(e.limit > 0 ? e.scroll / e.limit : 0);
            ScrollTrigger.update();
        });

        const rafCallback = (time: number) => {
            lenis.raf(time * 1000);
        };
        rafCallbackRef.current = rafCallback;
        gsap.ticker.add(rafCallback);

        gsap.ticker.lagSmoothing(0);

        return () => {
            if (rafCallbackRef.current) {
                gsap.ticker.remove(rafCallbackRef.current);
            }
            lenis.destroy();
            setLenisInstance(null);
        };
    }, []);

    return (
        <ScrollContext.Provider
            value={{
                scrollProgress,
                scrollY,
                velocity,
                lenis: lenisInstance,
                isLoaded,
                setIsLoaded,
            }}
        >
            {children}
        </ScrollContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useScroll() {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error('useScroll must be used within a ScrollProvider');
    }
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
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

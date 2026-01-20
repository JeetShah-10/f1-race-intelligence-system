import { useState } from 'react';
import { useScroll } from '../context/ScrollContext';
import { ThinkingCanvas } from '../components/3d/ThinkingCanvas';
import { LoadingTransition } from '../components/cinematic/LoadingTransition';
import { HeroSection } from '../components/landing/HeroSection';
import { SimulationLayer } from '../components/simulation/SimulationLayer';
import { ProductFeatures } from '../components/features/ProductFeatures';
import { CircuitShowcase } from '../components/landing/CircuitShowcase';
import { CTASection } from '../components/landing/CTASection';
import { Footer } from '../components/landing/Footer';

function ScrollProgressBar() {
    const { scrollProgress } = useScroll();

    return (
        <div className="fixed top-0 left-0 w-full h-[2px] z-[100] bg-transparent">
            <div
                className="h-full bg-[#CF2C28]"
                style={{
                    transform: `scaleX(${scrollProgress})`,
                    transformOrigin: 'left',
                    transition: 'transform 100ms ease-out'
                }}
            />
        </div>
    );
}

function LandingContent() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative w-full bg-[#0B0D10]">
            <LoadingTransition
                minDuration={2800}
                onComplete={() => setIsLoading(false)}
            />

            {!isLoading && <ScrollProgressBar />}

            <div className="fixed inset-0 z-0">
                <ThinkingCanvas />
            </div>

            <main className="relative z-10 w-full">
                <HeroSection />
                <SimulationLayer />
                <ProductFeatures />
                <CircuitShowcase />
                <CTASection />
                <Footer />
            </main>

            <div
                className="fixed inset-0 z-50 pointer-events-none opacity-[0.012] mix-blend-overlay"
                style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
            />
        </div>
    );
}

export function LandingPage() {
    return <LandingContent />;
}

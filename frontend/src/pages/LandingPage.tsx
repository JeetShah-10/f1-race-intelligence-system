import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { TrustStrip } from '../components/landing/TrustStrip';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { ProductShowcaseSection } from '../components/landing/ProductShowcaseSection';
import { StatsSection } from '../components/landing/StatsSection';
import { TierSection } from '../components/landing/TierSection';
import { Season2026Section } from '../components/landing/Season2026Section';
import { LandingBackground } from '../components/landing/LandingBackground';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen text-white overflow-x-hidden selection:bg-f1-red selection:text-white">
            <LandingBackground>
                <Header />
                <main>
                    <HeroSection />
                    <TrustStrip />
                    <FeaturesSection />
                    <HowItWorksSection />
                    <ProductShowcaseSection />
                    <StatsSection />
                    <TierSection />
                    <Season2026Section />
                </main>
                <Footer />
            </LandingBackground>
        </div>
    );
};

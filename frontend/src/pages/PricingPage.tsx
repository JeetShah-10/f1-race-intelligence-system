import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { GlassCard } from '@/components/ui/GlassCard';

interface PricingTier {
    name: string;
    description: string;
    monthlyPrice: number;
    annualPrice: number;
    features: string[];
    highlighted?: boolean;
    ctaText: string;
    ctaLink: string;
}

const pricingTiers: PricingTier[] = [
    {
        name: 'Starter',
        description: 'Perfect for casual F1 fans who want to explore race predictions.',
        monthlyPrice: 0,
        annualPrice: 0,
        features: [
            'Race predictions for 5 GPs/season',
            'Basic qualifying predictions',
            'Driver standings tracker',
            'Race calendar & notifications',
            'Community access',
        ],
        ctaText: 'Get Started Free',
        ctaLink: '/signup',
    },
    {
        name: 'Pro',
        description: 'For dedicated fans who want deeper insights and simulations.',
        monthlyPrice: 19,
        annualPrice: 15,
        features: [
            'Unlimited race predictions',
            'Advanced qualifying analysis',
            'Real-time race simulations',
            'Strategy optimization tools',
            'Lap time analysis',
            'Weather impact predictions',
            'API access (1,000 calls/mo)',
            'Priority support',
        ],
        highlighted: true,
        ctaText: 'Start Pro Trial',
        ctaLink: '/signup?plan=pro',
    },
    {
        name: 'Enterprise',
        description: 'For teams, media, and professionals requiring full platform access.',
        monthlyPrice: 99,
        annualPrice: 79,
        features: [
            'Everything in Pro',
            'Unlimited simulations',
            'Historical data access (2014+)',
            'Team comparison tools',
            'Custom prediction models',
            'Telemetry deep-dive',
            'API access (unlimited)',
            'Dedicated account manager',
            'White-label options',
        ],
        ctaText: 'Contact Sales',
        ctaLink: '/signup?plan=enterprise',
    },
];

const faqs = [
    {
        question: 'How accurate are the predictions?',
        answer: 'Our AI models achieve 85-92% accuracy on race outcomes and 78-85% on qualifying positions, based on historical validation across 5 seasons of data.',
    },
    {
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes, you can cancel anytime. Your access will continue until the end of your billing period with no hidden fees.',
    },
    {
        question: 'What data sources do you use?',
        answer: 'We integrate official F1 timing data, weather APIs, historical race data, and proprietary telemetry analysis to power our predictions.',
    },
    {
        question: 'Is there a free trial for Pro?',
        answer: 'Yes! Pro comes with a 14-day free trial. No credit card required to start.',
    },
    {
        question: 'Do you offer team or group discounts?',
        answer: 'Enterprise plans include volume discounts for teams of 5+. Contact sales for custom pricing.',
    },
];

export const PricingPage: React.FC = () => {
    const [isAnnual, setIsAnnual] = useState(true);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 bg-f1-red/10 border border-f1-red/30 rounded-full text-f1-red text-xs font-semibold uppercase tracking-wider mb-6">
                            Pricing
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-racing text-white mb-4">
                            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-f1-red via-neon-orange to-sunset-gold">Grid Position</span>
                        </h1>
                        <p className="text-lg text-white/60 max-w-2xl mx-auto">
                            From casual fans to professional analysts, we have a plan that fits your race intelligence needs.
                        </p>
                    </motion.div>

                    {/* Billing Toggle */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mt-10 flex items-center justify-center gap-4"
                    >
                        <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-white/50'}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? 'bg-f1-red' : 'bg-white/20'}`}
                        >
                            <motion.div
                                className="absolute top-1 w-5 h-5 bg-white rounded-full"
                                animate={{ left: isAnnual ? '32px' : '4px' }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={`text-sm ${isAnnual ? 'text-white' : 'text-white/50'}`}>
                            Annual
                        </span>
                        {isAnnual && (
                            <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold rounded-full">
                                Save 20%
                            </span>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-20 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 lg:gap-8">
                    {pricingTiers.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                        >
                            <GlassCard
                                className={`relative h-full flex flex-col ${tier.highlighted
                                        ? 'border-f1-red/50 shadow-[0_0_40px_rgba(207,44,40,0.15)]'
                                        : ''
                                    }`}
                                padding="lg"
                                glowColor={tier.highlighted ? 'red' : 'white'}
                            >
                                {tier.highlighted && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="px-4 py-1 bg-f1-red text-white text-xs font-bold uppercase tracking-wider rounded-full">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                                    <p className="text-white/50 text-sm">{tier.description}</p>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-white">
                                            ${isAnnual ? tier.annualPrice : tier.monthlyPrice}
                                        </span>
                                        <span className="text-white/50">/month</span>
                                    </div>
                                    {tier.monthlyPrice > 0 && isAnnual && (
                                        <p className="text-green-400 text-sm mt-1">
                                            Billed ${tier.annualPrice * 12}/year
                                        </p>
                                    )}
                                </div>

                                <ul className="space-y-3 mb-8 flex-grow">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-white/70 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to={tier.ctaLink}
                                    className={`block w-full py-3 text-center font-semibold rounded-lg transition-all ${tier.highlighted
                                            ? 'bg-f1-red hover:bg-f1-red/90 text-white hover:shadow-[0_0_30px_rgba(207,44,40,0.4)]'
                                            : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                                        }`}
                                >
                                    {tier.ctaText}
                                </Link>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Feature Comparison */}
            <section className="py-20 px-4 border-t border-white/10">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-racing text-center mb-12">
                        Compare Features
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-4 text-white/50 font-medium">Feature</th>
                                    <th className="py-4 text-center text-white/50 font-medium">Starter</th>
                                    <th className="py-4 text-center text-white/50 font-medium">Pro</th>
                                    <th className="py-4 text-center text-white/50 font-medium">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    ['Race Predictions', '5/season', 'Unlimited', 'Unlimited'],
                                    ['Simulations', '—', '50/mo', 'Unlimited'],
                                    ['API Access', '—', '1,000/mo', 'Unlimited'],
                                    ['Historical Data', 'Current season', '3 years', 'All (2014+)'],
                                    ['Support', 'Community', 'Priority', 'Dedicated'],
                                ].map(([feature, starter, pro, enterprise]) => (
                                    <tr key={feature} className="border-b border-white/5">
                                        <td className="py-4 text-white">{feature}</td>
                                        <td className="py-4 text-center text-white/60">{starter}</td>
                                        <td className="py-4 text-center text-white/60">{pro}</td>
                                        <td className="py-4 text-center text-white/60">{enterprise}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 border-t border-white/10">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-racing text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <GlassCard
                                key={index}
                                padding="none"
                                className="overflow-hidden"
                                interactive={false}
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-medium text-white">{faq.question}</span>
                                    <motion.svg
                                        animate={{ rotate: openFaq === index ? 180 : 0 }}
                                        className="w-5 h-5 text-white/50 flex-shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </motion.svg>
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: openFaq === index ? 'auto' : 0,
                                        opacity: openFaq === index ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <p className="px-6 pb-4 text-white/60">
                                        {faq.answer}
                                    </p>
                                </motion.div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 border-t border-white/10 bg-gradient-to-b from-transparent to-f1-red/5">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-racing mb-4">
                        Ready to Predict the Race?
                    </h2>
                    <p className="text-white/60 mb-8">
                        Join thousands of F1 fans using AI-powered predictions to enhance their race experience.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="px-8 py-3 bg-f1-red hover:bg-f1-red/90 text-white font-semibold rounded-lg transition-all hover:shadow-[0_0_30px_rgba(207,44,40,0.4)]"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            to="/"
                            className="px-8 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-lg border border-white/10 transition-all"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PricingPage;

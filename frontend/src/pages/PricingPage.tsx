import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Check, Zap, Trophy, Building2, ChevronDown } from 'lucide-react';

interface PricingTier {
    name: string;
    icon: React.ReactNode;
    description: string;
    monthlyPrice: number;
    annualPrice: number;
    features: string[];
    highlighted?: boolean;
    ctaText: string;
    ctaLink: string;
    accentColor: string;
}

const pricingTiers: PricingTier[] = [
    {
        name: 'Starter',
        icon: <Zap className="w-5 h-5" />,
        description: 'For casual F1 fans',
        monthlyPrice: 0,
        annualPrice: 0,
        features: [
            '5 predictions per season',
            'Basic qualifying analysis',
            'Driver standings tracker',
            'Race calendar alerts',
        ],
        ctaText: 'Get Started Free',
        ctaLink: '/signup',
        accentColor: '#3B82F6',
    },
    {
        name: 'Pro',
        icon: <Trophy className="w-5 h-5" />,
        description: 'For dedicated enthusiasts',
        monthlyPrice: 19,
        annualPrice: 15,
        features: [
            'Unlimited predictions',
            'Real-time simulations',
            'Strategy optimization',
            'Weather analysis',
            'API access (1K/mo)',
            'Priority support',
        ],
        highlighted: true,
        ctaText: 'Start Free Trial',
        ctaLink: '/signup?plan=pro',
        accentColor: '#E10600',
    },
    {
        name: 'Enterprise',
        icon: <Building2 className="w-5 h-5" />,
        description: 'For teams & pros',
        monthlyPrice: 99,
        annualPrice: 79,
        features: [
            'Everything in Pro',
            'Unlimited simulations',
            'Historical data (2014+)',
            'Custom models',
            'Telemetry deep-dive',
            'Unlimited API',
        ],
        ctaText: 'Contact Sales',
        ctaLink: '/signup?plan=enterprise',
        accentColor: '#8B5CF6',
    },
];

const faqs = [
    {
        question: 'How accurate are the predictions?',
        answer: 'Our AI models achieve 85-92% accuracy on race outcomes, validated across 5+ seasons.',
    },
    {
        question: 'Can I cancel anytime?',
        answer: 'Yes, cancel anytime with no hidden fees. Access continues until billing period ends.',
    },
    {
        question: 'Is there a free trial?',
        answer: 'Yes! Pro includes a 14-day free trial with full access. No credit card required.',
    },
    {
        question: 'What data powers predictions?',
        answer: 'Official F1 timing, weather APIs, historical data from 2014+, and telemetry analysis.',
    },
];

export const PricingPage: React.FC = () => {
    const [isAnnual, setIsAnnual] = useState(true);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <Header />

            {/* Hero + Pricing Cards with Driver Behind */}
            <section className="relative pt-24 pb-12 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-f1-red/5 via-transparent to-transparent" />

                {/* George Russell - Behind Right Side */}
                <div className="absolute top-16 -right-8 w-[450px] h-[700px] z-0 pointer-events-none hidden lg:block">
                    {/* Glow Effect */}
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[250px] h-[250px] bg-teal-500/30 rounded-full blur-[100px]" />
                    <img
                        src="/assets/drivers/george-russell-3.webp"
                        alt="George Russell"
                        className="absolute bottom-0 right-0 h-[600px] w-auto object-contain opacity-90"
                        style={{
                            maskImage: 'linear-gradient(to top, transparent 0%, black 25%)',
                            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 25%)'
                        }}
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
                    {/* Hero Row - Compact */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 mb-10">
                        {/* Left: Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex-1 text-center lg:text-left"
                        >
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-racing text-white mb-3">
                                Choose Your{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-f1-red to-orange-500">
                                    Plan
                                </span>
                            </h1>
                            <p className="text-white/50 max-w-md mx-auto lg:mx-0 mb-4">
                                Unlock AI-powered race predictions and analysis
                            </p>

                            {/* Billing Toggle */}
                            <div className="flex items-center gap-3 p-1.5 bg-white/5 rounded-full w-fit mx-auto lg:mx-0">
                                <button
                                    onClick={() => setIsAnnual(false)}
                                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${!isAnnual ? 'bg-white text-black' : 'text-white/50 hover:text-white'
                                        }`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setIsAnnual(true)}
                                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2 ${isAnnual ? 'bg-white text-black' : 'text-white/50 hover:text-white'
                                        }`}
                                >
                                    Annual
                                    <span className="px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded">
                                        -20%
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-3 gap-5 lg:pr-32">
                        {pricingTiers.map((tier, index) => (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                                className={`
                                    relative rounded-2xl overflow-hidden backdrop-blur-sm
                                    ${tier.highlighted
                                        ? 'bg-gradient-to-b from-white/[0.12] to-white/[0.04] ring-1 ring-f1-red/50'
                                        : 'bg-white/[0.04] ring-1 ring-white/[0.08]'
                                    }
                                `}
                            >
                                {/* Top Accent */}
                                <div
                                    className="h-0.5 w-full"
                                    style={{ background: `linear-gradient(90deg, ${tier.accentColor}, transparent)` }}
                                />

                                {tier.highlighted && (
                                    <div className="absolute top-3 right-3">
                                        <span className="px-2 py-0.5 bg-f1-red text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                                            Popular
                                        </span>
                                    </div>
                                )}

                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-center gap-2.5 mb-2">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: `${tier.accentColor}20`, color: tier.accentColor }}
                                        >
                                            {tier.icon}
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                                    </div>
                                    <p className="text-white/40 text-sm mb-4">{tier.description}</p>

                                    {/* Price */}
                                    <div className="mb-5">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold text-white">
                                                ${isAnnual ? tier.annualPrice : tier.monthlyPrice}
                                            </span>
                                            <span className="text-white/40 text-sm">/mo</span>
                                        </div>
                                        {tier.monthlyPrice > 0 && isAnnual && (
                                            <p className="text-white/30 text-xs mt-0.5">
                                                ${tier.annualPrice * 12}/year
                                            </p>
                                        )}
                                    </div>

                                    {/* CTA */}
                                    <Link
                                        to={tier.ctaLink}
                                        className={`
                                            block w-full py-3 text-center text-sm font-semibold rounded-xl transition-all mb-5
                                            ${tier.highlighted
                                                ? 'bg-f1-red hover:bg-f1-red/90 text-white'
                                                : 'bg-white/10 hover:bg-white/15 text-white'
                                            }
                                        `}
                                    >
                                        {tier.ctaText}
                                    </Link>

                                    {/* Features */}
                                    <ul className="space-y-2.5">
                                        {tier.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-2.5">
                                                <Check
                                                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                                                    style={{ color: tier.accentColor }}
                                                />
                                                <span className="text-white/60 text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof with Kimi Antonelli */}
            <section className="relative py-16 overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="relative rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.08] overflow-hidden">
                        <div className="grid lg:grid-cols-2 items-center">
                            {/* Left: Driver */}
                            <div className="relative h-[280px] lg:h-[320px]">
                                <div className="absolute bottom-0 left-1/4 w-[200px] h-[200px] bg-teal-500/30 rounded-full blur-[80px]" />
                                <img
                                    src="/assets/drivers/kimi-antonelli-3.webp"
                                    alt="Kimi Antonelli"
                                    className="absolute bottom-0 left-1/2 lg:left-1/3 -translate-x-1/2 lg:-translate-x-1/3 h-[260px] lg:h-[300px] w-auto object-contain"
                                />
                            </div>

                            {/* Right: Content */}
                            <div className="p-8 lg:p-10">
                                <h2 className="text-2xl md:text-3xl font-racing text-white mb-3">
                                    Trusted by{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                                        Thousands
                                    </span>
                                </h2>
                                <p className="text-white/50 mb-6 text-sm">
                                    Join F1 enthusiasts using AI-powered predictions and analysis.
                                </p>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <div className="text-2xl font-bold text-white">92%</div>
                                        <div className="text-white/40 text-xs">Accuracy</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">500+</div>
                                        <div className="text-white/40 text-xs">Races</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">&lt;50ms</div>
                                        <div className="text-white/40 text-xs">Response</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-racing text-center mb-8">Questions?</h2>
                    <div className="space-y-2">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                                >
                                    <span className="font-medium text-white text-sm">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-4 h-4 text-white/40 transition-transform ${openFaq === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: openFaq === index ? 'auto' : 0,
                                        opacity: openFaq === index ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <p className="px-5 pb-4 text-white/50 text-sm">{faq.answer}</p>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA with Isack Hadjar */}
            <section className="relative py-16 px-4 overflow-hidden">
                <div className="max-w-4xl mx-auto">
                    <div className="relative rounded-2xl bg-gradient-to-r from-f1-red/15 to-blue-500/15 border border-white/[0.08] overflow-hidden">
                        <div className="grid lg:grid-cols-2 items-center min-h-[280px]">
                            {/* Left: Content */}
                            <div className="p-8 lg:p-10">
                                <h2 className="text-2xl md:text-3xl font-racing mb-3">
                                    Ready to Start?
                                </h2>
                                <p className="text-white/50 mb-6 text-sm">
                                    Join the next generation of F1 analysis today.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        to="/signup"
                                        className="px-5 py-2.5 bg-f1-red hover:bg-f1-red/90 text-white text-sm font-semibold rounded-xl transition-all"
                                    >
                                        Start Free Trial
                                    </Link>
                                    <Link
                                        to="/"
                                        className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl border border-white/10"
                                    >
                                        Back to Home
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Driver - Arvid Lindblad */}
                            <div className="absolute inset-0 hidden lg:block pointer-events-none overflow-hidden">
                                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[120px]" />
                                <img
                                    src="/assets/drivers/arvid-lindblad-2.webp"
                                    alt="Arvid Lindblad"
                                    className="absolute bottom-0 right-0 h-full w-auto object-contain object-right-bottom"
                                    style={{
                                        maskImage: 'linear-gradient(to left, black 50%, transparent 95%)',
                                        WebkitMaskImage: 'linear-gradient(to left, black 50%, transparent 95%)'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PricingPage;

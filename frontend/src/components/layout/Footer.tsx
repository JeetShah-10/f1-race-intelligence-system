import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#050505] border-t border-white/[0.06]">
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Single Row Layout */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Left: Branding */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="flex gap-[2px]">
                            <div className="w-1 h-5 bg-f1-red rounded-sm" />
                            <div className="w-1 h-5 bg-f1-red/60 rounded-sm" />
                            <div className="w-1 h-5 bg-f1-red/30 rounded-sm" />
                        </div>
                        <span className="font-racing text-lg text-white tracking-wider">
                            APEX
                        </span>
                    </Link>

                    {/* Center: Navigation */}
                    <nav className="flex items-center gap-6">
                        <Link to="/" className="text-white/40 hover:text-white text-sm transition-colors">
                            Home
                        </Link>
                        <Link to="/season-2026" className="text-white/40 hover:text-white text-sm transition-colors">
                            2026 Era
                        </Link>
                        <Link to="/pricing" className="text-white/40 hover:text-white text-sm transition-colors">
                            Pricing
                        </Link>
                    </nav>

                    {/* Right: Social */}
                    <div className="flex items-center gap-2">
                        <a
                            href="https://github.com/JeetShah-10"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
                            aria-label="GitHub"
                        >
                            <Github className="w-4 h-4" />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
                            aria-label="Twitter"
                        >
                            <Twitter className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/20 text-xs">
                        © {currentYear} APEX Intelligence. Not affiliated with Formula 1®, FOM, or FIA.
                    </p>
                </div>
            </div>

            {/* Bottom Racing Stripe */}
            <div className="h-[2px] bg-gradient-to-r from-f1-red via-orange-500 to-f1-red" />
        </footer>
    );
};

export default Footer;

import React from 'react';
import { motion } from 'framer-motion';
import { glowPulse } from '@/lib/animations';

interface GlowButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    variant?: 'primary' | 'secondary';
    className?: string;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
    children,
    onClick,
    href,
    variant = 'primary',
    className = '',
}) => {
    const baseStyles = "relative px-8 py-3 font-racing text-lg tracking-widest uppercase transition-all duration-300 transform rounded-sm clip-path-slant";

    const variants = {
        primary: "bg-f1-red text-white hover:bg-red-600",
        secondary: "bg-transparent border border-f1-red text-f1-red hover:bg-f1-red/10",
    };

    const content = (
        <motion.button
            variants={glowPulse}
            initial="idle"
            animate="pulse"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onClick={onClick}
        >
            {children}

            {/* Speed lines effect */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/30 transform skew-x-[-15deg]" />
        </motion.button>
    );

    if (href) {
        return <a href={href}>{content}</a>;
    }

    return content;
};

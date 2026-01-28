import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: React.ReactNode;
    /** Intensity of glass blur effect */
    blur?: 'sm' | 'md' | 'lg' | 'xl';
    /** Border glow color on hover */
    glowColor?: 'red' | 'cyan' | 'orange' | 'white' | 'none';
    /** Whether card has hover effects */
    interactive?: boolean;
    /** Additional padding */
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const blurMap = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
};

const paddingMap = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
};

const glowColorMap = {
    red: 'hover:border-f1-red/40 hover:shadow-[0_0_30px_rgba(207,44,40,0.15)]',
    cyan: 'hover:border-neon-cyan/40 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)]',
    orange: 'hover:border-neon-orange/40 hover:shadow-[0_0_30px_rgba(255,165,0,0.15)]',
    white: 'hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]',
    none: '',
};

/**
 * GlassCard - Premium glassmorphism card component
 * 
 * Features:
 * - Frosted glass background effect
 * - Subtle border with optional glow on hover
 * - Smooth transitions and animations
 * - Configurable blur intensity and padding
 */
export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    blur = 'xl',
    glowColor = 'white',
    interactive = true,
    padding = 'md',
    className = '',
    ...motionProps
}) => {
    return (
        <motion.div
            className={`
                relative
                bg-white/[0.03]
                ${blurMap[blur]}
                border border-white/[0.08]
                rounded-2xl
                shadow-xl
                ${paddingMap[padding]}
                ${interactive ? `
                    transition-all duration-300 ease-out
                    hover:bg-white/[0.06]
                    ${glowColorMap[glowColor]}
                ` : ''}
                ${className}
            `.trim().replace(/\s+/g, ' ')}
            {...motionProps}
        >
            {/* Inner glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

/**
 * GlassCardHeader - Optional header section for GlassCard
 */
export const GlassCardHeader: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => (
    <div className={`border-b border-white/10 pb-4 mb-4 ${className}`}>
        {children}
    </div>
);

/**
 * GlassCardFooter - Optional footer section for GlassCard
 */
export const GlassCardFooter: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => (
    <div className={`border-t border-white/10 pt-4 mt-4 ${className}`}>
        {children}
    </div>
);

export default GlassCard;

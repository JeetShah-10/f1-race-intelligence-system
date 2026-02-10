import React from 'react';

export const CarbonFiber: React.FC<{ className?: string, opacity?: number }> = ({ className = '', opacity = 0.4 }) => {
    return (
        <div
            className={`absolute inset-0 pointer-events-none z-0 ${className}`}
            style={{
                backgroundImage: `
                    radial-gradient(black 15%, transparent 16%),
                    radial-gradient(black 15%, transparent 16%)
                `,
                backgroundSize: '4px 4px',
                backgroundPosition: '0 0, 2px 2px',
                backgroundColor: '#111111',
                opacity: opacity
            }}
        />
    );
};

export const NoiseOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
    return (
        <div
            className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${opacity}'/%3E%3C/svg%3E")`,
                opacity: opacity
            }}
        />
    );
};

export const MeshGrid: React.FC<{ className?: string, color?: string }> = ({ className = '', color = 'rgba(255, 255, 255, 0.05)' }) => {
    return (
        <div
            className={`absolute inset-0 pointer-events-none ${className}`}
            style={{
                backgroundImage: `
                    linear-gradient(${color} 1px, transparent 1px),
                    linear-gradient(90deg, ${color} 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
            }}
        />
    );
};

export const Scanline: React.FC = () => {
    return (
        <div
            className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-10"
            style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.3) 50%)', backgroundSize: '100% 4px' }}
        />
    );
};

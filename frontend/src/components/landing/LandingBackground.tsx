import React from 'react';

export const LandingBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="relative min-h-screen">
            <div
                className="fixed inset-0 z-0"
                aria-hidden
            >
                <div className="absolute inset-0 flex">
                    <div
                        className="flex-1 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/assets/backgrounds/bg-image-1.png')" }}
                    />
                    <div
                        className="flex-1 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/assets/backgrounds/bg-image-2.png')" }}
                    />
                    <div
                        className="flex-1 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/assets/backgrounds/bg-image-3.png')" }}
                    />
                </div>
                <div
                    className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/65 to-black/70"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                />
            </div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

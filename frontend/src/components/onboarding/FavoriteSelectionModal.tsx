/**
 * FavoriteSelectionModal - Premium F1-inspired onboarding modal
 * Features enhanced team cards, racing aesthetics, and smooth animations
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { TEAMS_2026_DATA, type Team2026 } from '../../data/teams2026';
import { DRIVERS_2026 } from '../../mocks/drivers';
import type { Driver } from '../../types/f1';

interface FavoriteSelectionModalProps {
    isOpen: boolean;
    onComplete: () => void;
}

// SVG Icons
const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

const FlagIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
);

export const FavoriteSelectionModal: React.FC<FavoriteSelectionModalProps> = ({
    isOpen,
    onComplete,
}) => {
    const { setFavorites, completeOnboarding, user } = useAppStore();
    const [step, setStep] = useState<'team' | 'driver'>('team');
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

    const teamDrivers = useMemo(() => {
        if (!selectedTeam) return [];
        return DRIVERS_2026.filter((d: Driver) => d.team === selectedTeam);
    }, [selectedTeam]);

    const selectedTeamData = TEAMS_2026_DATA.find(t => t.shortName === selectedTeam);

    const handleTeamSelect = (teamName: string) => {
        setSelectedTeam(teamName);
        setSelectedDriver(null);
    };

    const handleDriverSelect = (driverCode: string) => {
        setSelectedDriver(driverCode);
    };

    const handleContinue = () => {
        if (step === 'team' && selectedTeam) {
            setStep('driver');
        } else if (step === 'driver' && selectedDriver) {
            setFavorites(selectedTeam!, selectedDriver);
            completeOnboarding();
            onComplete();
        }
    };

    const handleSkip = () => {
        completeOnboarding();
        onComplete();
    };

    const handleBack = () => {
        setStep('team');
    };

    if (!isOpen) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.3 }
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
            >
                {/* Animated background lines */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{
                                x: '200%',
                                opacity: [0, 0.1, 0.1, 0],
                            }}
                            transition={{
                                duration: 3,
                                delay: i * 0.4,
                                repeat: Infinity,
                                repeatDelay: 2,
                                ease: 'linear',
                            }}
                            style={{
                                position: 'absolute',
                                top: `${15 + i * 18}%`,
                                left: 0,
                                width: '40%',
                                height: '1px',
                                background: `linear-gradient(90deg, transparent, ${selectedTeamData?.color || '#E8002D'}40, transparent)`,
                            }}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ scale: 0.92, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                    style={{
                        width: '100%',
                        maxWidth: '780px',
                        maxHeight: '88vh',
                        background: 'rgba(12, 12, 16, 0.95)',
                        backdropFilter: 'blur(24px)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: `
                            0 32px 64px rgba(0, 0, 0, 0.6),
                            inset 0 1px 0 rgba(255, 255, 255, 0.05)
                        `,
                    }}
                >
                    {/* Corner accents - F1 Style */}
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '24px',
                        height: '24px',
                        borderTop: '2px solid rgba(255, 255, 255, 0.1)',
                        borderRight: '2px solid rgba(255, 255, 255, 0.1)',
                        pointerEvents: 'none',
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        width: '24px',
                        height: '24px',
                        borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                        borderLeft: '2px solid rgba(255, 255, 255, 0.1)',
                        pointerEvents: 'none',
                    }} />

                    {/* Header */}
                    <div
                        style={{
                            padding: '28px 36px',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                            position: 'relative',
                        }}
                    >
                        {/* Progress bar accent */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: step === 'team' ? '50%' : '100%',
                                height: '3px',
                                background: `linear-gradient(90deg, ${selectedTeamData?.color || '#E8002D'} 0%, ${selectedTeamData?.secondaryColor || '#FF4D6D'} 100%)`,
                                transformOrigin: 'left',
                                transition: 'width 0.4s ease',
                            }}
                        />

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <motion.p
                                    key={step}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        color: selectedTeamData?.color || '#E8002D',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        letterSpacing: '0.15em',
                                        marginBottom: '6px',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Welcome, {user.name?.toUpperCase() || 'DRIVER'}
                                </motion.p>
                                <motion.h2
                                    key={`title-${step}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        color: 'white',
                                        fontSize: '28px',
                                        fontWeight: 800,
                                        margin: 0,
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    {step === 'team' ? 'Select Your Team' : 'Select Your Driver'}
                                </motion.h2>
                            </div>

                            {/* Step indicators */}
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: step === 'team'
                                        ? `linear-gradient(135deg, ${selectedTeamData?.color || '#E8002D'} 0%, ${selectedTeamData?.secondaryColor || '#FF4D6D'} 100%)`
                                        : 'rgba(255, 255, 255, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: 'white',
                                    transition: 'all 0.3s ease',
                                }}>
                                    {step === 'driver' ? <CheckIcon /> : '1'}
                                </div>
                                <div style={{
                                    width: '20px',
                                    height: '2px',
                                    background: step === 'driver'
                                        ? (selectedTeamData?.color || '#E8002D')
                                        : 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '1px',
                                    transition: 'all 0.3s ease',
                                }} />
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: step === 'driver'
                                        ? `linear-gradient(135deg, ${selectedTeamData?.color || '#E8002D'} 0%, ${selectedTeamData?.secondaryColor || '#FF4D6D'} 100%)`
                                        : 'rgba(255, 255, 255, 0.08)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: step === 'driver' ? 'white' : 'rgba(255, 255, 255, 0.3)',
                                    transition: 'all 0.3s ease',
                                }}>
                                    2
                                </div>
                            </div>
                        </div>

                        <motion.p
                            key={`desc-${step}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            style={{
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontSize: '14px',
                                marginTop: '10px',
                            }}
                        >
                            {step === 'team'
                                ? 'Your dashboard will highlight your team\'s performance and updates'
                                : 'Track your driver\'s progress throughout the season'}
                        </motion.p>
                    </div>

                    {/* Content */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '24px 36px',
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {step === 'team' ? (
                                <motion.div
                                    key="team-grid"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                                        gap: '14px',
                                    }}
                                >
                                    {TEAMS_2026_DATA.map((team: Team2026) => (
                                        <motion.button
                                            key={team.id}
                                            variants={cardVariants}
                                            whileHover={{
                                                y: -4,
                                                boxShadow: `0 16px 32px rgba(0,0,0,0.4), 0 0 24px ${team.color}30`,
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleTeamSelect(team.shortName)}
                                            style={{
                                                position: 'relative',
                                                padding: '20px',
                                                borderRadius: '14px',
                                                border: selectedTeam === team.shortName
                                                    ? `2px solid ${team.color}`
                                                    : '1px solid rgba(255, 255, 255, 0.08)',
                                                backgroundColor: selectedTeam === team.shortName
                                                    ? `${team.color}12`
                                                    : 'rgba(255, 255, 255, 0.02)',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'all 0.25s ease',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {/* Selection checkmark */}
                                            {selectedTeam === team.shortName && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '12px',
                                                        right: '12px',
                                                        width: '22px',
                                                        height: '22px',
                                                        borderRadius: '6px',
                                                        background: team.color,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <CheckIcon />
                                                </motion.div>
                                            )}

                                            {/* Team color bar */}
                                            <div
                                                style={{
                                                    width: '40px',
                                                    height: '4px',
                                                    borderRadius: '2px',
                                                    background: `linear-gradient(90deg, ${team.color} 0%, ${team.secondaryColor || team.color} 100%)`,
                                                    marginBottom: '14px',
                                                    boxShadow: selectedTeam === team.shortName
                                                        ? `0 0 12px ${team.color}60`
                                                        : 'none',
                                                    transition: 'box-shadow 0.3s ease',
                                                }}
                                            />

                                            <h3 style={{
                                                color: 'white',
                                                fontSize: '15px',
                                                fontWeight: 700,
                                                margin: 0,
                                            }}>
                                                {team.shortName}
                                            </h3>
                                            <p style={{
                                                color: 'rgba(255, 255, 255, 0.45)',
                                                fontSize: '12px',
                                                marginTop: '6px',
                                            }}>
                                                {team.drivers.join(' • ')}
                                            </p>
                                        </motion.button>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="driver-grid"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, x: 20 }}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '18px',
                                    }}
                                >
                                    {teamDrivers.map((driver: Driver) => (
                                        <motion.button
                                            key={driver.code}
                                            variants={cardVariants}
                                            whileHover={{
                                                y: -4,
                                                boxShadow: `0 16px 32px rgba(0,0,0,0.4), 0 0 30px ${driver.teamColor}30`,
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleDriverSelect(driver.code)}
                                            style={{
                                                position: 'relative',
                                                padding: '24px',
                                                borderRadius: '14px',
                                                border: selectedDriver === driver.code
                                                    ? `2px solid ${driver.teamColor}`
                                                    : '1px solid rgba(255, 255, 255, 0.08)',
                                                backgroundColor: selectedDriver === driver.code
                                                    ? `${driver.teamColor}12`
                                                    : 'rgba(255, 255, 255, 0.02)',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'all 0.25s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '20px',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {/* Selection checkmark */}
                                            {selectedDriver === driver.code && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '14px',
                                                        right: '14px',
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '6px',
                                                        background: driver.teamColor,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <CheckIcon />
                                                </motion.div>
                                            )}

                                            {/* Driver number */}
                                            <div
                                                style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    borderRadius: '16px',
                                                    background: `linear-gradient(135deg, ${driver.teamColor} 0%, ${driver.teamColor}80 100%)`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '24px',
                                                    fontWeight: 800,
                                                    color: 'white',
                                                    boxShadow: selectedDriver === driver.code
                                                        ? `0 0 24px ${driver.teamColor}50`
                                                        : 'none',
                                                    transition: 'box-shadow 0.3s ease',
                                                }}
                                            >
                                                {driver.number}
                                            </div>

                                            <div>
                                                <h3 style={{
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    margin: 0,
                                                }}>
                                                    {driver.firstName}
                                                </h3>
                                                <h4 style={{
                                                    color: 'white',
                                                    fontSize: '22px',
                                                    fontWeight: 800,
                                                    margin: '2px 0 0 0',
                                                    letterSpacing: '-0.01em',
                                                }}>
                                                    {driver.lastName.toUpperCase()}
                                                </h4>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    marginTop: '6px',
                                                }}>
                                                    <FlagIcon />
                                                    <p style={{
                                                        color: 'rgba(255, 255, 255, 0.45)',
                                                        fontSize: '12px',
                                                        margin: 0,
                                                    }}>
                                                        {driver.nationality}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            padding: '24px 36px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <motion.button
                            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={step === 'team' ? handleSkip : handleBack}
                            style={{
                                padding: '14px 24px',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                backgroundColor: 'transparent',
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {step === 'driver' && <ArrowLeftIcon />}
                            {step === 'team' ? 'Skip for Now' : 'Back'}
                        </motion.button>

                        <motion.button
                            whileHover={{
                                scale: 1.02,
                                boxShadow: `0 8px 24px ${selectedTeamData?.color || '#E8002D'}40`,
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleContinue}
                            disabled={(step === 'team' && !selectedTeam) || (step === 'driver' && !selectedDriver)}
                            style={{
                                padding: '14px 32px',
                                borderRadius: '10px',
                                border: 'none',
                                background: (step === 'team' && selectedTeam) || (step === 'driver' && selectedDriver)
                                    ? `linear-gradient(135deg, ${selectedTeamData?.color || '#E8002D'} 0%, ${selectedTeamData?.secondaryColor || '#FF4D6D'} 100%)`
                                    : 'rgba(255, 255, 255, 0.08)',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: (step === 'team' && selectedTeam) || (step === 'driver' && selectedDriver)
                                    ? 'pointer'
                                    : 'not-allowed',
                                opacity: (step === 'team' && selectedTeam) || (step === 'driver' && selectedDriver)
                                    ? 1
                                    : 0.4,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.25s ease',
                            }}
                        >
                            {step === 'team' ? 'Continue' : 'Start Racing'}
                            <ArrowRightIcon />
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FavoriteSelectionModal;



import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { TEAMS_2026_DATA } from '../../data/teams2026';
import { getDriverByCode } from '../../mocks/drivers';


const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const GridIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
);

const ChartIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

const LogOutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const ChevronIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

export const UserProfileDropdown: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAppStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const favoriteTeamData = TEAMS_2026_DATA.find(t => t.shortName === user.favoriteTeam);
    const favoriteDriverData = user.favoriteDriver ? getDriverByCode(user.favoriteDriver) : null;

    const teamColor = favoriteTeamData?.color || '#E8002D';
    const teamSecondaryColor = favoriteTeamData?.secondaryColor || '#FF4D6D';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    const handleProfileClick = () => {
        navigate('/profile');
        setIsOpen(false);
    };

    // Animation variants
    const dropdownVariants = {
        hidden: {
            opacity: 0,
            y: 8,
            scale: 0.96,
            transition: { duration: 0.15 }
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -8 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.04, duration: 0.2 }
        })
    };

    return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'relative',
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    padding: '3px',
                    background: `linear-gradient(135deg, ${teamColor} 0%, ${teamSecondaryColor} 100%)`,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: isOpen
                        ? `0 0 20px ${teamColor}60, 0 0 40px ${teamColor}30`
                        : `0 4px 12px rgba(0, 0, 0, 0.4)`,
                    transition: 'box-shadow 0.3s ease',
                }}
            >

                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: 'linear-gradient(145deg, #1a1a1f 0%, #0d0d10 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'white',
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>


                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#00D26A',
                        border: '2px solid #0d0d10',
                        boxShadow: '0 0 8px #00D26A80',
                    }}
                />
            </motion.button>


            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 12px)',
                            right: 0,
                            width: '300px',
                            zIndex: 1000,
                            borderRadius: '16px',
                            overflow: 'hidden',
                            background: 'rgba(15, 15, 20, 0.85)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: `
                                0 24px 48px rgba(0, 0, 0, 0.5),
                                0 0 1px rgba(255, 255, 255, 0.1),
                                inset 0 1px 0 rgba(255, 255, 255, 0.05)
                            `,
                        }}
                    >

                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: `linear-gradient(90deg, ${teamColor} 0%, ${teamSecondaryColor} 50%, transparent 100%)`,
                                transformOrigin: 'left',
                            }}
                        />


                        <div style={{ padding: '20px', paddingTop: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

                                <div
                                    style={{
                                        position: 'relative',
                                        width: '52px',
                                        height: '52px',
                                        borderRadius: '50%',
                                        padding: '2px',
                                        background: `linear-gradient(135deg, ${teamColor} 0%, ${teamSecondaryColor} 100%)`,
                                        boxShadow: `0 0 16px ${teamColor}40`,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(145deg, #1a1a1f 0%, #0d0d10 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '20px',
                                            fontWeight: 700,
                                            color: 'white',
                                        }}
                                    >
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h4 style={{
                                        color: 'white',
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        margin: 0,
                                        letterSpacing: '-0.01em',
                                    }}>
                                        {user.name || 'User'}
                                    </h4>
                                    <p style={{
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        fontSize: '12px',
                                        margin: '2px 0 0 0',
                                    }}>
                                        {user.email}
                                    </p>

                                    {user.tier === 'premium' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                marginTop: '6px',
                                                padding: '3px 8px',
                                                borderRadius: '4px',
                                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                                fontSize: '10px',
                                                fontWeight: 700,
                                                color: '#000',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                            }}
                                        >
                                            PRO
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>


                        {(favoriteTeamData || favoriteDriverData) && (
                            <div
                                style={{
                                    margin: '0 12px',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                }}
                            >
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {favoriteTeamData && (
                                        <div style={{ flex: 1 }}>
                                            <p style={{
                                                color: 'rgba(255, 255, 255, 0.4)',
                                                fontSize: '9px',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.08em',
                                                margin: '0 0 6px 0',
                                            }}>
                                                Team
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div
                                                    style={{
                                                        width: '4px',
                                                        height: '20px',
                                                        borderRadius: '2px',
                                                        background: favoriteTeamData.color,
                                                        boxShadow: `0 0 8px ${favoriteTeamData.color}60`,
                                                    }}
                                                />
                                                <span style={{
                                                    color: 'white',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                }}>
                                                    {favoriteTeamData.shortName}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {favoriteDriverData && (
                                        <div style={{ flex: 1 }}>
                                            <p style={{
                                                color: 'rgba(255, 255, 255, 0.4)',
                                                fontSize: '9px',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.08em',
                                                margin: '0 0 6px 0',
                                            }}>
                                                Driver
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div
                                                    style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '6px',
                                                        background: `linear-gradient(135deg, ${favoriteDriverData.teamColor} 0%, ${favoriteDriverData.teamColor}80 100%)`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '10px',
                                                        fontWeight: 800,
                                                        color: 'white',
                                                    }}
                                                >
                                                    {favoriteDriverData.number}
                                                </div>
                                                <span style={{
                                                    color: 'white',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                }}>
                                                    {favoriteDriverData.code}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}


                        <div style={{ padding: '8px 8px 4px 8px', marginTop: '8px' }}>
                            <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                                <MenuItem
                                    icon={<UserIcon />}
                                    label="Profile Settings"
                                    onClick={handleProfileClick}
                                    teamColor={teamColor}
                                />
                            </motion.div>
                            <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                                <MenuItem
                                    icon={<GridIcon />}
                                    label="Dashboard"
                                    onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                                    teamColor={teamColor}
                                />
                            </motion.div>
                            <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                                <MenuItem
                                    icon={<ChartIcon />}
                                    label="Analyze Data"
                                    onClick={() => { navigate('/analyze'); setIsOpen(false); }}
                                    teamColor={teamColor}
                                    showArrow
                                />
                            </motion.div>
                        </div>


                        <div
                            style={{
                                padding: '4px 8px 8px 8px',
                                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                                marginTop: '4px',
                            }}
                        >
                            <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                                <MenuItem
                                    icon={<LogOutIcon />}
                                    label="Sign Out"
                                    onClick={handleLogout}
                                    danger
                                    teamColor={teamColor}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    danger?: boolean;
    showArrow?: boolean;
    teamColor?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    label,
    onClick,
    danger,
    showArrow,
    teamColor = '#E8002D'
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            style={{
                position: 'relative',
                width: '100%',
                padding: '11px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isHovered
                    ? (danger ? 'rgba(255, 77, 77, 0.1)' : 'rgba(255, 255, 255, 0.05)')
                    : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: danger ? '#FF6B6B' : 'rgba(255, 255, 255, 0.85)',
                fontSize: '13px',
                fontWeight: 500,
                textAlign: 'left',
                transition: 'all 0.15s ease',
                overflow: 'hidden',
            }}
        >

            <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: isHovered && !danger ? 1 : 0 }}
                transition={{ duration: 0.15 }}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    bottom: '20%',
                    width: '3px',
                    borderRadius: '0 2px 2px 0',
                    background: teamColor,
                    transformOrigin: 'center',
                }}
            />

            <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.7,
                transition: 'opacity 0.15s ease',
            }}>
                {icon}
            </span>
            <span style={{ flex: 1 }}>{label}</span>
            {showArrow && (
                <span style={{ opacity: 0.4 }}>
                    <ChevronIcon />
                </span>
            )}
        </motion.button>
    );
};

export default UserProfileDropdown;

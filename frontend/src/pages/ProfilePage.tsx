/**
 * ProfilePage - Premium F1-inspired user profile and settings
 * Features team-colored hero, telemetry-style stats, racing aesthetics, and team assets
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { TEAMS_2026_DATA } from '../data/f1-data';
import { getDriverByCode } from '../mocks/drivers';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';

// Team logo path mapping
const getTeamLogoPath = (shortName: string): string => {
    const logoMap: Record<string, string> = {
        'Red Bull Racing': '/assets/logos/redbull-logo.webp',
        'Ferrari': '/assets/logos/ferrari-logo.webp',
        'McLaren': '/assets/logos/mclaren-logo.webp',
        'Mercedes': '/assets/logos/mercedes-logo.webp',
        'Aston Martin': '/assets/logos/aston-martin.webp',
        'Alpine': '/assets/logos/alpine-logo.webp',
        'Williams': '/assets/logos/williams-logo.webp',
        'Racing Bulls': '/assets/logos/racingbulls-logo.webp',
        'Audi': '/assets/logos/audi-logo.webp',
        'Haas': '/assets/logos/haas-logo.webp',
        'Cadillac': '/assets/logos/cadillac-logo.webp',
    };
    return logoMap[shortName] || '/assets/logos/f1-logo.webp';
};

// SVG Icons
const EditIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

const LogOutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, setUser, logout, isSidebarOpen, toggleSidebar } = useAppStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user.name || '');

    const favoriteTeamData = TEAMS_2026_DATA.find(t => t.shortName === user.favoriteTeam);
    const favoriteDriverData = user.favoriteDriver ? getDriverByCode(user.favoriteDriver) : null;

    const teamColor = favoriteTeamData?.color || '#E8002D';
    const teamSecondaryColor = favoriteTeamData?.secondaryColor || '#FF4D6D';
    const teamLogoPath = favoriteTeamData ? getTeamLogoPath(favoriteTeamData.shortName) : '/assets/logos/f1-logo.webp';

    const handleSaveName = () => {
        setUser({ name: editName });
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <DashboardLayout sidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} hideSidebar>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    minHeight: '100%',
                    background: '#0a0a0c',
                }}
            >
                {/* Hero Section with Team Color and Carbon Texture */}
                <motion.div
                    variants={itemVariants}
                    style={{
                        position: 'relative',
                        padding: '48px 32px 100px',
                        background: `linear-gradient(180deg, ${teamColor}20 0%, ${teamColor}08 50%, transparent 100%)`,
                        overflow: 'hidden',
                    }}
                >
                    {/* Carbon fiber texture overlay */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: 'url(/assets/textures/carbon-forged.png)',
                            backgroundSize: '200px',
                            opacity: 0.04,
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Racing stripe accent */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: `linear-gradient(90deg, ${teamColor} 0%, ${teamSecondaryColor} 50%, transparent 100%)`,
                            transformOrigin: 'left',
                        }}
                    />

                    {/* Team logo watermark */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 0.06, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '40px',
                            width: '180px',
                            height: '180px',
                            pointerEvents: 'none',
                        }}
                    >
                        <img
                            src={teamLogoPath}
                            alt=""
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                filter: 'brightness(1.5) grayscale(0.3)',
                            }}
                        />
                    </motion.div>

                    <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                color: teamColor,
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                marginBottom: '8px',
                                fontFamily: '"Raceline Demo", sans-serif',
                            }}
                        >
                            Driver Profile
                        </motion.p>
                        <h1 style={{
                            color: 'white',
                            fontSize: '42px',
                            fontWeight: 800,
                            margin: 0,
                            letterSpacing: '-0.02em',
                            fontFamily: '"Neospeed-Demo", sans-serif',
                        }}>
                            Profile Settings
                        </h1>
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: '15px',
                            marginTop: '8px',
                            maxWidth: '400px',
                        }}>
                            Manage your account, preferences, and racing identity
                        </p>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div style={{
                    maxWidth: '900px',
                    margin: '-60px auto 0',
                    padding: '0 32px 48px',
                    position: 'relative',
                }}>
                    {/* Profile Card */}
                    <motion.div
                        variants={itemVariants}
                        style={{
                            background: 'rgba(15, 15, 20, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '20px',
                            border: `1px solid ${teamColor}30`,
                            padding: '28px',
                            marginBottom: '24px',
                            boxShadow: `0 24px 48px rgba(0, 0, 0, 0.4), 0 0 60px ${teamColor}08`,
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Subtle team logo in card background */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                width: '140px',
                                height: '140px',
                                opacity: 0.04,
                                pointerEvents: 'none',
                            }}
                        >
                            <img
                                src={teamLogoPath}
                                alt=""
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', position: 'relative' }}>
                            {/* Large Avatar with Team Ring */}
                            <div
                                style={{
                                    position: 'relative',
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    padding: '4px',
                                    background: `linear-gradient(135deg, ${teamColor} 0%, ${teamSecondaryColor} 100%)`,
                                    boxShadow: `0 0 32px ${teamColor}50`,
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
                                        fontSize: '36px',
                                        fontWeight: 700,
                                        color: 'white',
                                        fontFamily: '"Neospeed-Demo", sans-serif',
                                    }}
                                >
                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                </div>

                                {/* Driver number badge */}
                                {favoriteDriverData && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: '-4px',
                                            right: '-4px',
                                            width: '38px',
                                            height: '38px',
                                            borderRadius: '10px',
                                            background: `linear-gradient(135deg, ${favoriteDriverData.teamColor} 0%, ${favoriteDriverData.teamColor}80 100%)`,
                                            border: '3px solid #0a0a0c',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '13px',
                                            fontWeight: 800,
                                            color: 'white',
                                            fontFamily: '"Raceburst Free Trial", sans-serif',
                                        }}
                                    >
                                        {favoriteDriverData.number}
                                    </div>
                                )}
                            </div>

                            {/* User Info */}
                            <div style={{ flex: 1 }}>
                                {isEditing ? (
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            autoFocus
                                            style={{
                                                flex: 1,
                                                padding: '14px 18px',
                                                borderRadius: '10px',
                                                border: `2px solid ${teamColor}40`,
                                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                                color: 'white',
                                                fontSize: '16px',
                                                fontWeight: 500,
                                                outline: 'none',
                                                transition: 'border-color 0.2s ease',
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = teamColor}
                                            onBlur={(e) => e.target.style.borderColor = `${teamColor}40`}
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSaveName}
                                            style={{
                                                padding: '14px 24px',
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: `linear-gradient(135deg, ${teamColor} 0%, ${teamSecondaryColor} 100%)`,
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                            }}
                                        >
                                            <CheckIcon />
                                            Save
                                        </motion.button>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <h2 style={{
                                                color: 'white',
                                                fontSize: '28px',
                                                fontWeight: 700,
                                                margin: 0,
                                                letterSpacing: '-0.01em',
                                                fontFamily: '"Neospeed-Demo", sans-serif',
                                            }}>
                                                {user.name || 'User'}
                                            </h2>
                                            {/* Tier Badge */}
                                            <span
                                                style={{
                                                    padding: '5px 12px',
                                                    borderRadius: '6px',
                                                    background: user.tier === 'premium'
                                                        ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                                                        : 'rgba(255, 255, 255, 0.1)',
                                                    color: user.tier === 'premium' ? '#000' : 'rgba(255, 255, 255, 0.7)',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    fontFamily: '"Raceline Demo", sans-serif',
                                                }}
                                            >
                                                {user.tier === 'premium' ? 'PRO' : user.tier}
                                            </span>
                                        </div>
                                        <p style={{
                                            color: 'rgba(255, 255, 255, 0.5)',
                                            fontSize: '14px',
                                            marginTop: '6px',
                                            marginBottom: 0,
                                        }}>
                                            {user.email}
                                        </p>
                                        <p style={{
                                            color: 'rgba(255, 255, 255, 0.35)',
                                            fontSize: '12px',
                                            marginTop: '4px',
                                        }}>
                                            Member since February 2026
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Edit Button */}
                            {!isEditing && (
                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        padding: '12px 20px',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <EditIcon />
                                    Edit
                                </motion.button>
                            )}
                        </div>
                    </motion.div>

                    {/* Favorites Section */}
                    <motion.div variants={itemVariants}>
                        <h3 style={{
                            color: 'rgba(255, 255, 255, 0.4)',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            marginBottom: '16px',
                            fontFamily: '"Raceline Demo", sans-serif',
                        }}>
                            Your Racing Identity
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            {/* Favorite Team Card */}
                            <motion.div
                                whileHover={{ y: -4, boxShadow: `0 20px 40px rgba(0, 0, 0, 0.5), 0 0 40px ${favoriteTeamData?.color || teamColor}25` }}
                                style={{
                                    background: 'rgba(15, 15, 20, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '16px',
                                    border: favoriteTeamData
                                        ? `1px solid ${favoriteTeamData.color}40`
                                        : '1px solid rgba(255, 255, 255, 0.08)',
                                    padding: '24px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {/* Team color accent */}
                                {favoriteTeamData && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '3px',
                                            background: `linear-gradient(90deg, ${favoriteTeamData.color} 0%, ${favoriteTeamData.secondaryColor || favoriteTeamData.color} 100%)`,
                                        }}
                                    />
                                )}

                                <p style={{
                                    color: 'rgba(255, 255, 255, 0.4)',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    marginBottom: '16px',
                                    fontFamily: '"Raceline Demo", sans-serif',
                                }}>
                                    Favorite Team
                                </p>

                                {favoriteTeamData ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        {/* Team Logo */}
                                        <div
                                            style={{
                                                width: '56px',
                                                height: '56px',
                                                borderRadius: '12px',
                                                background: `linear-gradient(135deg, ${favoriteTeamData.color}30 0%, ${favoriteTeamData.color}10 100%)`,
                                                border: `1px solid ${favoriteTeamData.color}30`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '8px',
                                            }}
                                        >
                                            <img
                                                src={getTeamLogoPath(favoriteTeamData.shortName)}
                                                alt={favoriteTeamData.shortName}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <p style={{
                                                color: 'white',
                                                fontSize: '18px',
                                                fontWeight: 700,
                                                margin: 0,
                                                fontFamily: '"Neospeed-Demo", sans-serif',
                                            }}>
                                                {favoriteTeamData.shortName}
                                            </p>
                                            <p style={{
                                                color: 'rgba(255, 255, 255, 0.4)',
                                                fontSize: '12px',
                                                margin: '2px 0 0 0',
                                            }}>
                                                {favoriteTeamData.drivers.join(' | ')}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px' }}>
                                        No team selected
                                    </p>
                                )}
                            </motion.div>

                            {/* Favorite Driver Card */}
                            <motion.div
                                whileHover={{ y: -4, boxShadow: `0 20px 40px rgba(0, 0, 0, 0.5), 0 0 40px ${favoriteDriverData?.teamColor || teamColor}25` }}
                                style={{
                                    background: 'rgba(15, 15, 20, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '16px',
                                    border: favoriteDriverData
                                        ? `1px solid ${favoriteDriverData.teamColor}40`
                                        : '1px solid rgba(255, 255, 255, 0.08)',
                                    padding: '24px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {/* Driver team color accent */}
                                {favoriteDriverData && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '3px',
                                            background: favoriteDriverData.teamColor,
                                        }}
                                    />
                                )}

                                <p style={{
                                    color: 'rgba(255, 255, 255, 0.4)',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    marginBottom: '16px',
                                    fontFamily: '"Raceline Demo", sans-serif',
                                }}>
                                    Favorite Driver
                                </p>

                                {favoriteDriverData ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        {/* Driver number */}
                                        <div
                                            style={{
                                                width: '56px',
                                                height: '56px',
                                                borderRadius: '12px',
                                                background: `linear-gradient(135deg, ${favoriteDriverData.teamColor} 0%, ${favoriteDriverData.teamColor}80 100%)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '20px',
                                                fontWeight: 800,
                                                color: 'white',
                                                fontFamily: '"Raceburst Free Trial", sans-serif',
                                                boxShadow: `0 0 20px ${favoriteDriverData.teamColor}40`,
                                            }}
                                        >
                                            {favoriteDriverData.number}
                                        </div>
                                        <div>
                                            <p style={{
                                                color: 'white',
                                                fontSize: '18px',
                                                fontWeight: 700,
                                                margin: 0,
                                                fontFamily: '"Neospeed-Demo", sans-serif',
                                            }}>
                                                {favoriteDriverData.firstName} {favoriteDriverData.lastName}
                                            </p>
                                            <p style={{
                                                color: 'rgba(255, 255, 255, 0.4)',
                                                fontSize: '12px',
                                                margin: '2px 0 0 0',
                                            }}>
                                                {favoriteDriverData.nationality}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px' }}>
                                        No driver selected
                                    </p>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        variants={itemVariants}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '24px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/dashboard')}
                            style={{
                                padding: '14px 24px',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <ArrowLeftIcon />
                            Back to Dashboard
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 77, 77, 0.15)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogout}
                            style={{
                                padding: '14px 24px',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 77, 77, 0.3)',
                                backgroundColor: 'rgba(255, 77, 77, 0.08)',
                                color: '#FF6B6B',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <LogOutIcon />
                            Sign Out
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default ProfilePage;

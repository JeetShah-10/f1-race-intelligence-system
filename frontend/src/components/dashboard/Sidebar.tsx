import React from 'react';
import { motion } from 'framer-motion';
import { InsightsWidget } from './widgets/InsightsWidget';
import { RecentWorkWidget } from './widgets/RecentWorkWidget';

export const Sidebar: React.FC = () => {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                type: 'spring' as const,
                stiffness: 300,
                damping: 24
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-4 p-4 h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4"
            >
                <motion.div variants={itemVariants} className="flex-none">
                    <InsightsWidget />
                </motion.div>

                <motion.div variants={itemVariants} className="flex-1 min-h-0">
                    <RecentWorkWidget />
                </motion.div>
            </motion.div>
        </div>
    );
};

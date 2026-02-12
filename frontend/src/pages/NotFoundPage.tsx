import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
            <Header />

            <main className="flex-grow flex items-center justify-center relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-f1-red/5 to-transparent pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-f1-red/20 blur-[120px] rounded-full pointer-events-none" />

                <div className="text-center z-10 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-[150px] md:text-[200px] font-racing text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 leading-none select-none">
                            404
                        </h1>
                        <div className="h-1 w-32 bg-f1-red mx-auto mb-8 rounded-full" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-2xl md:text-3xl font-bold text-white mb-4"
                    >
                        Yellow Flag - Sector 1
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-white/60 max-w-md mx-auto mb-10 text-lg"
                    >
                        We looked everywhere but couldn't find that apex. The page you are looking for might have been retired.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-f1-red hover:bg-f1-red/90 text-white rounded-xl font-bold transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(207,44,40,0.4)]"
                        >
                            Return to Pits
                        </Link>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default NotFoundPage;

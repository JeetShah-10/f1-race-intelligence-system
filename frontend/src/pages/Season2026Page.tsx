import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Toaster } from 'sonner';
import { Season2026Hero } from '../components/season2026/Season2026Hero';
import { AeroSection } from '../components/season2026/AeroSection';
import { PowerSection } from '../components/season2026/PowerSection';
import { MachineSection } from '../components/season2026/MachineSection';
import { GridSection } from '../components/season2026/GridSection';

const Season2026Page = () => {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-neon-cyan selection:text-black font-sans">
            <Toaster position="top-center" expand={true} richColors theme="dark" />

            <Header />

            <main className="flex flex-col w-full overflow-hidden">
                <Season2026Hero />
                <MachineSection />
                <AeroSection />
                <PowerSection />
                <GridSection />
            </main>

            <Footer />
        </div>
    );
};

export default Season2026Page;

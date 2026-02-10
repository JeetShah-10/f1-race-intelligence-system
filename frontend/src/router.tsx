import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { useAppStore } from './store';


const PageLoader = () => (
    <div className="min-h-screen bg-[#0B0D10] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-[#CF2C28] border-t-transparent rounded-full animate-spin" />
            <span className="text-white/50 text-sm">Loading...</span>
        </div>
    </div>
);


const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(m => ({ default: m.SignupPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PredictPage = lazy(() => import('./pages/PredictPage').then(m => ({ default: m.PredictPage })));
const SimulatePage = lazy(() => import('./pages/SimulatePage').then(m => ({ default: m.SimulatePage })));
const AnalyzePage = lazy(() => import('./pages/AnalyzePage').then(m => ({ default: m.AnalyzePage })));
const TelemetryPage = lazy(() => import('./pages/analyze/TelemetryPage').then(m => ({ default: m.TelemetryPage })));
const LapTimesPage = lazy(() => import('./pages/analyze/LapTimesPage').then(m => ({ default: m.LapTimesPage })));
const StrategyPage = lazy(() => import('./pages/analyze/StrategyPage').then(m => ({ default: m.StrategyPage })));
const SeasonPage = lazy(() => import('./pages/analyze/SeasonPage').then(m => ({ default: m.SeasonPage })));
const DriverVsPage = lazy(() => import('./pages/analyze/DriverVsPage').then(m => ({ default: m.DriverVsPage })));
const ConstructorVsPage = lazy(() => import('./pages/analyze/ConstructorVsPage').then(m => ({ default: m.ConstructorVsPage })));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const Season2026Page = lazy(() => import('./pages/Season2026Page'));

const DriversStandingsPage = lazy(() => import('./pages/standings/DriversStandingsPage'));
const ConstructorsStandingsPage = lazy(() => import('./pages/standings/ConstructorsStandingsPage'));
const CalendarPage = lazy(() => import('./pages/calendar/CalendarPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));


const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<PageLoader />}>
        {children}
    </Suspense>
);


function ScrollToTopWrapper() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return <Outlet />;
}


function AuthGuard() {
    const isAuthenticated = useAppStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}


function AdminGuard() {
    const user = useAppStore((state) => state.user);
    const isAuthenticated = useAppStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

const router = createBrowserRouter([
    {
        element: <ScrollToTopWrapper />,
        children: [

            { path: '/', element: <SuspenseWrapper><LandingPage /></SuspenseWrapper> },
            { path: '/login', element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
            { path: '/signup', element: <SuspenseWrapper><SignupPage /></SuspenseWrapper> },
            { path: '/pricing', element: <SuspenseWrapper><PricingPage /></SuspenseWrapper> },
            { path: '/season-2026', element: <SuspenseWrapper><Season2026Page /></SuspenseWrapper> },
            { path: '/standings/drivers', element: <SuspenseWrapper><DriversStandingsPage /></SuspenseWrapper> },
            { path: '/standings/constructors', element: <SuspenseWrapper><ConstructorsStandingsPage /></SuspenseWrapper> },
            { path: '/calendar', element: <SuspenseWrapper><CalendarPage /></SuspenseWrapper> },


            {
                element: <AuthGuard />,
                children: [
                    { path: '/dashboard', element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
                    { path: '/predict', element: <SuspenseWrapper><PredictPage /></SuspenseWrapper> },
                    { path: '/simulate', element: <SuspenseWrapper><SimulatePage /></SuspenseWrapper> },
                    { path: '/analyze', element: <SuspenseWrapper><AnalyzePage /></SuspenseWrapper> },
                    { path: '/analyze/telemetry', element: <SuspenseWrapper><TelemetryPage /></SuspenseWrapper> },
                    { path: '/analyze/laptimes', element: <SuspenseWrapper><LapTimesPage /></SuspenseWrapper> },
                    { path: '/analyze/strategy', element: <SuspenseWrapper><StrategyPage /></SuspenseWrapper> },
                    { path: '/analyze/season', element: <SuspenseWrapper><SeasonPage /></SuspenseWrapper> },
                    { path: '/analyze/driver', element: <SuspenseWrapper><DriverVsPage /></SuspenseWrapper> },
                    { path: '/analyze/constructor', element: <SuspenseWrapper><ConstructorVsPage /></SuspenseWrapper> },
                    { path: '/insights', element: <SuspenseWrapper><InsightsPage /></SuspenseWrapper> },
                    { path: '/profile', element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper> },
                ],
            },


            {
                element: <AdminGuard />,
                children: [
                    { path: '/admin', element: <SuspenseWrapper><AdminPage /></SuspenseWrapper> },
                    { path: '/admin/data', element: <SuspenseWrapper><AdminPage /></SuspenseWrapper> },
                    { path: '/admin/system', element: <SuspenseWrapper><AdminPage /></SuspenseWrapper> },
                ],
            },


            { path: '/dashboard/view', element: <Navigate to="/dashboard" replace /> },
            { path: '/dashboard/simulate', element: <Navigate to="/simulate" replace /> },
            { path: '/dashboard/compare', element: <Navigate to="/analyze" replace /> },


            { path: '*', element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper> },
        ],
    },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}

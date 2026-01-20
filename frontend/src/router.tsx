import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { PredictPage } from './pages/PredictPage';
import { SimulatePage } from './pages/SimulatePage';
import { AnalyzePage } from './pages/AnalyzePage';
import { TelemetryPage } from './pages/analyze/TelemetryPage';
import { LapTimesPage } from './pages/analyze/LapTimesPage';
import { StrategyPage } from './pages/analyze/StrategyPage';
import { SeasonPage } from './pages/analyze/SeasonPage';
import { DriverVsPage } from './pages/analyze/DriverVsPage';
import { ConstructorVsPage } from './pages/analyze/ConstructorVsPage';
import { AdminPage } from './pages/AdminPage';
import { useAppStore } from './store';

// Route guard for admin pages - rendered inside router context
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
    // Public routes
    { path: '/', element: <LandingPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/signup', element: <SignupPage /> },

    // Main platform routes
    { path: '/dashboard', element: <DashboardPage /> },
    { path: '/predict', element: <PredictPage /> },
    { path: '/simulate', element: <SimulatePage /> },

    // Analyze routes
    { path: '/analyze', element: <AnalyzePage /> },
    { path: '/analyze/telemetry', element: <TelemetryPage /> },
    { path: '/analyze/laptimes', element: <LapTimesPage /> },
    { path: '/analyze/strategy', element: <StrategyPage /> },
    { path: '/analyze/season', element: <SeasonPage /> },
    { path: '/analyze/driver', element: <DriverVsPage /> },
    { path: '/analyze/constructor', element: <ConstructorVsPage /> },

    // Admin routes (guarded with layout pattern)
    {
        element: <AdminGuard />,
        children: [
            { path: '/admin', element: <AdminPage /> },
            { path: '/admin/data', element: <AdminPage /> },
            { path: '/admin/system', element: <AdminPage /> },
        ],
    },

    // Legacy redirects
    { path: '/dashboard/view', element: <Navigate to="/dashboard" replace /> },
    { path: '/dashboard/simulate', element: <Navigate to="/simulate" replace /> },
    { path: '/dashboard/compare', element: <Navigate to="/analyze" replace /> },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}

import React from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { DashboardGrid } from '../components/dashboard/DashboardGrid';
import { useDashboardStore, selectSidebarOpen } from '../store/useDashboardStore';

const DashboardPage: React.FC = () => {
    const sidebarOpen = useDashboardStore(selectSidebarOpen);
    const toggleSidebar = useDashboardStore(state => state.toggleSidebar);

    const isFirstVisit = !localStorage.getItem('f1-dashboard-visited');

    React.useEffect(() => {
        if (isFirstVisit) {
            localStorage.setItem('f1-dashboard-visited', 'true');
        }
    }, [isFirstVisit]);

    return (
        <DashboardLayout sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar}>
            <DashboardGrid isFirstVisit={isFirstVisit} />
        </DashboardLayout>
    );
};

export default DashboardPage;

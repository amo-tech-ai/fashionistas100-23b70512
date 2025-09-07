import React from 'react';
import DashboardNavbar from './DashboardNavbar';
import DashboardFooter from './DashboardFooter';
import Sidebar from './Sidebar';
import { useSidebar } from '@/hooks/useSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <DashboardNavbar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
};

export default DashboardLayout;
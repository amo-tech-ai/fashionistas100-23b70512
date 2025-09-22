import React from 'react';
import DashboardNavbar from './DashboardNavbar';
import Footer from './Footer';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  showSidebar = true 
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <DashboardNavbar />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        {showSidebar && <DashboardSidebar />}
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Content Area */}
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer - Outside container for full width */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
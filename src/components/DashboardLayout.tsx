import React, { useState } from 'react';
import Footer from './Footer';
import DashboardSidebar from './DashboardSidebar';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  showSidebar = true 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background flex flex-col w-full">
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden sticky top-0 z-50 bg-card border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-lg">Fashionistas</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden min-touch"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden">
              <DashboardSidebar onNavigate={() => setIsMobileMenuOpen(false)} isMobile />
            </div>
          </>
        )}
        
        <div className="flex flex-1 overflow-hidden w-full">
          {/* Desktop Sidebar with Toggle */}
          {showSidebar && (
            <div className="hidden lg:flex">
              <DashboardSidebar />
            </div>
          )}
          
          {/* Main Content */}
          <main className="flex-1 flex flex-col overflow-y-auto">
            {/* Desktop Sidebar Toggle - Always visible */}
            <div className="hidden lg:flex items-center gap-4 px-6 py-4 border-b border-border bg-card">
              <SidebarTrigger className="h-9 w-9" />
              <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
            </div>
            
            {/* Content Area with responsive padding */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
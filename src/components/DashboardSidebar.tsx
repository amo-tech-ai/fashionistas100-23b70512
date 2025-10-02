import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Inbox,
  Ticket,
  DollarSign,
  Image,
  MessageCircle,
  LogOut,
  Users,
  Palette,
  Building2,
  Award
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
  isMobile?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isNew?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
  defaultOpen?: boolean;
}

const menuSections: MenuSection[] = [
  {
    title: "Main",
    defaultOpen: true,
    items: [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { id: 'bookings', label: 'Bookings', path: '/dashboard/bookings', icon: Calendar },
      { id: 'invoices', label: 'Invoices', path: '/dashboard/invoices', icon: FileText },
      { id: 'inbox', label: 'Inbox', path: '/dashboard/inbox', icon: Inbox, badge: '3' },
      { id: 'calendar', label: 'Calendar', path: '/dashboard/calendar', icon: Calendar },
      { id: 'events', label: 'Events', path: '/dashboard/events', icon: Ticket },
      { id: 'models', label: 'Models', path: '/dashboard/models', icon: Users },
      { id: 'designers', label: 'Designers', path: '/dashboard/designers', icon: Palette },
      { id: 'venues', label: 'Venues', path: '/dashboard/venues', icon: Building2 },
      { id: 'sponsors', label: 'Sponsors', path: '/dashboard/sponsors', icon: Award },
      { id: 'financials', label: 'Financials', path: '/dashboard/financials', icon: DollarSign },
      { id: 'gallery', label: 'Gallery', path: '/dashboard/gallery', icon: Image },
      { id: 'feedback', label: 'Feedback', path: '/dashboard/feedback', icon: MessageCircle }
    ]
  }
];

export const DashboardSidebar: React.FC<SidebarProps> = ({ className, onNavigate, isMobile = false }) => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Main': true
  });

  const toggleSection = (sectionTitle: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  // For mobile, use traditional sidebar
  if (isMobile) {
    return (
      <aside className={cn(
        "w-64 bg-card border-r border-border flex flex-col h-screen",
        className
      )}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3" onClick={onNavigate}>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-xl text-foreground">Fashionistas</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <div className="space-y-4 sm:space-y-6">
            {menuSections.map((section) => (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full p-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors min-touch"
                >
                  <span className="uppercase tracking-wider">{section.title}</span>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openSections[section.title] ? "rotate-180" : ""
                    )} 
                  />
                </button>
                
                {openSections[section.title] && (
                  <div className="mt-2 space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={onNavigate}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors group min-touch",
                          isActivePath(item.path)
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <item.icon className={cn(
                          "h-4 w-4 flex-shrink-0",
                          isActivePath(item.path) ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        <span className="flex-1">{item.label}</span>
                        
                        {item.badge && (
                          <Badge 
                            className={cn(
                              "text-xs",
                              isActivePath(item.path) ? "bg-white/20 text-white" : "bg-purple-100 text-purple-700"
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                        
                        {item.isNew && (
                          <Badge className="text-xs bg-success text-success-foreground">
                            New
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Promo Card and Sign Out */}
        <div className="p-3 sm:p-4 border-t border-border space-y-3">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm font-semibold mb-1">Experience enhanced features</p>
            <p className="text-xs text-muted-foreground mb-3 hidden sm:block">Access smoother interface with the latest version of Ventixe</p>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs sm:text-sm min-touch">
              Try New Version
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground min-touch"
            onClick={onNavigate}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>
    );
  }

  // Desktop collapsible sidebar - wrap in component to use useSidebar hook
  return <DesktopSidebar className={className} onNavigate={onNavigate} />;
};

// Separate component for desktop sidebar to safely use useSidebar hook
const DesktopSidebar: React.FC<Omit<SidebarProps, 'isMobile'>> = ({ className, onNavigate }) => {
  const location = useLocation();
  const { open: sidebarOpen } = useSidebar();

  const isActivePath = (path: string) => {
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  return (
    <Sidebar collapsible="icon" className={cn("border-r border-border", className)}>
      <SidebarHeader className="border-b border-border p-4">
        <Link to="/" className="flex items-center gap-3" onClick={onNavigate}>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          {sidebarOpen && <span className="font-bold text-xl text-foreground">Fashionistas</span>}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {menuSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="px-2 py-2 text-xs uppercase tracking-wider text-muted-foreground">
              {sidebarOpen ? section.title : '•'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActivePath(item.path)}
                      tooltip={!sidebarOpen ? item.label : undefined}
                      className={cn(
                        "min-touch",
                        isActivePath(item.path)
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                          : ""
                      )}
                    >
                      <Link to={item.path} onClick={onNavigate} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {sidebarOpen && (
                          <>
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                              <Badge 
                                className={cn(
                                  "text-xs ml-auto",
                                  isActivePath(item.path) 
                                    ? "bg-white/20 text-white" 
                                    : "bg-purple-100 text-purple-700"
                                )}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3 space-y-3">
        {sidebarOpen && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg">
            <p className="text-xs font-semibold mb-1">Experience enhanced features</p>
            <p className="text-xs text-muted-foreground mb-3">Access smoother interface with the latest version</p>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs min-touch">
              Try New Version
            </Button>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          className={cn(
            "w-full text-muted-foreground hover:text-foreground min-touch",
            sidebarOpen ? "justify-start" : "justify-center px-2"
          )}
          onClick={onNavigate}
        >
          <LogOut className="h-4 w-4" />
          {sidebarOpen && <span className="ml-2">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
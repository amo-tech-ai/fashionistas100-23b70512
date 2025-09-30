import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Plus } from 'lucide-react';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Inbox,
  Ticket,
  DollarSign,
  Image,
  MessageCircle,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  className?: string;
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
      { id: 'events', label: 'Events', path: '/events', icon: Ticket },
      { id: 'financials', label: 'Financials', path: '/dashboard/financials', icon: DollarSign },
      { id: 'gallery', label: 'Gallery', path: '/dashboard/gallery', icon: Image },
      { id: 'feedback', label: 'Feedback', path: '/dashboard/feedback', icon: MessageCircle }
    ]
  }
];

export const DashboardSidebar: React.FC<SidebarProps> = ({ className }) => {
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

  return (
    <aside className={cn(
      "w-64 bg-card border-r border-border flex flex-col h-full",
      className
    )}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="font-bold text-xl text-foreground">Fashionistas</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full p-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                        isActivePath(item.path)
                          ? "bg-brand text-brand-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className={cn(
                        "h-4 w-4",
                        isActivePath(item.path) ? "text-brand-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      <span className="flex-1">{item.label}</span>
                      
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
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
      <div className="p-4 border-t border-border space-y-3">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
          <p className="text-sm font-semibold mb-1">Experience enhanced features</p>
          <p className="text-xs text-muted-foreground mb-3">Access smoother interface with the latest version of Ventixe</p>
          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm">
            Try New Version
          </Button>
        </div>
        
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
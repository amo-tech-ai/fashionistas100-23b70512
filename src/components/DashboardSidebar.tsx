import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Plus } from 'lucide-react';
import {
  BarChart3,
  Calendar,
  Users,
  Building2,
  Palette,
  Star,
  Settings,
  PlusCircle,
  FileText,
  Camera,
  Upload,
  CreditCard,
  MessageSquare,
  Home
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
    title: "Dashboards",
    defaultOpen: true,
    items: [
      { id: 'main', label: 'Overview', path: '/dashboard/overview', icon: Home },
      { id: 'organizer', label: 'Organizer', path: '/dashboard/organizer', icon: BarChart3 },
      { id: 'sponsor', label: 'Sponsor', path: '/dashboard/sponsor', icon: Star },
      { id: 'venue', label: 'Venue', path: '/dashboard/venue', icon: Building2 },
      { id: 'analytics', label: 'Analytics', path: '/dashboard/analytics', icon: BarChart3, badge: 'Pro' }
    ]
  },
  {
    title: "Users",
    items: [
      { id: 'designers', label: 'Designers', path: '/dashboard/designers', icon: Palette },
      { id: 'attendees', label: 'Attendees', path: '/dashboard/attendees', icon: Users },
      { id: 'sponsors', label: 'Sponsors', path: '/dashboard/sponsors', icon: Star },
      { id: 'venues', label: 'Venues', path: '/dashboard/venues', icon: Building2 }
    ]
  },
  {
    title: "Make",
    items: [
      { id: 'create-event', label: 'Create Event', path: '/dashboard/create-event', icon: PlusCircle, isNew: true },
      { id: 'event-brief', label: 'Event Brief', path: '/dashboard/event-brief', icon: FileText },
      { id: 'gallery', label: 'Gallery', path: '/dashboard/gallery', icon: Camera },
      { id: 'portfolio', label: 'Portfolio Upload', path: '/dashboard/portfolio-upload', icon: Upload },
      { id: 'payments', label: 'Payments', path: '/dashboard/payments', icon: CreditCard },
      { id: 'contact', label: 'Contact Forms', path: '/dashboard/contact-forms', icon: MessageSquare }
    ]
  }
];

export const DashboardSidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Dashboards': true,
    'Users': false,
    'Make': false
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

      {/* Create Event CTA */}
      <div className="p-4 border-t border-border">
        <Link to="/dashboard/create-event">
          <Button className="w-full bg-gradient-brand hover:opacity-90 text-brand-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
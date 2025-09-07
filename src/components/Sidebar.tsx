import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, X, Home, Calendar, Users, Building2, 
  ShoppingBag, FileText, BarChart3, Settings,
  Palette, User, MapPin, Camera, Lightbulb,
  PlusCircle, Briefcase, TrendingUp, Database,
  Zap, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
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
  title?: string;
  items: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  const menuSections: MenuSection[] = [
    {
      items: [
        { 
          id: 'create-event', 
          label: 'create an event', 
          path: '/admin/create-event', 
          icon: PlusCircle 
        },
        { 
          id: 'event-brief', 
          label: 'create event brief', 
          path: '/admin/event-brief', 
          icon: FileText 
        },
      ]
    },
    {
      items: [
        { 
          id: 'home', 
          label: 'home', 
          path: '/admin/leap', 
          icon: Home 
        },
      ]
    },
    {
      title: 'DASHBOARDS',
      items: [
        { 
          id: 'overview', 
          label: 'overview', 
          path: '/admin/leap', 
          icon: BarChart3 
        },
        { 
          id: 'organizer', 
          label: 'organizer', 
          path: '/admin/organizer', 
          icon: Settings 
        },
        { 
          id: 'users', 
          label: 'users', 
          path: '/admin/user', 
          icon: Users 
        },
        { 
          id: 'sponsors', 
          label: 'sponsors', 
          path: '/admin/sponsor', 
          icon: Building2 
        },
        { 
          id: 'designers', 
          label: 'designers', 
          path: '/admin/designer', 
          icon: Palette,
          isNew: true 
        },
        { 
          id: 'models', 
          label: 'models', 
          path: '/admin/model', 
          icon: User 
        },
        { 
          id: 'venues', 
          label: 'venues', 
          path: '/admin/venue', 
          icon: MapPin 
        },
        { 
          id: 'groups', 
          label: 'groups', 
          path: '/admin/group-booking', 
          icon: ShoppingBag 
        },
        { 
          id: 'production', 
          label: 'production', 
          path: '/admin/production', 
          icon: Briefcase 
        },
        { 
          id: 'analytics', 
          label: 'analytics', 
          path: '/admin/analytics', 
          icon: TrendingUp 
        },
      ]
    },
    {
      title: 'MAKE',
      items: [
        { 
          id: 'studio-bookings', 
          label: 'studio bookings', 
          path: '/admin/venue', 
          icon: Camera 
        },
        { 
          id: 'venue-directory', 
          label: 'venue directory', 
          path: '/venues', 
          icon: MapPin 
        },
        { 
          id: 'discovery', 
          label: 'discovery', 
          path: '/events', 
          icon: Lightbulb 
        },
      ]
    },
    {
      title: 'MANAGE',
      items: [
        { 
          id: 'gallery', 
          label: 'gallery', 
          path: '/admin/gallery', 
          icon: Camera 
        },
        { 
          id: 'bookings', 
          label: 'bookings', 
          path: '/admin/group-booking', 
          icon: Calendar 
        },
      ]
    },
    {
      title: 'MEASURE',
      items: [
        { 
          id: 'event-insights', 
          label: 'event insights', 
          path: '/admin/analytics', 
          icon: BarChart3 
        },
        { 
          id: 'competitive-analysis', 
          label: 'competitive analysis', 
          path: '/admin/competitive', 
          icon: TrendingUp 
        },
      ]
    },
    {
      items: [
        { 
          id: 'integrations', 
          label: 'integrations', 
          path: '/admin/integrations', 
          icon: Zap,
          isNew: true 
        },
      ]
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-72"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              FashionOS
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            {/* Section Title */}
            {section.title && !isCollapsed && (
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-3">
                {section.title}
              </div>
            )}

            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                      active
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5 flex-shrink-0",
                      active ? "text-purple-600" : "text-gray-500"
                    )} />
                    
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        <div className="flex items-center gap-2">
                          {item.isNew && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                              NEW
                            </Badge>
                          )}
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            onClick={() => alert('AI Tools coming soon!')}
          >
            <Star className="h-4 w-4 mr-2" />
            try our AI tools
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
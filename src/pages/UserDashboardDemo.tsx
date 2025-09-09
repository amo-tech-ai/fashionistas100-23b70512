import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, Users, TrendingUp, DollarSign, 
  BarChart3, Bell, Settings, Eye, Plus,
  MessageSquare, Clock, Target, CheckCircle,
  AlertCircle, Activity, PieChart, Send,
  Mail, Phone, ArrowUp, ArrowDown, MoreVertical,
  Sparkles, Zap, FileText, PlayCircle, Inbox,
  ChevronRight, ExternalLink, Hash, Briefcase,
  Home, Building2, ShoppingBag, Palette, User,
  MapPin, Camera, Lightbulb, PlusCircle, Star,
  Menu, X, Ticket, Heart, CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const UserDashboardDemo = () => {
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  // Demo data for User Dashboard
  const upcomingEvents = 3;
  const savedEvents = 8;
  const ticketsPurchased = 5;
  const totalSpent = '$2,450';
  const membershipStatus = 'VIP Member';
  const loyaltyPoints = 850;

  const myTickets = [
    {
      id: '1',
      eventName: 'Medellín Fashion Week 2025',
      date: 'Sep 18, 2025',
      time: '7:00 PM',
      venue: 'Plaza Mayor Convention Center',
      ticketType: 'VIP',
      status: 'confirmed',
      price: '$450'
    },
    {
      id: '2',
      eventName: 'Sustainable Fashion Summit',
      date: 'Oct 5, 2025',
      time: '10:00 AM',
      venue: 'Museo de Arte Moderno',
      ticketType: 'General',
      status: 'confirmed',
      price: '$150'
    }
  ];

  const recommendedEvents = [
    {
      id: '1',
      name: 'Emerging Designers Showcase',
      date: 'Nov 15, 2025',
      price: 'From $120',
      category: 'Fashion Show'
    },
    {
      id: '2',
      name: 'Luxury Brand Exhibition',
      date: 'Dec 3, 2025',
      price: 'From $200',
      category: 'Exhibition'
    }
  ];

  const sidebarItems = [
    { id: 'browse-events', label: 'browse events', icon: Calendar },
    { id: 'my-tickets', label: 'my tickets', icon: Ticket },
    { section: 'DASHBOARDS' },
    { id: 'home', label: 'home', icon: Home },
    { id: 'overview', label: 'overview', icon: BarChart3 },
    { id: 'organizer', label: 'organizer', icon: Users },
    { id: 'users', label: 'users', icon: User, isActive: true },
    { id: 'sponsors', label: 'sponsors', icon: Briefcase },
    { id: 'designers', label: 'designers', icon: Palette },
    { id: 'models', label: 'models', icon: Camera },
    { id: 'venues', label: 'venues', icon: Building2 },
    { id: 'analytics', label: 'analytics', icon: TrendingUp },
    { section: 'ACCOUNT' },
    { id: 'profile', label: 'my profile', icon: User },
    { id: 'saved-events', label: 'saved events', icon: Heart },
    { id: 'payment-methods', label: 'payment methods', icon: CreditCard }
  ];

  const handleQuickAction = async (action: string) => {
    setQuickActionLoading(action);
    setTimeout(() => {
      setQuickActionLoading(null);
      if (action === 'browse-events') navigate('/events');
      if (action === 'view-tickets') navigate('/tickets');
      if (action === 'invite-friends') console.log('Opening invite modal');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white border-r transition-all duration-300 z-40",
        isSidebarOpen ? "w-64" : "w-16"
      )}>
        {/* Logo */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
              F
            </div>
            {isSidebarOpen && <span className="font-bold text-xl">Fashionistas</span>}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <ScrollArea className="h-[calc(100%-5rem)]">
          <div className="p-4 space-y-1">
            {sidebarItems.map((item, idx) => {
              if (item.section) {
                return isSidebarOpen ? (
                  <div key={idx} className="text-xs font-semibold text-gray-500 mt-6 mb-2">
                    {item.section}
                  </div>
                ) : null;
              }
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
                    item.isActive && "bg-purple-50 text-purple-700"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {isSidebarOpen && (
                    <span className="flex-1 text-left">{item.label}</span>
                  )}
                </button>
              );
            })}
            
            {isSidebarOpen && (
              <div className="mt-8 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover
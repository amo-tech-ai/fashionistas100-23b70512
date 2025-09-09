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
  Menu, X, Ticket, Heart, CreditCard, Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

const UserDashboardFixed = () => {
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  // Demo data for User Dashboard
  const upcomingEvents = 3;
  const ticketsPurchased = 12;
  const savedEvents = 8;
  const totalSpent = '$3,450';

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

  const sidebarItems = [
    { id: 'create-event', label: 'create an event', icon: PlusCircle, path: '/admin/create-event' },
    { id: 'create-brief', label: 'create event brief', icon: FileText, path: '/admin/event-plans' },
    { section: 'DASHBOARDS' },
    { id: 'home', label: 'home', icon: Home, path: '/' },
    { id: 'overview', label: 'overview', icon: BarChart3, path: '/admin/dashboard-dev' },
    { id: 'organizer', label: 'organizer', icon: Users, isNew: true, path: '/organizer-dashboard' },
    { id: 'users', label: 'users', icon: User, path: '/user-dashboard', isActive: true },
    { id: 'sponsors', label: 'sponsors', icon: Briefcase, path: '/sponsor-dashboard' },
    { id: 'designers', label: 'designers', icon: Palette, isNew: true, path: '/designer-dashboard' },
    { id: 'models', label: 'models', icon: Camera, path: '/model-dashboard' },
    { id: 'venues', label: 'venues', icon: Building2, path: '/venue-dashboard' },
    { id: 'groups', label: 'groups', icon: Users, path: '/admin/group-booking' },
    { id: 'production', label: 'production', icon: Lightbulb, path: '/admin/production' },
    { id: 'analytics', label: 'analytics', icon: TrendingUp, path: '/admin/analytics' },
    { section: 'MAKE' },
    { id: 'studio-bookings', label: 'studio bookings', icon: MapPin, path: '/admin/venue-availability' },
    { id: 'venue-directory', label: 'venue directory', icon: Building2, path: '/venues' },
    { id: 'gallery', label: 'gallery', icon: Camera, path: '/admin/gallery' }
  ];

  const handleQuickAction = async (action: string) => {
    setQuickActionLoading(action);
    setTimeout(() => {
      setQuickActionLoading(null);
      if (action === 'browse-events') navigate('/events');
      if (action === 'view-tickets') navigate('/tickets');
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
            {isSidebarOpen && <span className="font-bold text-xl">FashionOS</span>}
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
                  onClick={() => item.path && navigate(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
                    item.isActive && "bg-purple-50 text-purple-700"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.isNew && <Badge className="text-xs bg-blue-100 text-blue-700">NEW</Badge>}
                    </>
                  )}
                </button>
              );
            })}
            
            {isSidebarOpen && (
              <div className="mt-8 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Zap className="h-4 w-4 mr-2" />
                  try our AI tools
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className={cn("flex-1 transition-all duration-300", isSidebarOpen ? "ml-64" : "ml-16")}>
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your fashion events and tickets</p>
            </div>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => handleQuickAction('browse-events')}
            >
              <Plus className="h-5 w-5 mr-2" />
              Browse Events
            </Button>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {/* Upcoming Events */}
            <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{upcomingEvents}</div>
                <p className="text-sm text-white/80">Next event in 3 days</p>
              </CardContent>
            </Card>

            {/* Tickets Purchased */}
            <Card className="border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  Tickets Purchased
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{ticketsPurchased}</div>
                <p className="text-sm text-white/80">This year</p>
              </CardContent>
            </Card>

            {/* Saved Events */}
            <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Saved Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{savedEvents}</div>
                <p className="text-sm text-white/80">In your wishlist</p>
              </CardContent>
            </Card>

            {/* Total Spent */}
            <Card className="border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{totalSpent}</div>
                <p className="text-sm text-white/80">Lifetime value</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* My Tickets - 2 columns */}
            <div className="xl:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-purple-600" />
                    My Tickets
                  </CardTitle>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myTickets.map((ticket) => (
                      <div key={ticket.id} className="p-4 rounded-lg border hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-base">{ticket.eventName}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {ticket.date} • {ticket.time}
                            </p>
                            <p className="text-sm text-gray-500">{ticket.venue}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-700">
                            {ticket.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4 text-sm">
                            <span className="font-medium">{ticket.ticketType} Ticket</span>
                            <span className="text-purple-600 font-semibold">{ticket.price}</span>
                          </div>
                          <Button size="sm" variant="outline">
                            View Ticket
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleQuickAction('browse-events')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Browse Events
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleQuickAction('view-tickets')}
                  >
                    <Ticket className="h-4 w-4 mr-2" />
                    View All Tickets
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Saved Events
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </Button>
                </CardContent>
              </Card>

              {/* Account Overview */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <User className="h-5 w-5 text-purple-600" />
                    Account Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Membership</span>
                    <Badge className="bg-purple-100 text-purple-700">VIP Member</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Loyalty Points</span>
                    <span className="font-semibold">850 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm">Jan 2024</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Manage Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer - Same as OrganizerDashboard */}
        <footer className="bg-gray-900 text-white py-12 mt-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                    F
                  </div>
                  <span className="font-bold text-lg">FashionOS</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Complete Fashion Event<br />Management Platform
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Dashboards</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/dashboard" className="hover:text-white">Dashboard Overview</a></li>
                  <li><a href="/organizer-dashboard" className="hover:text-white">Organizer Dashboard</a></li>
                  <li><a href="/user-dashboard" className="hover:text-white">User Dashboard</a></li>
                  <li><a href="/sponsor-dashboard" className="hover:text-white">Sponsor Dashboard</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Platform</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/events" className="hover:text-white">Browse Events</a></li>
                  <li><a href="/designers" className="hover:text-white">Designers</a></li>
                  <li><a href="/tickets" className="hover:text-white">Tickets</a></li>
                  <li><a href="/contact" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Contact</h4>
                <p className="text-sm text-gray-400">
                  <a href="mailto:support@fashionos.com" className="hover:text-white">support@fashionos.com</a><br />
                  <a href="tel:+12345678890" className="hover:text-white">+1 (234) 567-890</a>
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  123 Fashion Ave<br />
                  New York, NY 10001
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-800">
              <div className="text-center text-sm text-gray-400">
                © 2025 FashionOS. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default UserDashboardFixed;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Navigation } from '@/components/Navigation';
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
  Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const OrganizerDashboardStandalone = () => {
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  // Demo data
  const activeEventsCount = 6;
  const thisWeekEvents = 6;
  const totalAttendees = 1247;
  const attendeesGrowth = 15;
  const totalRevenue = '$125K';
  const revenueGrowth = 15;
  const satisfactionRate = 94;

  const upcomingEvents = [
    {
      id: '1',
      name: 'Cumbre de Moda Sostenible Medellín',
      date: 'Sep 05, 2025',
      venue: '894e1c46-692a-4bbe-919a-d4ab72edbeeb',
      status: 'published',
      attendees: 549,
      revenue: 84000,
      progress: 75
    },
    {
      id: '2',
      name: 'Noches de Alta Costura Paisa',
      date: 'Sep 12, 2025',
      venue: '93c5f9b-a738-4668-bb7c-43acab67bbed',
      status: 'published',
      attendees: 377,
      revenue: 71000,
      progress: 60
    }
  ];

  const recentMessages = [
    { id: 1, type: 'sponsor', message: 'New sponsorship inquiry from Medellín Fashion Week', time: '5 min ago', urgent: true },
    { id: 2, type: 'designer', message: 'Maria Rodriguez confirmed for runway show', time: '1 hr ago', urgent: false },
    { id: 3, type: 'venue', message: 'Hotel Intercontinental available for booking', time: '2 hrs ago', urgent: false }
  ];

  const analyticsData = {
    ticketSales: { current: 1234, capacity: 1645, percentage: 75 },
    revenueTarget: { current: 125000, target: 152000, percentage: 82 },
    engagement: { rate: 68, trend: 12 }
  };

  const sidebarItems = [
    { id: 'create-event', label: 'create an event', path: '/admin/create-event', icon: PlusCircle },
    { id: 'home', label: 'home', path: '/', icon: Home },
    { id: 'overview', label: 'overview', path: '/dashboard', icon: BarChart3 },
    { id: 'organizer', label: 'organizer', path: '/organizer-dashboard', icon: Users, isNew: true },
    { id: 'users', label: 'users', path: '/users', icon: User },
    { id: 'sponsors', label: 'sponsors', path: '/sponsors', icon: Briefcase },
    { id: 'designers', label: 'designers', path: '/designers', icon: Palette, isNew: true },
    { id: 'models', label: 'models', path: '/models', icon: Camera },
    { id: 'venues', label: 'venues', path: '/venues', icon: Building2 },
    { id: 'groups', label: 'groups', path: '/groups', icon: Users },
    { id: 'production', label: 'production', path: '/production', icon: Lightbulb },
    { id: 'analytics', label: 'analytics', path: '/analytics', icon: TrendingUp }
  ];

  const handleQuickAction = async (action: string) => {
    setQuickActionLoading(action);
    
    try {
      switch (action) {
        case 'create-event':
          navigate('/admin/create-event');
          break;
        case 'add-designer':
          navigate('/admin/designer');
          break;
        case 'send-invite':
          console.log('Opening invite functionality...');
          break;
        case 'generate-report':
          navigate('/admin/analytics');
          break;
        default:
          console.log(`Action not implemented: ${action}`);
      }
    } catch (error) {
      console.error('Quick action failed:', error);
    } finally {
      setTimeout(() => setQuickActionLoading(null), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <Navigation />
      
      <div className="flex pt-16">
        {/* Sidebar */}
        <div className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 z-40",
          isSidebarOpen ? "w-64" : "w-16"
        )}>
          {/* Sidebar Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3 top-6 bg-white border rounded-full p-1 shadow-md hover:shadow-lg transition-shadow"
          >
            {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          {/* Logo/Brand */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                F
              </div>
              {isSidebarOpen && (
                <span className="font-bold text-xl">FashionOS</span>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <ScrollArea className="h-[calc(100%-5rem)]">
            <div className="p-4 space-y-2">
              <div className="text-xs font-semibold text-gray-500 mb-2">
                {isSidebarOpen && "DASHBOARDS"}
              </div>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {isSidebarOpen && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.isNew && (
                          <Badge variant="secondary" className="text-xs">NEW</Badge>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
              
              {isSidebarOpen && (
                <>
                  <div className="text-xs font-semibold text-gray-500 mt-6 mb-2">MARK</div>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100">
                    <MapPin className="h-4 w-4" />
                    <span className="flex-1 text-left">studio bookings</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100">
                    <Building2 className="h-4 w-4" />
                    <span className="flex-1 text-left">venue directory</span>
                  </button>
                  
                  <div className="mt-8 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Zap className="h-4 w-4 mr-2" />
                      Try our AI tools
                    </Button>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className={cn(
          "flex-1 transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-16"
        )}>
          <div className="p-6 lg:p-8">
            {/* Header Section */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Organizer Dashboard</h1>
                <p className="text-gray-600 mt-2">Complete event management and real-time tracking</p>
              </div>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => handleQuickAction('create-event')}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Event
              </Button>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
              {/* Active Events Card */}
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-white" />
                    Active Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">{activeEventsCount}</div>
                  <p className="text-sm text-white/80 flex items-center gap-1">
                    <Plus className="h-3 w-3" />
                    {thisWeekEvents} this week
                  </p>
                </CardContent>
              </Card>

              {/* Total Attendees Card */}
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                    <Users className="h-4 w-4 text-white" />
                    Total Attendees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">{totalAttendees.toLocaleString()}</div>
                  <p className="text-sm text-white/80 flex items-center gap-1">
                    <ArrowUp className="h-3 w-3" />
                    +{attendeesGrowth}% from last month
                  </p>
                </CardContent>
              </Card>

              {/* Revenue Card */}
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-white" />
                    Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">{totalRevenue}</div>
                  <p className="text-sm text-white/80 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +{revenueGrowth}% growth
                  </p>
                </CardContent>
              </Card>

              {/* Performance Card */}
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-white" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">{satisfactionRate}%</div>
                  <p className="text-sm text-white/80">Satisfaction rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Events Management */}
              <Card className="xl:col-span-2 border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Events Management
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="p-4 rounded-lg border hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{event.name}</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" /> {event.attendees} attendees
                              </span>
                            </div>
                          </div>
                          <Badge 
                            variant={event.status === 'published' ? 'default' : 'secondary'}
                            className={event.status === 'published' ? 'bg-green-500' : ''}
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-600">
                            ${(event.revenue / 1000).toFixed(0)}K revenue
                          </span>
                          <Progress value={event.progress} className="w-32 h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Analytics Overview */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      Analytics Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Ticket Sales</span>
                        <span className="font-medium">{analyticsData.ticketSales.current}/{analyticsData.ticketSales.capacity}</span>
                      </div>
                      <Progress value={analyticsData.ticketSales.percentage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Revenue Target</span>
                        <span className="font-medium">${(analyticsData.revenueTarget.current / 1000).toFixed(0)}K/${(analyticsData.revenueTarget.target / 1000).toFixed(0)}K</span>
                      </div>
                      <Progress value={analyticsData.revenueTarget.percentage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Engagement Rate</span>
                        <span className="font-medium flex items-center gap-1">
                          {analyticsData.engagement.rate}%
                          <ArrowUp className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">+{analyticsData.engagement.trend}% this week</span>
                        </span>
                      </div>
                      <Progress value={analyticsData.engagement.rate} className="h-2" />
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => navigate('/admin/analytics')}
                    >
                      View Detailed Analytics
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => handleQuickAction('create-event')}
                      disabled={quickActionLoading === 'create-event'}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => handleQuickAction('add-designer')}
                      disabled={quickActionLoading === 'add-designer'}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Add Designer
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => handleQuickAction('send-invite')}
                      disabled={quickActionLoading === 'send-invite'}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Invite
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => handleQuickAction('generate-report')}
                      disabled={quickActionLoading === 'generate-report'}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                {/* Communications Hub */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-bold">Communications Hub</CardTitle>
                    <Badge variant="secondary" className="text-xs">0 new</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center py-8 text-gray-400">
                      <Mail className="h-12 w-12 mb-2" />
                    </div>
                    <p className="text-center text-sm text-gray-500">No new messages</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={cn(
        "bg-gray-900 text-white py-12 mt-16 transition-all duration-300",
        isSidebarOpen ? "ml-64" : "ml-16"
      )}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">FashionOS</h3>
              <p className="text-gray-400 text-sm">
                Complete Fashion Event Management Platform
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
                <li><a href="/about" className="hover:text-white">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <p className="text-sm text-gray-400">support@fashionos.com</p>
              <p className="text-sm text-gray-400">+1 (234) 567-890</p>
              <p className="text-sm text-gray-400 mt-2">
                123 Fashion Ave<br />
                New York, NY 10001
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2025 FashionOS. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboardStandalone;
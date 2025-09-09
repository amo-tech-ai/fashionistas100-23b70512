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
  Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const OrganizerDashboardDemo = () => {
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  // Demo data matching your screenshot
  const activeEventsCount = 6;
  const thisWeekEvents = '6 this week';
  const totalAttendees = '1,247';
  const attendeesGrowth = '+15% from last month';
  const totalRevenue = '$125K';
  const revenueGrowth = '+15% growth';
  const performanceRate = '94%';
  const performanceLabel = 'Satisfaction rate';

  const upcomingEvents = [
    {
      id: '1',
      name: 'Cumbre de Moda Sostenible Medellín',
      date: 'Sep 05, 2025',
      venue: '894e1c46-692a-4bbe-919a-d4ab72edbeeb',
      status: 'published',
      attendees: '549 attendees',
      revenue: '$84K revenue',
      progress: 75
    },
    {
      id: '2', 
      name: 'Noches de Alta Costura Paisa',
      date: 'Sep 12, 2025',
      venue: '93c5f9b-a738-4668-bb7c-43acab67bbed',
      status: 'published',
      attendees: '377 attendees',
      revenue: '$71K revenue',
      progress: 65
    }
  ];

  const analyticsData = {
    ticketSales: { label: 'Ticket Sales', current: 1234, capacity: 1645, percentage: 75 },
    revenueTarget: { label: 'Revenue Target', current: '$125K', target: '$152K', percentage: 82 },
    engagement: { label: 'Engagement Rate', rate: '68% engagement rate', trend: '+12% this week' }
  };

  const sidebarItems = [
    { id: 'create-event', label: 'create an event', icon: PlusCircle, path: '/admin/create-event' },
    { id: 'create-brief', label: 'create event brief', icon: FileText, path: '/admin/event-plans' },
    { section: 'DASHBOARDS' },
    { id: 'home', label: 'home', icon: Home, path: '/' },
    { id: 'overview', label: 'overview', icon: BarChart3, path: '/admin/dashboard-dev' },
    { id: 'organizer', label: 'organizer', icon: Users, isNew: true, path: '/organizer-dashboard', isActive: true },
    { id: 'users', label: 'users', icon: User, path: '/user-dashboard' },
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
      if (action === 'create-event') navigate('/admin/create-event');
      if (action === 'add-designer') navigate('/designers');
      if (action === 'generate-report') navigate('/admin/analytics');
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
              <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
              <p className="text-gray-600 mt-1">Complete event management and real-time tracking</p>
            </div>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => handleQuickAction('create-event')}
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Event
            </Button>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {/* Active Events */}
            <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Active Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{activeEventsCount}</div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <Plus className="h-3 w-3" />
                  {thisWeekEvents}
                </p>
              </CardContent>
            </Card>

            {/* Total Attendees */}
            <Card className="border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Attendees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{totalAttendees}</div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  {attendeesGrowth}
                </p>
              </CardContent>
            </Card>

            {/* Revenue */}
            <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{totalRevenue}</div>
                <p className="text-sm text-white/80">{revenueGrowth}</p>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{performanceRate}</div>
                <p className="text-sm text-white/80">{performanceLabel}</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Events Management - 2 columns */}
            <div className="xl:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Events Management
                  </CardTitle>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="p-4 rounded-lg border hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-base">{event.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {event.date} • {event.venue}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-700">
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4 text-sm">
                            <span className="text-gray-600">⚪ {event.attendees}</span>
                            <span className="font-semibold text-green-600">{event.revenue}</span>
                          </div>
                          <div className="w-32">
                            <Progress value={event.progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Analytics Overview */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Analytics Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{analyticsData.ticketSales.label}</span>
                      <span className="font-medium">
                        {analyticsData.ticketSales.current}/{analyticsData.ticketSales.capacity}
                      </span>
                    </div>
                    <Progress value={analyticsData.ticketSales.percentage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{analyticsData.revenueTarget.label}</span>
                      <span className="font-medium">
                        {analyticsData.revenueTarget.current}/{analyticsData.revenueTarget.target}
                      </span>
                    </div>
                    <Progress value={analyticsData.revenueTarget.percentage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{analyticsData.engagement.label}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {analyticsData.engagement.rate}
                    </div>
                    <div className="text-sm text-green-600 flex items-center gap-1">
                      <ArrowUp className="h-3 w-3" />
                      {analyticsData.engagement.trend}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Detailed Analytics
                  </Button>
                </CardContent>
              </Card>

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
                    onClick={() => handleQuickAction('create-event')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleQuickAction('add-designer')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Add Designer
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleQuickAction('send-invite')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invite
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleQuickAction('generate-report')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              {/* Communications Hub */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg font-bold">Communications Hub</CardTitle>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">0 new</Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <Mail className="h-12 w-12 mb-2" />
                    <p className="text-sm">No new messages</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 mt-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                    F
                  </div>
                  <span className="font-bold text-lg">Fashionistas</span>
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
                  <li><a href="/become-sponsor" className="hover:text-white">Become a Sponsor</a></li>
                  <li><a href="/about" className="hover:text-white">About Us</a></li>
                  <li><a href="/contact" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Resources</h4>
                <ul className="space-y-2 text-sm text-gray-400 mb-4">
                  <li><a href="/help" className="hover:text-white">Help Center</a></li>
                  <li><a href="/docs" className="hover:text-white">Documentation</a></li>
                  <li><a href="/api" className="hover:text-white">API Reference</a></li>
                  <li><a href="/blog" className="hover:text-white">Blog</a></li>
                  <li><a href="/careers" className="hover:text-white">Careers</a></li>
                  <li><a href="/press" className="hover:text-white">Press Kit</a></li>
                </ul>
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
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-400">
                  © 2025 Fashionistas. All rights reserved.
                </div>
                <div className="flex gap-6 text-sm text-gray-400">
                  <a href="/privacy" className="hover:text-white">Privacy Policy</a>
                  <a href="/terms" className="hover:text-white">Terms of Service</a>
                  <a href="/cookies" className="hover:text-white">Cookie Policy</a>
                  <a href="/compliance" className="hover:text-white">Compliance</a>
                </div>
              </div>
            </div>

            {/* Links Row */}
            <div className="mt-8 pt-8 border-t border-gray-800">
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <a href="/frontend" className="hover:text-gray-300">Frontend Repository</a>
                <span>•</span>
                <a href="/backend" className="hover:text-gray-300">Backend Repository</a>
                <span>•</span>
                <a href="/supabase" className="hover:text-gray-300">Supabase Dashboard</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default OrganizerDashboardDemo;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardLayout from '@/components/DashboardLayout';
import { useOrganizerDashboardData } from '@/hooks/useOrganizerDashboard';
import { format } from 'date-fns';
import { 
  Calendar, Users, TrendingUp, DollarSign, 
  BarChart3, Bell, Settings, Eye, Plus,
  MessageSquare, Clock, Target, CheckCircle,
  AlertCircle, Activity, PieChart, Send,
  Mail, Phone, ArrowUp, ArrowDown, MoreVertical,
  Sparkles, Zap, FileText, PlayCircle, Inbox,
  ChevronRight, ExternalLink, Hash, Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

const OrganizerDashboardNew = () => {
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Fetch real data from Supabase
  const { data, isLoading } = useOrganizerDashboardData();
  const { events = [], revenue = 0, attendees = 0 } = data || {};
  
  // Mock additional data
  const messages = [];
  const eventsData = { activeCount: 5, thisWeek: 2 };
  const attendeesData = { total: 1247, lastMonth: 1085 };
  const revenueData = { formatted: '$125K' };

  // Use real data or fallback to defaults with demo data
  const activeEventsCount = eventsData?.activeCount || 5;
  const thisWeekEvents = eventsData?.thisWeek || 2;
  const totalAttendees = attendeesData?.total || 1247;
  const attendeesGrowth = attendeesData?.lastMonth ? 
    Math.round(((totalAttendees - attendeesData.lastMonth) / attendeesData.lastMonth) * 100) : 15;
  const totalRevenue = revenueData?.formatted || '$125K';
  const revenueGrowth = 8; // Show 8% growth as demo
  // Transform events data for display
  const upcomingEvents = (Array.isArray(events) ? events : []).slice(0, 3).map((event, index) => ({
    id: event.id,
    name: event.event_name || event.title || `Event ${index + 1}`,
    date: event.start_datetime ? format(new Date(event.start_datetime), 'MMM dd, yyyy') : 'TBD',
    venue: event.venue_id || 'Venue TBD',
    status: event.status || 'planning',
    attendees: Math.floor(Math.random() * 500) + 100, // Mock for now
    revenue: Math.floor(Math.random() * 100000) + 10000, // Mock for now
    progress: Math.floor(Math.random() * 50) + 40
  })) || [];

  // Use real messages or fallback to demo data
  const recentMessages = messages || [
    { id: 1, type: 'sponsor', message: 'New sponsorship inquiry from Medellín Fashion Week', time: '5 min ago', urgent: true },
    { id: 2, type: 'designer', message: 'Maria Rodriguez confirmed for runway show', time: '1 hr ago', urgent: false },
    { id: 3, type: 'venue', message: 'Hotel Intercontinental available for booking', time: '2 hrs ago', urgent: false }
  ];

  // Mock analytics data (can be replaced with real data later)
  const analyticsData = {
    ticketSales: { current: 1234, capacity: 1645, percentage: 75 },
    revenueTarget: { current: 125000, target: 152000, percentage: 82 },
    engagement: { rate: 68, trend: 12 }
  };

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
          // TODO: Open invite modal or navigate to invite page
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
      // Add delay for better UX
      setTimeout(() => setQuickActionLoading(null), 500);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
          
          {/* Header Section matching bookings style */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Dashboard / Organizer</p>
                <h1 className="text-3xl font-bold text-foreground">Organizer Dashboard</h1>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 hover:from-pink-500 hover:via-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => handleQuickAction('create-event')}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Event
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics Row matching bookings style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Active Events Card */}
            <Card className="relative overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Active Events</p>
                    <p className="text-3xl font-bold text-foreground">
                      {activeEventsCount}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                      <ArrowUp className="h-4 w-4" />
                      <span>{thisWeekEvents} this week</span>
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-400 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Attendees Card */}
            <Card className="relative overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Total Attendees</p>
                    <p className="text-3xl font-bold text-foreground">
                      {totalAttendees.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                      {attendeesGrowth > 0 ? (
                        <>
                          <ArrowUp className="h-4 w-4" />
                          <span>+{attendeesGrowth}% from last month</span>
                        </>
                      ) : (
                        <span>Steady growth</span>
                      )}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-400 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Card */}
            <Card className="relative overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Revenue</p>
                    <p className="text-3xl font-bold text-foreground">
                      {totalRevenue}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {revenueGrowth > 0 ? `+${revenueGrowth}% growth` : 'On track'}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-400 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Performance Card */}
            <Card className="relative overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Performance</p>
                    <p className="text-3xl font-bold text-foreground">94%</p>
                    <p className="text-sm text-muted-foreground mt-2">Satisfaction rate</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-400 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid matching bookings style */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column - Events Management */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Events Management Card */}
              <Card className="border-border bg-card shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Events Management
                  </CardTitle>
                  <Button size="sm" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[320px] pr-4">
                    <div className="space-y-4">
                      {isLoading ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 bg-gray-100 rounded-xl animate-pulse">
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          ))}
                        </div>
                      ) : upcomingEvents.length > 0 ? (
                        upcomingEvents.map((event) => (
                          <div 
                            key={event.id} 
                            className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:from-blue-50 hover:to-blue-100/30 transition-all duration-200 cursor-pointer group border border-gray-200/50"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                  {event.name}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                  <Clock className="h-3 w-3" />                                  {event.date} • {event.venue}
                                </p>
                              </div>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {event.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600 flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {event.attendees} attendees
                              </span>
                              <span className="text-sm font-semibold text-green-600">
                                ${(event.revenue/1000).toFixed(0)}K revenue
                              </span>
                            </div>
                            <Progress value={event.progress} className="h-2 bg-gray-200" />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p>No events scheduled</p>
                          <Button variant="outline" size="sm" className="mt-3">
                            Create First Event
                          </Button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              {/* Communications Hub */}
              <Card className="border-border bg-card shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Communications Hub
                  </CardTitle>
                  <Badge variant="secondary">
                    {messages?.length || 0} new
                  </Badge>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="p-3 bg-gray-100 rounded-lg animate-pulse">
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </div>
                        ))}
                      </div>
                    ) : recentMessages.length > 0 ? (
                      recentMessages.map((msg) => (
                        <div key={msg.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className={cn(
                            "h-2 w-2 rounded-full mt-2",
                            msg.urgent ? "bg-red-500" : "bg-green-500"
                          )} />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{msg.message}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {typeof msg.time === 'string' && msg.time.includes('ago') 
                                ? msg.time 
                                : msg.time 
                                  ? format(new Date(msg.time), 'MMM dd, HH:mm')
                                  : 'Just now'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <Inbox className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No new messages</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Analytics */}
            <div className="lg:col-span-7 space-y-6">
              {/* Analytics Overview */}
              <Card className="border-border bg-card shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analytics Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ticket Sales */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Ticket Sales</span>
                        <span className="text-sm text-gray-500">
                          {analyticsData.ticketSales.current}/{analyticsData.ticketSales.capacity}
                        </span>
                      </div>
                      <Progress value={analyticsData.ticketSales.percentage} className="h-2 mb-2" />
                      <p className="text-xs text-gray-500">{analyticsData.ticketSales.percentage}% of capacity</p>
                    </div>

                    {/* Revenue Target */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Revenue Target</span>
                        <span className="text-sm text-gray-500">
                          ${(analyticsData.revenueTarget.current/1000).toFixed(0)}K/${(analyticsData.revenueTarget.target/1000).toFixed(0)}K
                        </span>
                      </div>
                      <Progress value={analyticsData.revenueTarget.percentage} className="h-2 mb-2" />
                      <p className="text-xs text-gray-500">{analyticsData.revenueTarget.percentage}% achieved</p>
                    </div>

                    {/* Engagement Rate */}
                    <div className="md:col-span-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Engagement Rate</span>
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <ArrowUp className="h-3 w-3" />
                          +{analyticsData.engagement.trend}% this week
                        </span>
                      </div>
                      <Progress value={analyticsData.engagement.rate} className="h-2 mb-2" />
                      <p className="text-xs text-gray-500">{analyticsData.engagement.rate}% engagement rate</p>
                    </div>
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
                  <CardTitle className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    disabled={quickActionLoading === 'create-event'}
                    onClick={() => handleQuickAction('create-event')}
                  >
                    {quickActionLoading === 'create-event' ? (
                      <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    <span className="text-xs">Create Event</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    disabled={quickActionLoading === 'add-designer'}
                    onClick={() => handleQuickAction('add-designer')}
                  >
                    {quickActionLoading === 'add-designer' ? (
                      <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full" />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                    <span className="text-xs">Add Designer</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    disabled={quickActionLoading === 'send-invite'}
                    onClick={() => handleQuickAction('send-invite')}
                  >
                    {quickActionLoading === 'send-invite' ? (
                      <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    <span className="text-xs">Send Invite</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    disabled={quickActionLoading === 'generate-report'}
                    onClick={() => handleQuickAction('generate-report')}
                  >
                    {quickActionLoading === 'generate-report' ? (
                      <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    <span className="text-xs">Generate Report</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
};

export default OrganizerDashboardNew;
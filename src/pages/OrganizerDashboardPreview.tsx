import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardLayout from '@/components/DashboardLayout';
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

const OrganizerDashboardPreview = () => {
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Demo data for preview
  const activeEventsCount = 5;
  const thisWeekEvents = 2;
  const totalAttendees = 1247;
  const attendeesGrowth = 15;
  const totalRevenue = '$125K';
  const revenueGrowth = 8;

  const upcomingEvents = [
    {
      id: '1',
      name: 'Medellín Fashion Week 2025',
      date: 'Sep 18, 2025',
      venue: 'Plaza Mayor Convention Center',
      status: 'active',
      attendees: 450,
      revenue: 85000,
      progress: 75
    },
    {
      id: '2',
      name: 'Noches de Alta Costura Paisa',
      date: 'Sep 12, 2025',
      venue: 'Hotel Intercontinental',
      status: 'planning',
      attendees: 280,
      revenue: 45000,
      progress: 60
    },
    {
      id: '3',
      name: 'Sustainable Fashion Summit',
      date: 'Oct 5, 2025',
      venue: 'Museo de Arte Moderno',
      status: 'planning',
      attendees: 150,
      revenue: 25000,
      progress: 40
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
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          
          {/* Header Section */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Organizer Dashboard</h1>
              <p className="text-gray-600 mt-2">Complete event management and real-time tracking</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => handleQuickAction('create-event')}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Event
              </Button>
              <Button size="icon" variant="outline" className="bg-white shadow-md hover:shadow-lg">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {/* Active Events Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  Active Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">{activeEventsCount}</div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {thisWeekEvents} this week
                </p>
              </CardContent>
            </Card>

            {/* Total Attendees Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  Total Attendees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">{totalAttendees}</div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  +{attendeesGrowth}% this month
                </p>
              </CardContent>
            </Card>

            {/* Revenue Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">{totalRevenue}</div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{revenueGrowth}% growth
                </p>
              </CardContent>
            </Card>

            {/* Messages Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  New Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">23</div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  5 urgent
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="xl:col-span-2 space-y-6">
              {/* Upcoming Events */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Upcoming Events
                  </CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="p-4 rounded-lg border hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{event.name}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" /> {event.attendees} attendees
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" /> ${event.revenue.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                            {event.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{event.progress}%</span>
                          </div>
                          <Progress value={event.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Analytics Dashboard */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Ticket Sales</span>
                        <Target className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-900">{analyticsData.ticketSales.percentage}%</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {analyticsData.ticketSales.current} / {analyticsData.ticketSales.capacity}
                      </div>
                      <Progress value={analyticsData.ticketSales.percentage} className="h-1 mt-2" />
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Revenue Target</span>
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-900">{analyticsData.revenueTarget.percentage}%</div>
                      <div className="text-xs text-gray-600 mt-1">
                        ${(analyticsData.revenueTarget.current / 1000).toFixed(0)}k / ${(analyticsData.revenueTarget.target / 1000).toFixed(0)}k
                      </div>
                      <Progress value={analyticsData.revenueTarget.percentage} className="h-1 mt-2" />
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Engagement Rate</span>
                        <Activity className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-900">{analyticsData.engagement.rate}%</div>
                      <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                        <ArrowUp className="h-3 w-3 text-green-600" />
                        +{analyticsData.engagement.trend}% this week
                      </div>
                      <Progress value={analyticsData.engagement.rate} className="h-1 mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
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
                    Send Invites
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

              {/* Recent Messages */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Inbox className="h-5 w-5 text-blue-600" />
                    Recent Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {recentMessages.map((msg) => (
                        <div key={msg.id} className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "p-2 rounded-full",
                              msg.type === 'sponsor' ? "bg-purple-100" : 
                              msg.type === 'designer' ? "bg-blue-100" : "bg-green-100"
                            )}>
                              {msg.type === 'sponsor' ? <DollarSign className="h-4 w-4 text-purple-600" /> :
                               msg.type === 'designer' ? <Users className="h-4 w-4 text-blue-600" /> :
                               <Calendar className="h-4 w-4 text-green-600" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                            </div>
                            {msg.urgent && (
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerDashboardPreview;
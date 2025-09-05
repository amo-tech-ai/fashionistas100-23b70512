import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardLayout from '@/components/DashboardLayout';
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

  // Mock data for events
  const upcomingEvents = [
    { id: 1, name: 'Fashion Week 2025', date: 'Oct 15, 2025', venue: 'Grand Palais', status: 'planning', attendees: 850, revenue: 125000, progress: 75 },
    { id: 2, name: 'Designer Showcase', date: 'Oct 16, 2025', venue: 'Grand Palais', status: 'planning', attendees: 450, revenue: 67000, progress: 65 },
    { id: 3, name: 'Summer Launch', date: 'Oct 17, 2025', venue: 'Grand Palais', status: 'planning', attendees: 320, revenue: 45000, progress: 45 }
  ];

  // Mock data for communications
  const recentMessages = [
    { id: 1, type: 'sponsor', message: 'Sponsor inquiry from Luxury Brand Co.', time: '2 hours ago', urgent: true },
    { id: 2, type: 'venue', message: 'Venue confirmation from Grand Palais', time: '5 hours ago', urgent: false },
    { id: 3, type: 'designer', message: 'Designer application submitted', time: '8 hours ago', urgent: false }
  ];

  // Mock analytics data
  const analyticsData = {
    ticketSales: { current: 1234, capacity: 1645, percentage: 75 },
    revenueTarget: { current: 125000, target: 152000, percentage: 82 },
    engagement: { rate: 68, trend: 12 }
  };

  const handleQuickAction = async (action: string) => {
    setQuickActionLoading(action);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setQuickActionLoading(null);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
        {/* Improved container with max width and proper padding */}
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          
          {/* Header Section with better spacing */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Organizer Dashboard</h1>
              <p className="text-gray-600 mt-2">Complete event management and real-time tracking</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => handleQuickAction('create')}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Event
              </Button>
              <Button size="icon" variant="outline" className="bg-white shadow-md hover:shadow-lg">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Key Metrics Row with proper spacing and responsive grid */}
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
                <div className="text-4xl font-bold text-white mb-1">8</div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <ArrowUp className="h-4 w-4" />
                  <span>3 this week</span>
                </p>
              </CardContent>
            </Card>

            {/* Total Attendees Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-500 to-emerald-600">
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
                <div className="text-4xl font-bold text-white mb-1">2,456</div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <ArrowUp className="h-4 w-4" />
                  <span>+15% from last month</span>
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
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">$342K</div>
                <p className="text-sm text-white/80">On track</p>
              </CardContent>
            </Card>

            {/* Performance Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-amber-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">94%</div>
                <p className="text-sm text-white/80">Satisfaction rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid with better spacing */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left Column - Takes 5 columns on large screens */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Events Management Card */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-200/30">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-blue-900">
                      <Calendar className="h-5 w-5" />
                      <span className="font-semibold">Events Management</span>
                    </span>
                    <Button size="sm" variant="ghost" className="hover:bg-blue-200/30">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[320px] pr-4">
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
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
                                <Clock className="h-3 w-3" />
                                {event.date} • {event.venue}
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
                      ))}
                      <Button variant="outline" className="w-full border-dashed border-2 hover:border-blue-400 hover:bg-blue-50" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View All Events
                      </Button>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Planning & Tasks Card */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200/30">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-orange-900">
                      <Target className="h-5 w-5" />
                      <span className="font-semibold">Planning & Tasks</span>
                    </span>
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                      5 active
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Venue booking confirmed</p>
                        <p className="text-sm text-gray-500 mt-1">Due today</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Designer lineup finalization</p>
                        <p className="text-sm text-gray-500 mt-1">Due in 2 days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 animate-pulse" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Sponsor agreements pending</p>
                        <p className="text-sm text-gray-500 mt-1">Overdue by 1 day</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4" size="sm">
                      View All Tasks
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Column - Takes 4 columns */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Communications Hub Card */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b border-green-200/30">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-green-900">
                      <MessageSquare className="h-5 w-5" />
                      <span className="font-semibold">Communications Hub</span>
                    </span>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      3 new
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3 mb-6">
                    {recentMessages.map((msg) => (
                      <div 
                        key={msg.id}
                        className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:from-green-50 hover:to-green-100/30 transition-all duration-200 cursor-pointer border border-gray-200/50"
                      >
                        <div className="flex items-start gap-3">
                          {msg.urgent && (
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 animate-pulse" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{msg.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">Quick Actions</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" className="justify-start hover:bg-green-50 hover:border-green-300">
                        <Mail className="h-3 w-3 mr-2" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline" className="justify-start hover:bg-green-50 hover:border-green-300">
                        <Phone className="h-3 w-3 mr-2" />
                        WhatsApp
                      </Button>
                      <Button size="sm" variant="outline" className="justify-start hover:bg-green-50 hover:border-green-300">
                        <Send className="h-3 w-3 mr-2" />
                        Broadcast
                      </Button>
                      <Button size="sm" variant="outline" className="justify-start hover:bg-green-50 hover:border-green-300">
                        <Bell className="h-3 w-3 mr-2" />
                        Notify
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Center Card */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-purple-200/30">
                  <CardTitle className="flex items-center gap-3 text-purple-900">
                    <Zap className="h-5 w-5" />
                    <span className="font-semibold">Quick Actions Center</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <Button 
                    className="w-full justify-start hover:translate-x-1 transition-transform" 
                    variant="outline"
                    disabled={quickActionLoading === 'event'}
                    onClick={() => handleQuickAction('event')}
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    Create New Event
                  </Button>
                  <Button 
                    className="w-full justify-start hover:translate-x-1 transition-transform" 
                    variant="outline"
                    disabled={quickActionLoading === 'designer'}
                    onClick={() => handleQuickAction('designer')}
                  >
                    <Users className="h-4 w-4 mr-3" />
                    Add Designer
                  </Button>
                  <Button 
                    className="w-full justify-start hover:translate-x-1 transition-transform" 
                    variant="outline"
                    disabled={quickActionLoading === 'sponsor'}
                    onClick={() => handleQuickAction('sponsor')}
                  >
                    <Sparkles className="h-4 w-4 mr-3" />
                    Find Sponsors
                  </Button>
                  <Button 
                    className="w-full justify-start hover:translate-x-1 transition-transform" 
                    variant="outline"
                    disabled={quickActionLoading === 'report'}
                    onClick={() => handleQuickAction('report')}
                  >
                    <FileText className="h-4 w-4 mr-3" />
                    Generate Report
                  </Button>
                  <Button 
                    className="w-full justify-start hover:translate-x-1 transition-transform" 
                    variant="outline"
                    disabled={quickActionLoading === 'campaign'}
                    onClick={() => handleQuickAction('campaign')}
                  >
                    <PlayCircle className="h-4 w-4 mr-3" />
                    Launch Campaign
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Takes 3 columns */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Analytics Overview Card */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-100/50 border-b border-purple-200/30">
                  <CardTitle className="flex items-center gap-3 text-purple-900">
                    <BarChart3 className="h-5 w-5" />
                    <span className="font-semibold">Analytics Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  {/* Ticket Sales */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Ticket Sales</span>
                      <span className="text-sm font-bold text-green-600">
                        {analyticsData.ticketSales.current}/{analyticsData.ticketSales.capacity}
                      </span>
                    </div>
                    <Progress value={analyticsData.ticketSales.percentage} className="h-2.5" />
                    <p className="text-xs text-gray-500 mt-1.5">
                      {analyticsData.ticketSales.percentage}% of capacity
                    </p>
                  </div>

                  {/* Revenue Target */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Revenue Target</span>
                      <span className="text-sm font-bold text-blue-600">
                        ${(analyticsData.revenueTarget.current/1000).toFixed(0)}K
                      </span>
                    </div>
                    <Progress value={analyticsData.revenueTarget.percentage} className="h-2.5" />
                    <p className="text-xs text-gray-500 mt-1.5">
                      {analyticsData.revenueTarget.percentage}% achieved
                    </p>
                  </div>

                  {/* Engagement Rate */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Engagement Rate</span>
                      <span className="text-sm font-bold text-purple-600">
                        {analyticsData.engagement.rate}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600">
                        +{analyticsData.engagement.trend}% this week
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4" size="sm">
                    <PieChart className="h-3 w-3 mr-2" />
                    View Detailed Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity Card */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/30">
                  <CardTitle className="flex items-center gap-3 text-gray-900">
                    <Inbox className="h-5 w-5" />
                    <span className="font-semibold">Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[240px] pr-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900">New ticket purchase</p>
                          <p className="text-xs text-gray-600 mt-0.5">Fashion Week 2025 - VIP Pass</p>
                          <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900">Designer confirmed</p>
                          <p className="text-xs text-gray-600 mt-0.5">Alexander Wang for Oct 15</p>
                          <p className="text-xs text-gray-400 mt-1">15 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900">Sponsor payment received</p>
                          <p className="text-xs text-gray-600 mt-0.5">$25,000 from Luxury Brand Co.</p>
                          <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900">Media request</p>
                          <p className="text-xs text-gray-600 mt-0.5">Vogue - Press accreditation</p>
                          <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                        </div>
                      </div>
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

export default OrganizerDashboardNew;
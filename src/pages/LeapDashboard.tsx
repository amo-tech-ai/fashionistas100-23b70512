import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDays, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Ticket, 
  MapPin,
  BarChart3,
  Building2,
  Calendar,
  ShoppingBag,
  Settings,
  Bell,
  ChevronRight,
  Eye,
  Edit,
  Plus,
  FileText,
  UserCheck,
  Target,
  Award,
  Clock,
  MessageSquare,
  Package,
  Briefcase,
  PieChart,
  Activity,
  Database,
  Zap
} from 'lucide-react';

export const LeapDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Mock data enhanced with new features
  const mockEvents = [
    { id: 1, name: 'Fashion Week 2025', date: '2025-10-15', venue: 'Grand Palais', capacity: 500, status: 'active' },
    { id: 2, name: 'Designer Showcase', date: '2025-11-20', venue: 'The Venue', capacity: 200, status: 'planning' },
    { id: 3, name: 'Summer Collection Launch', date: '2025-06-01', venue: 'Rooftop Gallery', capacity: 150, status: 'active' }
  ];

  const mockStats = {
    totalEvents: 12,
    activeBookings: 348,
    totalRevenue: '$125,000',
    activeSponsors: 8,
    groupBookings: 42,
    userSatisfaction: '94%',
    upcomingPlans: 7,
    activeProposals: 5
  };

  const dashboardPages = [
    { 
      title: 'Organizer Dashboard', 
      path: '/admin/organizer', 
      icon: <Settings className="h-5 w-5" />,
      description: 'Complete event management and analytics',
      badge: 'Enhanced',
      color: 'bg-purple-100 text-purple-800'
    },
    { 
      title: 'User Dashboard', 
      path: '/admin/user', 
      icon: <Users className="h-5 w-5" />,
      description: 'User preferences and booking history',
      badge: 'New',
      color: 'bg-blue-100 text-blue-800'
    },
    { 
      title: 'Sponsor Dashboard', 
      path: '/admin/sponsor', 
      icon: <Building2 className="h-5 w-5" />,
      description: 'Sponsor management and proposals',
      badge: 'New',
      color: 'bg-green-100 text-green-800'
    },
    { 
      title: 'Group Booking', 
      path: '/admin/group-booking', 
      icon: <ShoppingBag className="h-5 w-5" />,
      description: 'Manage group bookings and chat',
      badge: 'New',
      color: 'bg-yellow-100 text-yellow-800'
    },
    { 
      title: 'Production Planning', 
      path: '/admin/production', 
      icon: <FileText className="h-5 w-5" />,
      description: 'Event production and coordination',
      badge: 'New',
      color: 'bg-red-100 text-red-800'
    },
    { 
      title: 'Event Analytics', 
      path: '/admin/analytics', 
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Advanced analytics and insights',
      badge: 'Enhanced',
      color: 'bg-indigo-100 text-indigo-800'
    }
  ];

  const newFeatures = [
    { name: 'Group Chat System', status: 'active', icon: <MessageSquare className="h-4 w-4" /> },
    { name: 'Sponsor Prospecting', status: 'active', icon: <Target className="h-4 w-4" /> },
    { name: 'ML Recommendations', status: 'active', icon: <Zap className="h-4 w-4" /> },
    { name: 'Production Frameworks', status: 'active', icon: <Package className="h-4 w-4" /> },
    { name: 'Lead Management', status: 'active', icon: <Briefcase className="h-4 w-4" /> },
    { name: 'Advanced Planning', status: 'active', icon: <Clock className="h-4 w-4" /> }
  ];

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-full">
        <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-2">Leap Backend Dashboard</h1>
          <p className="text-xl opacity-90">Complete Fashion Event Management Platform</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge className="bg-white/20 text-white border-white/30">v2.0 Enhanced</Badge>
            <Badge className="bg-white/20 text-white border-white/30">11+ Services</Badge>
            <Badge className="bg-white/20 text-white border-white/30">Real-time Updates</Badge>
            <Badge className="bg-white/20 text-white border-white/30">AI Powered</Badge>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Ticket className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeBookings}</div>
              <p className="text-xs text-muted-foreground">+48 new this week</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Group Bookings</CardTitle>
              <ShoppingBag className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.groupBookings}</div>
              <p className="text-xs text-muted-foreground">12 pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Navigation Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Dashboard Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardPages.map((page) => (
              <Card 
                key={page.path} 
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(page.path)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                      {page.icon}
                    </div>
                    <Badge className={page.color}>{page.badge}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{page.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{page.description}</p>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-gray-50"
                  >
                    Open Dashboard
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-white rounded-lg shadow">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
              {['overview', 'events', 'bookings', 'sponsors', 'production', 'analytics'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 px-6 py-4 capitalize"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="p-6">
              {/* Overview Tab with New Features */}
              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Events */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Recent Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mockEvents.map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-semibold">{event.name}</h4>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.venue}
                              </span>
                            </div>
                          </div>
                          <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                            {event.status}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* New Features Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        New Platform Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {newFeatures.map((feature) => (
                        <div key={feature.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {feature.icon}
                            <span className="font-medium">{feature.name}</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-auto flex-col py-4"
                        onClick={() => navigate('/admin/create-event')}
                      >
                        <Plus className="h-5 w-5 mb-2" />
                        Create Event
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto flex-col py-4"
                        onClick={() => navigate('/admin/group-booking')}
                      >
                        <Users className="h-5 w-5 mb-2" />
                        Group Booking
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto flex-col py-4"
                        onClick={() => navigate('/admin/add-sponsor')}
                      >
                        <Building2 className="h-5 w-5 mb-2" />
                        Add Sponsor
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto flex-col py-4"
                        onClick={() => navigate('/admin/production')}
                      >
                        <FileText className="h-5 w-5 mb-2" />
                        Production Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Event Management</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/admin/event-plans')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Event Plans
                    </Button>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Event
                    </Button>
                  </div>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {mockEvents.map((event) => (
                        <div key={event.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold">{event.name}</h4>
                              <p className="text-gray-600 mt-1">
                                {event.date} • {event.venue} • {event.capacity} seats
                              </p>
                              <div className="mt-3 flex gap-2">
                                <Badge>Check-in Ready</Badge>
                                <Badge variant="outline">Production Planned</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm">Manage</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Bookings Tab with Group Features */}
              <TabsContent value="bookings" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Booking Management</h3>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Group Bookings
                    </Button>
                    <Button>
                      <Ticket className="mr-2 h-4 w-4" />
                      New Booking
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Fashion Week 2025</p>
                              <p className="text-sm text-gray-600">John Doe • 2 tickets</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Designer Showcase</p>
                              <p className="text-sm text-gray-600">Group: Marketing Team • 15 tickets</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">Group</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Check-in Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Fashion Week 2025</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">145/500</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{width: '29%'}}></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Designer Showcase</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">89/200</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{width: '44%'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Sponsors Tab Enhanced */}
              <TabsContent value="sponsors" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Sponsor Management</h3>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Target className="mr-2 h-4 w-4" />
                      Prospecting
                    </Button>
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Proposals
                    </Button>
                    <Button>
                      <Building2 className="mr-2 h-4 w-4" />
                      Add Sponsor
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Active Sponsors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">8</div>
                      <p className="text-sm text-gray-600">$250K total value</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Prospects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">24</div>
                      <p className="text-sm text-gray-600">7 hot leads</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Proposals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">5</div>
                      <p className="text-sm text-gray-600">$180K potential</p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Sponsor Pipeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Luxury Brand Co.</p>
                            <p className="text-sm text-gray-600">Platinum Package • $50K</p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">Negotiation</Badge>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Fashion Tech Inc.</p>
                            <p className="text-sm text-gray-600">Gold Package • $25K</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Proposal Sent</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Production Tab */}
              <TabsContent value="production" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Production Planning</h3>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Production Plan
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Productions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">Fashion Week 2025</p>
                            <Badge>In Progress</Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tasks Completed</span>
                              <span>24/35</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{width: '68%'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Production Frameworks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Package className="mr-2 h-4 w-4" />
                          Fashion Show Framework
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Package className="mr-2 h-4 w-4" />
                          Product Launch Framework
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Package className="mr-2 h-4 w-4" />
                          Pop-up Event Framework
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Analytics & Insights</h3>
                  <Button variant="outline">
                    <Activity className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Growth Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">+28%</div>
                      <p className="text-xs text-gray-600">vs last quarter</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Satisfaction
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">94%</div>
                      <p className="text-xs text-gray-600">from 500+ reviews</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        NPS Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">72</div>
                      <p className="text-xs text-gray-600">Excellent</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <PieChart className="h-4 w-4" />
                        Conversion
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">42%</div>
                      <p className="text-xs text-gray-600">Lead to booking</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* System Status Footer */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">All Systems Operational</span>
              </div>
              <div className="text-sm text-gray-600">
                API: <span className="font-medium">100ms</span>
              </div>
              <div className="text-sm text-gray-600">
                Database: <span className="font-medium">Connected</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-1" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeapDashboard;
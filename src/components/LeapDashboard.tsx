import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  ShoppingBag
} from 'lucide-react';

export const LeapDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const mockEvents = [
    { id: 1, name: 'Fashion Week 2025', date: '2025-10-15', venue: 'Grand Palais', capacity: 500 },
    { id: 2, name: 'Designer Showcase', date: '2025-11-20', venue: 'The Venue', capacity: 200 },
    { id: 3, name: 'Summer Collection Launch', date: '2025-06-01', venue: 'Rooftop Gallery', capacity: 150 }
  ];

  const mockStats = {
    totalEvents: 12,
    activeBookings: 348,
    totalRevenue: '$125,000',
    activeSponsors: 8
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Leap Backend Dashboard</h1>
          <p className="text-gray-600">Manage your fashion events, bookings, and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeBookings}</div>
              <p className="text-xs text-muted-foreground">+48 new this week</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sponsors</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeSponsors}</div>
              <p className="text-xs text-muted-foreground">2 pending approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {['overview', 'events', 'bookings', 'sponsors', 'venues', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
                  <div className="space-y-4">
                    {mockEvents.map((event) => (
                      <Card key={event.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{event.name}</h4>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <CalendarDays className="h-4 w-4" />
                                  {new Date(event.date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {event.venue}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {event.capacity} capacity
                                </span>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">View Details</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full justify-start" variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Create New Event
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Ticket className="mr-2 h-4 w-4" />
                        Process Booking
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Building2 className="mr-2 h-4 w-4" />
                        Add Sponsor
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Analytics
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>System Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">API Status</span>
                        <Badge className="bg-green-100 text-green-800">Operational</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Database</span>
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">WebSocket</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Idle</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">ML Service</span>
                        <Badge className="bg-green-100 text-green-800">Ready</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Event Management</h3>
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </div>
                <div className="grid gap-4">
                  {mockEvents.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-lg font-semibold">{event.name}</h4>
                            <p className="text-gray-600 mt-1">
                              {event.date} • {event.venue} • {event.capacity} seats
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="outline">Analytics</Button>
                            <Button size="sm">Manage</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Booking System</h3>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Group Booking
                    </Button>
                    <Button>
                      <Ticket className="mr-2 h-4 w-4" />
                      New Booking
                    </Button>
                  </div>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600 text-center py-8">
                      No active bookings. Create your first booking to get started.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Sponsors Tab */}
            {activeTab === 'sponsors' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Sponsor Management</h3>
                  <Button>
                    <Building2 className="mr-2 h-4 w-4" />
                    Add Sponsor
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Active Sponsors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">8</div>
                      <p className="text-sm text-gray-600">$250K total value</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Prospects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">12</div>
                      <p className="text-sm text-gray-600">3 hot leads</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Conversion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">42%</div>
                      <p className="text-sm text-gray-600">+5% this quarter</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Venues Tab */}
            {activeTab === 'venues' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Venue Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['Grand Palais', 'The Venue', 'Rooftop Gallery', 'Convention Center'].map((venue) => (
                    <Card key={venue}>
                      <CardHeader>
                        <CardTitle className="text-base">{venue}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Capacity</span>
                            <span className="font-semibold">{Math.floor(Math.random() * 500) + 100}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Utilization</span>
                            <span className="font-semibold">{Math.floor(Math.random() * 40) + 60}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Revenue</span>
                            <span className="font-semibold">${Math.floor(Math.random() * 50) + 20}K</span>
                          </div>
                        </div>
                        <Button className="w-full mt-4" size="sm" variant="outline">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Advanced Analytics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        ML Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        AI-powered insights for your events
                      </p>
                      <Button className="w-full" variant="outline">
                        Generate Recommendations
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Real-time analytics and KPIs
                      </p>
                      <Button className="w-full" variant="outline">
                        View Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
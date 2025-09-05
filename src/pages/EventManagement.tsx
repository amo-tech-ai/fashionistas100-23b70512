import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Eye, Edit, Settings, Search, Plus,
  Users, MapPin, Clock, Ticket, DollarSign,
  TrendingUp, BarChart3, AlertCircle, CheckCircle,
  FileText, Download, Share2, MoreVertical
} from 'lucide-react';

export const EventManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [searchTerm, setSearchTerm] = useState('');

  const events = [
    {
      id: 1,
      name: 'Fashion Week 2025',
      date: '2025-10-15',
      venue: 'Grand Palais',
      capacity: 500,
      ticketsSold: 342,
      revenue: '$85,500',
      status: 'on-sale',
      checkInReady: true,
      productionPlanned: true
    },
    {
      id: 2,
      name: 'Designer Showcase',
      date: '2025-11-20',
      venue: 'The Venue',
      capacity: 200,
      ticketsSold: 156,
      revenue: '$31,200',
      status: 'on-sale',
      checkInReady: true,
      productionPlanned: true
    },
    {
      id: 3,
      name: 'Summer Collection Launch',
      date: '2025-06-01',
      venue: 'Rooftop Gallery',
      capacity: 150,
      ticketsSold: 89,
      revenue: '$22,250',
      status: 'planning',
      checkInReady: true,
      productionPlanned: true
    }
  ];

  const handleView = (eventId: number) => {
    navigate(`/admin/event/${eventId}`);
  };

  const handleEdit = (eventId: number) => {
    navigate(`/admin/event/${eventId}/edit`);
  };

  const handleManage = (eventId: number) => {
    navigate(`/admin/event/${eventId}/manage`);
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none px-4 pb-4"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="events" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none px-4 pb-4"
                  >
                    Events
                  </TabsTrigger>
                  <TabsTrigger 
                    value="bookings" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none px-4 pb-4"
                  >
                    Bookings
                  </TabsTrigger>
                  <TabsTrigger 
                    value="sponsors" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none px-4 pb-4"
                  >
                    Sponsors
                  </TabsTrigger>
                  <TabsTrigger 
                    value="production" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none px-4 pb-4"
                  >
                    Production
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none px-4 pb-4"
                  >
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="events" className="mt-0">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Event Management</h2>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline"
                          onClick={() => navigate('/admin/event-plans')}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Event Plans
                        </Button>
                        <Button onClick={() => navigate('/admin/create-event')}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Event
                        </Button>
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search events..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Events List */}
                    <div className="space-y-4">
                      {filteredEvents.map((event) => (
                        <Card key={event.id} className="hover:shadow-lg transition-all">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                                <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {event.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {event.venue}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {event.capacity} seats
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  {event.checkInReady && (
                                    <Badge className="bg-green-100 text-green-800">
                                      Check-in Ready
                                    </Badge>
                                  )}
                                  {event.productionPlanned && (
                                    <Badge variant="outline">
                                      Production Planned
                                    </Badge>
                                  )}
                                  <Badge className={
                                    event.status === 'on-sale' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }>
                                    {event.status === 'on-sale' ? 'On Sale' : 'Planning'}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleView(event.id)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEdit(event.id)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleManage(event.id)}
                                >
                                  Manage
                                </Button>
                              </div>
                            </div>

                            {/* Event Metrics */}
                            <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
                              <div>
                                <p className="text-xs text-gray-600">Tickets Sold</p>
                                <p className="text-lg font-semibold">
                                  {event.ticketsSold}/{event.capacity}
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                  <div 
                                    className="bg-green-500 h-1 rounded-full"
                                    style={{ width: `${(event.ticketsSold/event.capacity)*100}%` }}
                                  />
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Revenue</p>
                                <p className="text-lg font-semibold">{event.revenue}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Check-ins</p>
                                <p className="text-lg font-semibold">0/{event.ticketsSold}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Days Until</p>
                                <p className="text-lg font-semibold">
                                  {Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sponsors" className="mt-0">
                  <div className="space-y-6">
                    {/* Sponsors Header */}
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Sponsor Management</h2>
                      <div className="flex gap-3">
                        <Button variant="outline">
                          <Target className="h-4 w-4 mr-2" />
                          Prospecting
                        </Button>
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Proposals
                        </Button>
                        <Button onClick={() => navigate('/admin/add-sponsor')}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Sponsor
                        </Button>
                      </div>
                    </div>

                    {/* Sponsor Stats */}
                    <div className="grid grid-cols-3 gap-6">
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
                          <div className="text-3xl font-bold">24</div>
                          <p className="text-sm text-gray-600">7 hot leads</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Proposals</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">5</div>
                          <p className="text-sm text-gray-600">$180K potential</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Sponsor Pipeline */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Sponsor Pipeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-semibold">Luxury Brand Co.</h4>
                              <p className="text-sm text-gray-600">Platinum Package • $50K</p>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800">Negotiation</Badge>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-semibold">Fashion Tech Inc.</h4>
                              <p className="text-sm text-gray-600">Gold Package • $25K</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">Proposal Sent</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="production" className="mt-0">
                  <div className="space-y-6">
                    {/* Production Header */}
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Production Planning</h2>
                      <Button onClick={() => navigate('/admin/production')}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Production Plan
                      </Button>
                    </div>

                    {/* Active Productions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Active Productions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold">Fashion Week 2025</h4>
                                <Badge className="bg-green-100 text-green-800">In Progress</Badge>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Tasks Completed</span>
                                  <span>24/35</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '69%' }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Production Frameworks</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">
                              <Settings className="h-4 w-4 mr-2" />
                              Fashion Show Framework
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <Settings className="h-4 w-4 mr-2" />
                              Product Launch Framework
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <Settings className="h-4 w-4 mr-2" />
                              Pop-up Event Framework
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Add other tab contents as needed */}
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EventManagement;
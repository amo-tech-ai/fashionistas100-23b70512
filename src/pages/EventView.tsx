import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, MapPin, Users, Clock, DollarSign,
  Ticket, Eye, Edit, Settings, ArrowLeft,
  CheckCircle, AlertCircle, TrendingUp, BarChart3,
  Download, Share2, Mail, MessageSquare, FileText
} from 'lucide-react';

export const EventView = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock event data - in production, fetch from API
  const event = {
    id: eventId,
    name: 'Fashion Week 2025',
    date: '2025-10-15',
    time: '19:00',
    venue: 'Grand Palais',
    address: '3 Avenue du Général Eisenhower, 75008 Paris',
    capacity: 500,
    ticketsSold: 342,
    revenue: '$85,500',
    status: 'active',
    description: 'The most anticipated fashion event of the year featuring top designers.',
    image: 'https://via.placeholder.com/800x400',
    organizer: {
      name: 'Fashion Events Inc.',
      email: 'contact@fashionevents.com',
      phone: '+1 234 567 890'
    },
    pricing: [
      { tier: 'VIP', price: '$500', available: 20 },
      { tier: 'Premium', price: '$250', available: 80 },
      { tier: 'General', price: '$150', available: 242 }
    ],
    sponsors: [
      { name: 'Luxury Brand Co.', level: 'Platinum' },
      { name: 'Fashion Tech Inc.', level: 'Gold' },
      { name: 'Beauty Partners', level: 'Silver' }
    ]
  };

  const attendees = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', ticket: 'VIP', status: 'confirmed' },
    { id: 2, name: 'Mike Chen', email: 'mike@email.com', ticket: 'Premium', status: 'confirmed' },
    { id: 3, name: 'Emma Davis', email: 'emma@email.com', ticket: 'General', status: 'pending' }
  ];

  const tasks = [
    { id: 1, task: 'Stage Setup', status: 'completed', assignee: 'John Doe', due: '2025-10-14' },
    { id: 2, task: 'Sound Check', status: 'in-progress', assignee: 'Jane Smith', due: '2025-10-15' },
    { id: 3, task: 'Lighting Setup', status: 'pending', assignee: 'Bob Wilson', due: '2025-10-15' },
    { id: 4, task: 'Catering Arrival', status: 'pending', assignee: 'Alice Brown', due: '2025-10-15' }
  ];

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/events')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.venue}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/admin/event/${eventId}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </Button>
                <Button onClick={() => navigate(`/admin/event/${eventId}/manage`)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Tickets Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{event.ticketsSold}</div>
                <div className="text-xs text-gray-600">of {event.capacity}</div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <div 
                    className="bg-green-500 h-1 rounded-full"
                    style={{ width: `${(event.ticketsSold/event.capacity)*100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{event.revenue}</div>
                <div className="text-xs text-green-600">+15% vs target</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Check-ins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-gray-600">Event upcoming</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Sponsors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{event.sponsors.length}</div>
                <div className="text-xs text-gray-600">Active partners</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
                <div className="text-xs text-gray-600 mt-1">On sale</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-lg shadow">
            <TabsList className="w-full justify-start border-b rounded-none">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attendees">Attendees</TabsTrigger>
              <TabsTrigger value="production">Production</TabsTrigger>
              <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Event Description */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Event Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Venue</span>
                            <span className="font-medium">{event.venue}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Address</span>
                            <span className="font-medium text-right">{event.address}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Date & Time</span>
                            <span className="font-medium">{event.date} at {event.time}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-gray-600">Capacity</span>
                            <span className="font-medium">{event.capacity} guests</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Ticket Pricing */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Ticket Pricing</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {event.pricing.map((tier, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <h4 className="font-semibold">{tier.tier}</h4>
                                <p className="text-sm text-gray-600">{tier.available} available</p>
                              </div>
                              <span className="text-lg font-bold">{tier.price}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    {/* Organizer Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Organizer</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="font-semibold">{event.organizer.name}</p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <a href={`mailto:${event.organizer.email}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                              <Mail className="h-4 w-4" />
                              {event.organizer.email}
                            </a>
                            <p className="flex items-center gap-2">
                              📞 {event.organizer.phone}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button className="w-full justify-start" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export Guest List
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Announcement
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Report
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Team Chat
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attendees" className="mt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Registered Attendees</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button size="sm">
                        ➕ Add Attendee
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {attendees.map((attendee) => (
                          <tr key={attendee.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{attendee.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{attendee.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline">{attendee.ticket}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={
                                attendee.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }>
                                {attendee.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Button variant="ghost" size="sm">View</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="production" className="mt-0">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Production Tasks</h3>
                    <Button size="sm">
                      ➕ Add Task
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <Card key={task.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-2 h-2 rounded-full ${
                                task.status === 'completed' ? 'bg-green-500' :
                                task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                              }`} />
                              <div>
                                <h4 className="font-semibold">{task.task}</h4>
                                <p className="text-sm text-gray-600">
                                  Assigned to {task.assignee} • Due {task.due}
                                </p>
                              </div>
                            </div>
                            <Badge variant={
                              task.status === 'completed' ? 'default' :
                              task.status === 'in-progress' ? 'secondary' : 'outline'
                            }>
                              {task.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EventView;
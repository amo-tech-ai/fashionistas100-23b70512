import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  User, Calendar, Ticket, Heart, Settings, Bell,
  Star, TrendingUp, Clock, MapPin, ChevronRight,
  ShoppingBag, Award, MessageSquare
} from 'lucide-react';

export const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  const bookingHistory = [
    { event: 'Fashion Week 2025', date: '2025-10-15', tickets: 2, status: 'confirmed', total: '$450' },
    { event: 'Designer Showcase', date: '2025-09-20', tickets: 1, status: 'completed', total: '$125' },
    { event: 'Summer Collection', date: '2025-06-01', tickets: 3, status: 'pending', total: '$275' },
  ];

  const recommendations = [
    { event: 'Avant-Garde Exhibition', match: '92%', price: '$85', date: 'Nov 12, 2025' },
    { event: 'Sustainable Fashion Summit', match: '88%', price: '$125', date: 'Nov 28, 2025' },
    { event: 'Luxury Brand Launch', match: '85%', price: '$150', date: 'Dec 5, 2025' },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gray-50 p-8">
        <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, Sarah!</h1>
              <p className="opacity-90">Member since 2023 • VIP Status</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-sm opacity-80">Total Events</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-sm opacity-80">Loyalty Points</p>
              <p className="text-2xl font-bold">2,850</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-sm opacity-80">Saved</p>
              <p className="text-2xl font-bold">$420</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold">Browse Events</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="font-semibold">Group Booking</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <p className="font-semibold">Favorites</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="font-semibold">Rewards</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-lg shadow">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="bookings" className="mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Booking History</h3>
                  <Button>
                    <Ticket className="h-4 w-4 mr-2" />
                    Book New Event
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {bookingHistory.map((booking, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <h4 className="font-semibold">{booking.event}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {booking.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Ticket className="h-3 w-3" />
                                {booking.tickets} tickets
                              </span>
                              <span className="font-medium">{booking.total}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              booking.status === 'confirmed' ? 'default' :
                              booking.status === 'completed' ? 'secondary' : 'outline'
                            }>
                              {booking.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-semibold">You've earned 250 points!</p>
                          <p className="text-sm text-gray-600">From your recent bookings</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Rewards
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-0">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Personalized for You</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((rec, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold">{rec.event}</h4>
                          <Badge className="bg-green-100 text-green-800">
                            {rec.match} match
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {rec.date}
                          </p>
                          <p className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Starting at {rec.price}
                          </p>
                        </div>
                        <Button className="w-full mt-4" size="sm">
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Why These Events?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Based on your interest in contemporary fashion</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Located in your preferred areas</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Scheduled at your convenient times</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="mt-0">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Your Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Event Interests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="px-3 py-1">Fashion Shows</Badge>
                        <Badge className="px-3 py-1">Designer Meetups</Badge>
                        <Badge className="px-3 py-1">Sustainable Fashion</Badge>
                        <Badge className="px-3 py-1">Luxury Brands</Badge>
                        <Badge variant="outline" className="px-3 py-1">+ Add More</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Notification Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Event Reminders</span>
                        <Badge className="bg-green-100 text-green-800">On</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New Recommendations</span>
                        <Badge className="bg-green-100 text-green-800">On</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Price Drops</span>
                        <Badge className="bg-gray-100 text-gray-800">Off</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Preferred Locations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">Paris, France</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">Milan, Italy</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">New York, USA</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          Add Location
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Budget Range</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Min</span>
                          <span className="font-semibold">$50</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '60%'}}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Max</span>
                          <span className="font-semibold">$500</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="groups" className="mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">My Groups</h3>
                  <Button>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Fashion Enthusiasts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Members</span>
                          <span className="font-semibold">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Next Event</span>
                          <span className="font-semibold">Oct 15</span>
                        </div>
                        <div className="flex -space-x-2">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
                          ))}
                          <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-xs">
                            +7
                          </div>
                        </div>
                        <Button variant="outline" className="w-full" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Open Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Work Team Outings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Members</span>
                          <span className="font-semibold">8</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Next Event</span>
                          <span className="font-semibold">Nov 20</span>
                        </div>
                        <div className="flex -space-x-2">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
                          ))}
                          <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-xs">
                            +4
                          </div>
                        </div>
                        <Button variant="outline" className="w-full" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Open Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-semibold">Group Booking Discount!</p>
                          <p className="text-sm text-gray-600">Save 20% when booking for 5+ people</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
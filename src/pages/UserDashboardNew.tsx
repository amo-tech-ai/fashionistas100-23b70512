import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Calendar, ShoppingBag, Heart, Award, TrendingUp,
  Clock, MapPin, Users, Star, ChevronRight, Ticket,
  CreditCard, Gift, Sparkles, Trophy, Target,
  CalendarDays, DollarSign, Percent, ShoppingCart,
  Camera, Share2, Download, Bell, Settings, Plus,
  Eye, CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');

  // Mock user data
  const userData = {
    name: 'Sarah',
    memberSince: '2023',
    vipStatus: 'Gold Member',
    loyaltyPoints: 2850,
    totalEvents: 24,
    savedAmount: 420
  };

  // Mock bookings data
  const myBookings = [
    {
      id: 1,
      event: 'Fashion Week 2025',
      date: '2025-10-15',
      time: '7:00 PM',
      venue: 'Grand Palais',
      status: 'confirmed',
      tickets: 2,
      price: 450
    },
    {
      id: 2,
      event: 'Designer Showcase',
      date: '2025-09-20',
      time: '6:00 PM',
      venue: 'Fashion District',
      status: 'completed',
      tickets: 1,
      price: 125
    },
    {
      id: 3,
      event: 'Summer Collection',
      date: '2025-08-01',
      time: '3:00 PM',
      venue: 'Rooftop Gallery',
      status: 'pending',
      tickets: 3,
      price: 275
    }
  ];

  // Mock events for user
  const forYouEvents = [
    {
      id: 1,
      name: 'Haute Couture Gala',
      date: 'Nov 12',
      price: 350,
      matchScore: 95,
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      name: 'Streetwear Festival',
      date: 'Dec 22',
      price: 85,
      matchScore: 88,
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      name: 'Vintage Fashion Fair',
      date: 'Jan 8',
      price: 65,
      matchScore: 82,
      image: '/api/placeholder/300/200'
    }
  ];

  // Mock groups
  const myGroups = [
    {
      id: 1,
      name: 'Fashion Forward NYC',
      members: 248,
      joined: true,
      events: 14
    },
    {
      id: 2,
      name: 'Sustainable Style Club',
      members: 156,
      joined: true,
      events: 8
    },
    {
      id: 3,
      name: 'Vintage Lovers',
      members: 89,
      joined: false,
      events: 5
    }
  ];

  // Mock rewards
  const rewards = {
    currentTier: 'Gold',
    nextTier: 'Platinum',
    pointsToNext: 1150,
    benefits: [
      'Priority booking access',
      '15% discount on all events',
      'VIP lounge access',
      'Free coat check'
    ]
  };

  // Mock preferences
  const preferences = [
    { icon: '👗', label: 'Runway Shows', active: true },
    { icon: '🎨', label: 'Designer Talks', active: false },
    { icon: '📸', label: 'Fashion Photography', active: true },
    { icon: '🌿', label: 'Sustainable Fashion', active: true },
    { icon: '🎵', label: 'Pop-up Shows', active: false },
    { icon: '👠', label: 'Street Style', active: true }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          
          {/* Welcome Header */}
          <div className="mb-8">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24" />
              <CardContent className="p-8 relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-4 border-white/20">
                      <AvatarImage src="/api/placeholder/100/100" />
                      <AvatarFallback className="bg-white/20 text-white text-xl font-bold">S</AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-3xl font-bold mb-1">Welcome back, {userData.name}!</h1>
                      <p className="text-white/80">Member since {userData.memberSince} • VIP Status: {userData.vipStatus}</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-sm text-white/70 mb-1">Total Events</p>
                      <p className="text-3xl font-bold">{userData.totalEvents}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-white/70 mb-1">Loyalty Points</p>
                      <p className="text-3xl font-bold">{userData.loyaltyPoints.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-white/70 mb-1">Saved</p>
                      <p className="text-3xl font-bold">${userData.savedAmount}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['Browse Events', 'Group Booking', 'Favorites', 'Rewards'].map((action, index) => {
              const icons = [Calendar, Users, Heart, Award];
              const Icon = icons[index];
              return (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap bg-white hover:bg-gray-50 border-gray-200"
                  onClick={() => alert(`${action} clicked`)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action}
                </Button>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* My Bookings Section */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-200/30">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-blue-900">
                      <Ticket className="h-5 w-5" />
                      <span className="font-semibold">My Bookings</span>
                    </span>
                    <Button size="sm" variant="ghost" onClick={() => alert('View all bookings')}>
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {myBookings.map((booking) => (
                      <div 
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer"
                        onClick={() => alert(`View booking: ${booking.event}`)}
                      >
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <CalendarDays className="h-8 w-8 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{booking.event}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {booking.date} at {booking.time} • {booking.venue}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={cn("text-xs", getStatusColor(booking.status))}>
                                {booking.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {booking.tickets} {booking.tickets === 1 ? 'ticket' : 'tickets'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">${booking.price}</p>
                          <Button size="sm" variant="ghost" className="mt-1">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      You've earned 250 points from recent bookings!
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* For You Section */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-purple-200/30">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-purple-900">
                      <Sparkles className="h-5 w-5" />
                      <span className="font-semibold">For You</span>
                    </span>
                    <span className="text-sm font-normal text-purple-600">Based on your interests</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {forYouEvents.map((event) => (
                      <div 
                        key={event.id}
                        className="group cursor-pointer"
                        onClick={() => alert(`View event: ${event.name}`)}
                      >
                        <div className="relative overflow-hidden rounded-lg mb-3">
                          <img 
                            src={event.image} 
                            alt={event.name}
                            className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                            <span className="text-xs font-semibold text-purple-600">
                              {event.matchScore}% match
                            </span>
                          </div>
                        </div>
                        <h4 className="font-semibold text-sm text-gray-900 group-hover:text-purple-600 transition-colors">
                          {event.name}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">{event.date}</p>
                        <p className="text-sm font-bold text-purple-600 mt-2">${event.price}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* My Preferences */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b border-green-200/30">
                  <CardTitle className="flex items-center gap-3 text-green-900">
                    <Settings className="h-5 w-5" />
                    <span className="font-semibold">My Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Customize your event recommendations based on your interests
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {preferences.map((pref, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-lg border-2 cursor-pointer transition-all",
                          pref.active
                            ? "bg-green-50 border-green-300 hover:border-green-400"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        )}
                        onClick={() => alert(`Toggle preference: ${pref.label}`)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{pref.icon}</span>
                          <span className="text-sm font-medium text-gray-700">
                            {pref.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full mt-4"
                    variant="outline"
                    onClick={() => alert('Edit preferences')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add More Preferences
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Secondary Content */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* My Groups */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200/30">
                  <CardTitle className="flex items-center gap-3 text-orange-900">
                    <Users className="h-5 w-5" />
                    <span className="font-semibold">My Groups</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {myGroups.map((group) => (
                      <div 
                        key={group.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => alert(`View group: ${group.name}`)}
                      >
                        <div>
                          <h4 className="font-medium text-sm text-gray-900">{group.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {group.members} members • {group.events} events
                          </p>
                        </div>
                        {group.joined ? (
                          <Badge className="bg-orange-100 text-orange-700 text-xs">
                            Joined
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline" className="text-xs">
                            Join
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full border-dashed border-2"
                      size="sm"
                      onClick={() => alert('Discover more groups')}
                    >
                      Discover More Groups
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Rewards Status */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-yellow-50 to-amber-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-amber-900">
                    <Trophy className="h-5 w-5" />
                    <span className="font-semibold">Rewards Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-3">
                      <span className="text-3xl font-bold text-white">G</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{rewards.currentTier} Member</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {rewards.pointsToNext.toLocaleString()} points to {rewards.nextTier}
                    </p>
                    <Progress value={70} className="mt-3 h-2" />
                  </div>

                  <div className="bg-white/60 rounded-lg p-4">
                    <h4 className="font-semibold text-sm text-gray-900 mb-3">Current Benefits:</h4>
                    <ul className="space-y-2">
                      {rewards.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    onClick={() => alert('View all rewards')}
                  >
                    View All Rewards
                    <Gift className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-3 text-gray-900">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-semibold">Your Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Events this month</span>
                    <span className="font-bold text-gray-900">3</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Friends attending</span>
                    <span className="font-bold text-gray-900">12</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Saved events</span>
                    <span className="font-bold text-gray-900">8</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Reviews written</span>
                    <span className="font-bold text-gray-900">5</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import { useUserDashboardData } from '@/hooks/useUserDashboard';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, ShoppingBag, Heart, Award, TrendingUp,
  Clock, MapPin, Users, Star, ChevronRight, Ticket,
  CreditCard, Gift, Sparkles, Trophy, Target,
  CalendarDays, DollarSign, Percent, ShoppingCart,
  Camera, Share2, Download, Bell, Settings, Plus,
  Eye, CheckCircle, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  
  // Get real data from Supabase
  const { tickets, upcomingEvents, favorites, stats, isLoading, user } = useUserDashboardData();

  // Calculate user tier based on activity
  const getUserTier = () => {
    const eventsAttended = stats?.eventsAttended || 0;
    if (eventsAttended >= 20) return { name: 'Platinum', color: 'bg-purple-500' };
    if (eventsAttended >= 10) return { name: 'Gold', color: 'bg-yellow-500' };
    if (eventsAttended >= 5) return { name: 'Silver', color: 'bg-gray-400' };
    return { name: 'Bronze', color: 'bg-orange-600' };
  };

  const userTier = getUserTier();
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          
          {/* Header Section */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-white shadow-xl">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Welcome back, {user.name}!
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className={cn('text-white', userTier.color)}>
                    {userTier.name} Member
                  </Badge>
                  <span className="text-gray-600">
                    Member since {stats?.memberSince || 'Recently'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="bg-white">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-white">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CalendarDays className="h-5 w-5 text-white" />
                  </div>
                  Events Attended
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">
                  {isLoading ? '...' : stats?.eventsAttended || 0}
                </div>
                <p className="text-sm text-white/80">Lifetime</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-500 to-emerald-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Ticket className="h-5 w-5 text-white" />
                  </div>
                  Active Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">
                  {isLoading ? '...' : tickets?.total || 0}
                </div>
                <p className="text-sm text-white/80">Upcoming</p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-amber-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  Amount Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">
                  ${isLoading ? '...' : (stats?.totalSpent || 0).toFixed(0)}
                </div>
                <p className="text-sm text-white/80">Last 30 days</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-pink-500 to-rose-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  Loyalty Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">
                  {(stats?.eventsAttended || 0) * 100}
                </div>
                <p className="text-sm text-white/80">Available</p>
              </CardContent>
            </Card>
          </div>
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - My Bookings */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-purple-200/30">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-purple-900">
                      <Ticket className="h-5 w-5" />
                      <span className="font-semibold">My Bookings & Tickets</span>
                    </span>
                    <Button size="sm" variant="ghost" className="hover:bg-purple-200/30">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[400px] pr-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="p-4 bg-gray-100 rounded-lg animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : (tickets?.registrations?.length || 0) + (tickets?.bookings?.length || 0) > 0 ? (
                      <div className="space-y-4">
                        {tickets?.registrations?.map((reg: any) => (
                          <div key={reg.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:from-purple-50 hover:to-purple-100/30 transition-all duration-200 cursor-pointer group border border-gray-200/50">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                                  {reg.events?.event_name || 'Event'}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  {reg.events?.start_datetime ? 
                                    format(new Date(reg.events.start_datetime), 'MMM dd, yyyy • HH:mm') : 
                                    'Date TBD'}
                                </p>
                              </div>
                              <Badge variant="outline" className={cn(
                                'border-green-200',
                                reg.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                              )}>
                                {reg.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Registration #{reg.id.slice(0, 8)}</span>
                              <Button size="sm" variant="ghost" className="hover:bg-purple-100">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                        {tickets?.bookings?.map((booking: any) => (
                          <div key={booking.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:from-purple-50 hover:to-purple-100/30 transition-all duration-200 cursor-pointer group border border-gray-200/50">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                                  {booking.events?.event_name || 'Booking'}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  Booking Code: {booking.booking_code || booking.id.slice(0, 8)}
                                </p>
                              </div>
                              <Badge variant="outline" className={cn(
                                'border-green-200',
                                booking.status === 'confirmed' ? 'bg-green-50 text-green-700' : 
                                booking.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                                'bg-gray-50 text-gray-700'
                              )}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-green-600">
                                ${booking.total_amount || 0}
                              </span>
                              <Button size="sm" variant="ghost" className="hover:bg-purple-100">
                                <Ticket className="h-4 w-4 mr-2" />
                                View Ticket
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No bookings yet</p>
                        <Button onClick={() => navigate('/events')}>Browse Events</Button>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            {/* Right Column - Recommendations */}
            <div className="space-y-6">
              {/* For You Events */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100/50 border-b border-pink-200/30">
                  <CardTitle className="flex items-center gap-3 text-pink-900">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-semibold">For You</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="animate-pulse">
                        <div className="h-32 bg-gray-200 rounded-lg mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ) : upcomingEvents?.slice(0, 3).map((event: any, index) => (
                      <div key={event.id} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg">
                          <div className="h-32 bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-white/50" />
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-white/90 text-purple-700">
                              {Math.floor(Math.random() * 30 + 70)}% Match
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3">
                          <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                            {event.event_name || event.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {event.start_datetime ? 
                              format(new Date(event.start_datetime), 'MMM dd') : 
                              'Date TBD'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {upcomingEvents && upcomingEvents.length > 0 && (
                    <Button className="w-full mt-4" variant="outline">
                      Discover More Events
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Favorite Designers */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200/30">
                  <CardTitle className="flex items-center gap-3 text-orange-900">
                    <Heart className="h-5 w-5" />
                    <span className="font-semibold">Favorite Designers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="animate-pulse space-y-2">
                        {[1, 2].map(i => (
                          <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
                        ))}
                      </div>
                    ) : favorites?.designers?.slice(0, 3).map((designer: any) => (
                      <div key={designer.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                            {designer.brand_name?.[0] || 'D'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{designer.brand_name || 'Designer'}</p>
                          <p className="text-sm text-gray-500">{designer.style_category || 'Fashion'}</p>
                        </div>
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      </div>
                    ))}
                    {(!favorites?.designers || favorites.designers.length === 0) && !isLoading && (
                      <div className="text-center py-4">
                        <Heart className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Follow your favorite designers</p>
                      </div>
                    )}
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
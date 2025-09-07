import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/DashboardLayout';
import { useVenueDashboardData } from '@/hooks/useVenueDashboard';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, DollarSign, Users, Building2, Upload,
  Plus, ChevronRight, Clock, Send, MapPin, 
  CheckCircle, XCircle, AlertCircle, Star, TrendingUp,
  Home, Image as ImageIcon, Mail, Edit, 
  Sparkles, Award, Settings, CalendarDays, CreditCard,
  Briefcase, Eye, Phone, Percent, BarChart3,
  Wifi, Car, Coffee, Monitor, Volume2, Lightbulb,
  ArrowUp, Loader2, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

const VenueDashboard = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  // Get real data from Supabase
  const { 
    venue, 
    bookings, 
    upcomingEvents,
    inquiries,
    analytics,
    isLoading 
  } = useVenueDashboardData();
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {venue?.name || 'Venue'} Dashboard
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-gray-600 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {venue?.location || 'Location'}
                  </span>
                  {venue?.verified && (
                    <Badge className="bg-blue-500 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Venue
                    </Badge>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-medium">{venue?.rating || analytics?.averageRating || 4.7}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  className="bg-white"
                  onClick={() => navigate('/admin/venue-photos')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Update Photos
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => navigate('/admin/venue-availability')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Availability
                </Button>
              </div>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  Total Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">
                  {isLoading ? '...' : analytics?.totalBookings || 12}
                </div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  +{analytics?.bookingsGrowth || 15}% this month
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-500 to-emerald-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">
                  ${isLoading ? '...' : (analytics?.revenue / 1000).toFixed(0)}K
                </div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  +{analytics?.revenueGrowth || 22}% growth
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-amber-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Percent className="h-5 w-5 text-white" />
                  </div>
                  Occupancy Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">
                  {isLoading ? '...' : analytics?.occupancyRate || 78}%
                </div>
                <p className="text-sm text-white/80">
                  This month
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-pink-500 to-rose-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">
                  {isLoading ? '...' : analytics?.inquiriesCount || 28}
                </div>
                <p className="text-sm text-white/80">
                  {inquiries?.filter(i => !i.responded).length || 5} pending
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Left Column - Bookings & Events */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Events */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-purple-200/30">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-purple-900">
                      <Calendar className="h-5 w-5" />
                      <span className="font-semibold">Upcoming Events</span>
                    </span>
                    <Button size="sm" variant="ghost" className="hover:bg-purple-200/30">
                      View Calendar
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[350px] pr-4">
                    {isLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="p-4 bg-gray-100 rounded-lg animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : upcomingEvents && upcomingEvents.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingEvents.map((event) => (
                          <div key={event.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:from-purple-50 hover:to-purple-100/30 transition-all duration-200 cursor-pointer group border border-gray-200/50">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                                  {event.event_name || event.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  {event.start_datetime ? 
                                    format(new Date(event.start_datetime), 'MMM dd, yyyy • HH:mm') : 
                                    'Date TBD'}
                                </p>
                              </div>
                              <Badge variant="outline" className={cn(
                                'border-green-200',
                                event.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                                event.status === 'upcoming' ? 'bg-blue-50 text-blue-700' :
                                'bg-yellow-50 text-yellow-700'
                              )}>
                                {event.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {event.capacity || venue?.capacity || 500} capacity
                              </span>
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                Main Hall
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No upcoming events</p>
                        <Button>Add Availability</Button>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Recent Bookings */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b border-green-200/30">
                  <CardTitle className="flex items-center gap-3 text-green-900">
                    <Briefcase className="h-5 w-5" />
                    <span className="font-semibold">Recent Bookings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="animate-pulse space-y-2">
                        {[1, 2].map(i => (
                          <div key={i} className="h-12 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    ) : bookings && bookings.length > 0 ? (
                      bookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-2 w-2 rounded-full",
                              booking.status === 'confirmed' ? 'bg-green-500' :
                              booking.status === 'pending' ? 'bg-yellow-500' :
                              'bg-gray-400'
                            )} />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {booking.eventType || 'Event Booking'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(booking.booking_date), 'MMM dd, yyyy')} • ${booking.total_amount}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {booking.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">No recent bookings</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Right Column - Inquiries & Venue Info */}
            <div className="space-y-6">
              {/* Inquiries */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200/30">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-orange-900">
                      <MessageSquare className="h-5 w-5" />
                      <span className="font-semibold">Inquiries</span>
                    </span>
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                      {inquiries?.filter(i => !i.responded).length || 0} new
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="animate-pulse space-y-2">
                        {[1, 2].map(i => (
                          <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                        ))}
                      </div>
                    ) : inquiries && inquiries.length > 0 ? (
                      inquiries.slice(0, 3).map((inquiry) => (
                        <div key={inquiry.id} className="p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg hover:from-orange-50 hover:to-orange-100/30 transition-all duration-200 cursor-pointer group">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 group-hover:text-orange-700 transition-colors text-sm">
                                {inquiry.name || 'Inquiry'}
                              </h5>
                              <p className="text-xs text-gray-600 mt-1">
                                {inquiry.message || 'Interested in booking'}
                              </p>
                            </div>
                            {!inquiry.responded && (
                              <Badge className="bg-orange-100 text-orange-700 text-xs">New</Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {format(new Date(inquiry.created_at), 'MMM dd')}
                            </span>
                            <Button size="sm" variant="ghost" className="h-7 text-xs hover:bg-orange-100">
                              Respond
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">No inquiries</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Venue Info */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100/50 border-b border-pink-200/30">
                  <CardTitle className="flex items-center gap-3 text-pink-900">
                    <Building2 className="h-5 w-5" />
                    <span className="font-semibold">Venue Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Capacity</span>
                      <span className="text-sm font-medium">{venue?.capacity || 500} guests</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Type</span>
                      <span className="text-sm font-medium">{venue?.type || 'Event Space'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Location</span>
                      <span className="text-sm font-medium">{venue?.location || 'Downtown'}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Amenities</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['Stage', 'Lighting', 'Sound', 'Parking'].map((amenity) => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VenueDashboard;
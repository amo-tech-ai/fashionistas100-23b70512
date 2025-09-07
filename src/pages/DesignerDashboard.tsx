import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/DashboardLayout';
import { useDesignerDashboardData } from '@/hooks/useDesignerDashboard';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, FileText, Calendar, MessageSquare, Upload,
  Plus, ChevronRight, Camera, Send, User, Clock,
  CheckCircle, XCircle, AlertCircle, Star, TrendingUp,
  Briefcase, Image as ImageIcon, Mail, Edit, Grid,
  Sparkles, Award, Target, DollarSign, Users,
  Palette, Scissors, Package, ArrowUp, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DesignerDashboard = () => {
  const navigate = useNavigate();
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  
  // Get real data from Supabase
  const { 
    profile, 
    revenue,
    events, 
    collections, 
    bookings,
    analytics, 
    opportunities,
    isLoading 
  } = useDesignerDashboardData();
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-white shadow-xl">
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    {profile?.brand_name?.[0] || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {profile?.brand_name || 'Designer'} Studio
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {profile?.style_category || 'Fashion Designer'} • {profile?.years_experience || 5} years experience
                  </p>
                  {profile?.verified && (
                    <Badge className="mt-2 bg-blue-500 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Designer
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  className="bg-white"
                  onClick={() => navigate('/admin/portfolio-upload')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Portfolio
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => navigate('/admin/collection-manager')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Collection
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
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  Portfolio Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">
                  {isLoading ? (
                    <div className="animate-pulse bg-white/20 rounded h-10 w-16"></div>
                  ) : (
                    `${((analytics?.portfolioViews || 1200) / 1000).toFixed(1)}K`
                  )}
                </div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  +{analytics?.viewsGrowth || 32}% this month
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-500 to-emerald-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  Upcoming Shows
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">
                  {isLoading ? (
                    <div className="animate-pulse bg-white/20 rounded h-10 w-12"></div>
                  ) : (
                    events?.upcoming || 3
                  )}
                </div>
                <p className="text-sm text-white/80">
                  Next {collections?.filter(c => c.status === 'in-progress').length || 2} weeks
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-amber-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">
                  {isLoading ? (
                    <div className="animate-pulse bg-white/20 rounded h-10 w-12"></div>
                  ) : (
                    bookings?.total || 24
                  )}
                </div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  +{analytics?.bookingsGrowth || 15}% growth
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-pink-500 to-rose-600">
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
                  {isLoading ? (
                    <div className="animate-pulse bg-white/20 rounded h-10 w-16"></div>
                  ) : (
                    revenue?.formatted || '$48K'
                  )}
                </div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  +{revenue?.growth || 22}% YTD
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Left Column - Collections & Portfolio */}
            <div className="lg:col-span-2 space-y-6">
              {/* Collections */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-purple-200/30">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-purple-900">
                      <Palette className="h-5 w-5" />
                      <span className="font-semibold">My Collections</span>
                    </span>
                    <Button size="sm" variant="ghost" className="hover:bg-purple-200/30">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoading ? (
                      [1, 2].map(i => (
                        <div key={i} className="aspect-[4/3] bg-gray-200 rounded-lg animate-pulse"></div>
                      ))
                    ) : collections?.slice(0, 4).map((collection) => (
                      <div 
                        key={collection.id}
                        className="group cursor-pointer"
                        onClick={() => setSelectedCollection(collection)}
                      >
                        <div className="aspect-[4/3] bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                          <div className="w-full h-full flex items-center justify-center">
                            <Scissors className="h-12 w-12 text-white/50" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                            {collection.name}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-600">
                              {collection.pieces} pieces
                            </p>
                            <Badge variant="outline" className={cn(
                              'text-xs',
                              collection.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                              collection.status === 'in-progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                            )}>
                              {collection.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Upcoming Shows */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b border-green-200/30">
                  <CardTitle className="flex items-center gap-3 text-green-900">
                    <Calendar className="h-5 w-5" />
                    <span className="font-semibold">Upcoming Shows & Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[300px] pr-4">
                    {isLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="p-3 bg-gray-100 rounded-lg animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : events?.length > 0 ? (
                      <div className="space-y-3">
                        {events.slice(0, 5).map((event) => (
                          <div key={event.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:from-green-50 hover:to-green-100/30 transition-all duration-200 cursor-pointer group border border-gray-200/50">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                                  {event.event_name || event.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {event.start_datetime ? 
                                    format(new Date(event.start_datetime), 'MMM dd, yyyy • HH:mm') : 
                                    'Date TBD'}
                                </p>
                              </div>
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                {event.collection}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                {event.pieces} pieces
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {event.models} models
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {event.bookings} bookings
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No upcoming shows</p>
                        <Button variant="outline" className="mt-3">
                          Apply to Events
                        </Button>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            {/* Right Column - Opportunities & Bookings */}
            <div className="space-y-6">
              {/* New Opportunities */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200/30">
                  <CardTitle className="flex items-center gap-3 text-orange-900">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-semibold">Opportunities</span>
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
                    ) : opportunities?.slice(0, 3).map((opp) => (
                      <div key={opp.id} className="p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg hover:from-orange-50 hover:to-orange-100/30 transition-all duration-200 cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 group-hover:text-orange-700 transition-colors text-sm">
                              {opp.event_name || opp.title}
                            </h5>
                            <p className="text-xs text-gray-600 mt-1">
                              Apply by: {opp.applicationDeadline}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">
                            {opp.slotsAvailable} slots • ${opp.compensation}
                          </span>
                          <Button size="sm" variant="ghost" className="h-7 text-xs hover:bg-orange-100">
                            Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                    {opportunities && opportunities.length === 0 && !isLoading && (
                      <div className="text-center py-4">
                        <Sparkles className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No new opportunities</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              {/* Recent Bookings */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100/50 border-b border-pink-200/30">
                  <CardTitle className="flex items-center gap-3 text-pink-900">
                    <Briefcase className="h-5 w-5" />
                    <span className="font-semibold">Recent Bookings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="animate-pulse space-y-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-12 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    ) : bookings?.length > 0 ? (
                      bookings.slice(0, 4).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-2 w-2 rounded-full",
                              booking.status === 'confirmed' ? 'bg-green-500' :
                              booking.status === 'pending' ? 'bg-yellow-500' :
                              'bg-gray-400'
                            )} />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {booking.type}
                              </p>
                              <p className="text-xs text-gray-500">
                                {booking.client}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className={cn(
                            'text-xs',
                            booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                            booking.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          )}>
                            {booking.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <Briefcase className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No bookings yet</p>
                      </div>
                    )}
                  </div>
                  {bookings && bookings.length > 4 && (
                    <Button variant="outline" className="w-full mt-4">
                      View All Bookings
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              {/* Performance Stats */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-200/30">
                  <CardTitle className="flex items-center gap-3 text-blue-900">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-semibold">Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Engagement Rate</span>
                        <span className="text-sm text-gray-600">
                          {((analytics?.totalLikes || 0) / (analytics?.totalViews || 1) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Booking Conversion</span>
                        <span className="text-sm text-gray-600">42%</span>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>
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

export default DesignerDashboard;
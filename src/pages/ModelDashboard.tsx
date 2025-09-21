import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/DashboardLayout';
import { useModelDashboardData } from '@/hooks/useModelDashboard';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, DollarSign, Eye, Camera, Upload,
  Plus, ChevronRight, Clock, Send, User, 
  CheckCircle, XCircle, AlertCircle, Star, TrendingUp,
  Briefcase, Image as ImageIcon, Mail, Edit, 
  Sparkles, Award, MapPin, Ruler, CreditCard,
  CalendarDays, Users, FileText, BarChart3,
  ArrowUp, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ModelDashboard = () => {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  
  // Get real data from Supabase
  const { 
    profile, 
    bookings, 
    castingCalls,
    analytics,
    isLoading 
  } = useModelDashboardData();
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
                    {profile?.name?.[0] || 'M'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {profile?.name || 'Professional Model'}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-gray-600">{profile?.agency || 'Freelance'}</span>
                    {profile?.verified && (
                      <Badge className="bg-blue-500 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-medium">{profile?.rating || 4.8}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  className="bg-white"
                  onClick={() => navigate('/admin/portfolio-upload')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Update Portfolio
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => navigate('/admin/portfolio-upload')}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photos
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
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  Total Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">
                  {isLoading ? '...' : analytics?.totalBookings || 48}
                </div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  +{analytics?.bookingsGrowth || 25}% this month
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
                  Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">
                  ${isLoading ? '...' : (analytics?.earnings / 1000).toFixed(1)}K
                </div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  +{analytics?.earningsGrowth || 18}% growth
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-amber-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  Profile Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">
                  {isLoading ? '...' : (analytics?.profileViews / 1000).toFixed(1)}K
                </div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  +{analytics?.viewsGrowth || 32}% increase
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-pink-500 to-rose-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  Jobs Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">
                  {isLoading ? '...' : analytics?.completedJobs || 42}
                </div>
                <p className="text-sm text-white/80">
                  {((analytics?.completedJobs || 42) / (analytics?.totalBookings || 48) * 100).toFixed(0)}% completion rate
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Left Column - Bookings */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-purple-200/30">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-purple-900">
                      <Calendar className="h-5 w-5" />
                      <span className="font-semibold">Upcoming Bookings</span>
                    </span>
                    <Button size="sm" variant="ghost" className="hover:bg-purple-200/30">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[400px] pr-4">
                    {isLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="p-4 bg-gray-100 rounded-lg animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : bookings && bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:from-purple-50 hover:to-purple-100/30 transition-all duration-200 cursor-pointer group border border-gray-200/50">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                                  {booking.event_name}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {booking.designer} • {booking.type}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  {booking.start_datetime ? 
                                    format(new Date(booking.start_datetime), 'MMM dd, yyyy • HH:mm') : 
                                    'Date TBD'}
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
                                ${booking.rate}/hour
                              </span>
                              <Button size="sm" variant="ghost" className="hover:bg-purple-100">
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No upcoming bookings</p>
                        <Button>Browse Castings</Button>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            {/* Right Column - Casting Calls & Profile */}
            <div className="space-y-6">
              {/* Casting Calls */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200/30">
                  <CardTitle className="flex items-center gap-3 text-orange-900">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-semibold">Casting Calls</span>
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
                    ) : castingCalls?.slice(0, 3).map((casting) => (
                      <div key={casting.id} className="p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg hover:from-orange-50 hover:to-orange-100/30 transition-all duration-200 cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 group-hover:text-orange-700 transition-colors text-sm">
                              {casting.event_name}
                            </h5>
                            <p className="text-xs text-gray-600 mt-1">
                              {casting.lookingFor} • Deadline: {casting.deadline}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">
                            {casting.compensation} • {casting.applicants} applied
                          </span>
                          <Button size="sm" variant="ghost" className="h-7 text-xs hover:bg-orange-100">
                            Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Profile Stats */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100/50 border-b border-pink-200/30">
                  <CardTitle className="flex items-center gap-3 text-pink-900">
                    <User className="h-5 w-5" />
                    <span className="font-semibold">Profile Info</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Height</span>
                      <span className="text-sm font-medium">{profile?.height || "5'10\""}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Measurements</span>
                      <span className="text-sm font-medium">{profile?.measurements || '34-26-36'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Experience</span>
                      <span className="text-sm font-medium">{profile?.experience || '3 years'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Instagram</span>
                      <span className="text-sm font-medium text-blue-600">{profile?.instagram || '@modelname'}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Profile
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

export default ModelDashboard;
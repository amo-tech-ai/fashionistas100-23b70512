import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DashboardSidebar from '@/components/DashboardSidebar';
import Footer from '@/components/Footer';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Calendar,
  Users,
  Ticket,
  Search,
  MapPin,
  Clock,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings
} from 'lucide-react';

const EventManagerDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(14);

  // Sample data for the dashboard
  const kpiData = {
    upcomingEvents: 345,
    totalBookings: 1798,
    ticketsSold: 1250
  };

  const ticketSalesData = {
    soldOut: 1251,
    booked: 834,
    available: 695,
    total: 2780
  };

  const popularEvents = [
    { category: 'Music', percentage: 40, events: 20000, color: 'bg-purple-500' },
    { category: 'Sports', percentage: 35, events: 17500, color: 'bg-pink-500' },
    { category: 'Fashion', percentage: 15, events: 12500, color: 'bg-blue-900' }
  ];

  const featuredEvent = {
    title: 'Rhythm & Beats Music Festival',
    location: 'Sunset Park, Los Angeles, CA',
    date: 'Apr 20, 2029',
    time: '12:00 PM - 11:00 PM',
    description: 'Immerse yourself in electrifying performances by top pop, rock, EDM, and hip-hop artists. Indulge in delicious...',
    category: 'Music'
  };

  const eventCards = [
    {
      id: 1,
      title: 'Champions League Screening Night',
      location: 'SkyDome Stadium, Toronto, ON',
      date: 'Apr 20, 2029',
      price: '$30',
      category: 'Sport',
      categoryColor: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Culinary Delights Festival',
      location: 'Gourmet Plaza, San Francisco, CA',
      date: 'Mar 3, 2029',
      price: '$40',
      category: 'Food & Culinary',
      categoryColor: 'bg-orange-500'
    },
    {
      id: 3,
      title: 'Artistry Unveiled: Modern Art Expo',
      location: 'Vogue Hall, Los Angeles, CA',
      date: 'Mar 10, 2029',
      price: '$110',
      category: 'Fashion',
      categoryColor: 'bg-purple-500'
    }
  ];

  const recentBookings = [
    {
      id: 'INV10011',
      date: '2029/02/15',
      time: '10:30 AM',
      name: 'Jackson Moore',
      event: 'Symphony Under the Stars',
      qty: 2,
      amount: '$100',
      status: 'Confirmed'
    },
    {
      id: 'INV10012',
      date: '2029/02/16',
      time: '03:45 PM',
      name: 'Alicia Smithson',
      event: 'Runway Revolution 2024',
      qty: 1,
      amount: '$120',
      status: 'Pending'
    },
    {
      id: 'INV10013',
      date: '2029/02/17',
      time: '01:15 PM',
      name: 'Marcus Rawless',
      event: 'Global Wellness Summit',
      qty: 3,
      amount: '$240',
      status: 'Confirmed'
    },
    {
      id: 'INV10014',
      date: '2029/02/18',
      time: '09:00 AM',
      name: 'Patrick Cooper',
      event: 'Champions League Screening Night',
      qty: 4,
      amount: '$120',
      status: 'Cancelled'
    },
    {
      id: 'INV10015',
      date: '2029/02/18',
      time: '06:30 PM',
      name: 'Gilda Ramos',
      event: 'Artistry Unveiled: Modern Art Expo',
      qty: 2,
      amount: '$50',
      status: 'Confirmed'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      user: 'Admin Stefanus Weber',
      action: 'reviewed a refund request for Invoice ID:',
      detail: 'INV1004',
      time: '06:30 PM'
    },
    {
      id: 2,
      user: 'Wella McGrath',
      action: 'updated ticket prices for the event',
      detail: 'Runway Revolution 2024',
      time: '02:00 PM'
    },
    {
      id: 3,
      user: 'Patrick Cooper',
      action: 'cancelled a booking with Invoice ID:',
      detail: 'INV1004',
      time: '11:15 AM'
    },
    {
      id: 4,
      user: 'Andrew Shaw',
      action: 'created a new event:',
      detail: 'Symphony Under the Stars',
      time: '08:30 AM'
    }
  ];

  const upcomingSchedule = [
    {
      id: 1,
      title: 'Panel Discussion',
      subtitle: 'Tech Beyond 2024',
      category: 'Technology',
      time: '10:00 AM - 12:00 PM',
      date: '3',
      day: 'Sat'
    },
    {
      id: 2,
      title: 'Live Concert',
      subtitle: 'Echo Beats Festival',
      category: 'Music',
      time: '6:00 PM - 11:00 PM',
      date: '5',
      day: 'Mon'
    },
    {
      id: 3,
      title: 'Fashion Showcase',
      subtitle: 'Spring Trends Runway Show',
      category: 'Fashion',
      time: '3:00 PM - 5:00 PM',
      date: '23',
      day: 'Fri'
    }
  ];

  const calendarDays = Array.from({ length: 31 }, (_, i) => ({
    date: i + 1,
    isToday: i + 1 === 14
  }));

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background flex w-full">
        {/* Sidebar */}
        <DashboardSidebar />
      
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            {/* Left - Dashboard Title */}
            <div>
              <h1 className="text-xl font-semibold text-foreground">Dashboard – Hello Orlando, welcome back!</h1>
            </div>

            {/* Right - Search, Notifications, Settings, Profile */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search anything"
                  className="pl-10 w-80 bg-muted/50"
                />
              </div>

              {/* Notification Bell */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-purple-600 text-white text-xs">
                  3
                </Badge>
              </Button>

              {/* Settings Icon */}
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>

              {/* Profile */}
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/api/placeholder/36/36" />
                  <AvatarFallback className="bg-purple-600 text-white">OL</AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <div className="text-sm font-medium">Orlando Laurentius</div>
                  <div className="text-xs text-muted-foreground">Admin</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                    <p className="text-3xl font-bold text-purple-600">{kpiData.upcomingEvents}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                    <p className="text-3xl font-bold text-purple-600">{kpiData.totalBookings}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tickets Sold</p>
                    <p className="text-3xl font-bold text-purple-600">{kpiData.ticketsSold}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Ticket className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Featured Event Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ticket Sales</CardTitle>
                <p className="text-sm text-muted-foreground">This Week</p>
              </CardHeader>
              <CardContent>
                <div className="relative flex items-center justify-center h-48">
                  <div className="relative">
                    <svg width="160" height="160" className="transform -rotate-90">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                      <circle 
                        cx="80" 
                        cy="80" 
                        r="70" 
                        fill="none" 
                        stroke="#8b5cf6" 
                        strokeWidth="20"
                        strokeDasharray={`${(ticketSalesData.soldOut / ticketSalesData.total) * 439.8} 439.8`}
                        strokeLinecap="round"
                      />
                      <circle 
                        cx="80" 
                        cy="80" 
                        r="70" 
                        fill="none" 
                        stroke="#1e40af" 
                        strokeWidth="20"
                        strokeDasharray={`${(ticketSalesData.booked / ticketSalesData.total) * 439.8} 439.8`}
                        strokeDashoffset={`-${(ticketSalesData.soldOut / ticketSalesData.total) * 439.8}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-xs text-muted-foreground">Total Ticket</p>
                      <p className="text-xl font-bold">{ticketSalesData.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Sold Out</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{ticketSalesData.soldOut.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">45%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-900 rounded-full"></div>
                      <span className="text-sm">Now Booked</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{ticketSalesData.booked}</p>
                      <p className="text-xs text-muted-foreground">30%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <span className="text-sm">Available</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{ticketSalesData.available}</p>
                      <p className="text-xs text-muted-foreground">25%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Events</CardTitle>
                <p className="text-sm text-muted-foreground">Popular</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {popularEvents.map((event) => (
                  <div key={event.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{event.category}</span>
                      <span className="text-sm text-muted-foreground">{event.events.toLocaleString()} Events</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={event.percentage} className="flex-1" />
                      <span className="text-sm font-medium">{event.percentage}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Featured Event */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Event</CardTitle>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg overflow-hidden">
                  <Badge className="absolute top-2 left-2 bg-white/20 text-white">
                    {featuredEvent.category}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold">{featuredEvent.title}</h3>
                  <p className="text-sm text-muted-foreground">{featuredEvent.location}</p>
                  <p className="text-sm text-muted-foreground mt-2">{featuredEvent.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {featuredEvent.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredEvent.time}
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                    View Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar and Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">March 2029</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground mb-2">
                  <div>Su</div>
                  <div>Mo</div>
                  <div>Tu</div>
                  <div>We</div>
                  <div>Th</div>
                  <div>Fr</div>
                  <div>Sa</div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day) => (
                    <button
                      key={day.date}
                      className={`h-8 w-8 rounded-md text-sm ${
                        day.isToday
                          ? 'bg-purple-600 text-white'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      {day.date}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSchedule.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="text-center">
                        <div className="text-lg font-bold">{item.date}</div>
                        <div className="text-xs text-muted-foreground">{item.day}</div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge variant="outline" className={
                          item.category === 'Music' ? 'bg-purple-100 text-purple-700' :
                          item.category === 'Technology' ? 'bg-blue-100 text-blue-700' :
                          'bg-pink-100 text-pink-700'
                        }>
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Event Cards */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">All Events</CardTitle>
                <Button variant="outline" size="sm">
                  View All Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {eventCards.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
                      <Badge className={`absolute top-2 left-2 text-white ${event.categoryColor}`}>
                        {event.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{event.title}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {event.date}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-purple-600">{event.price}</span>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Bookings */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Bookings</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search name, event, etc"
                        className="pl-10 w-60"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      This Week
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{booking.date}</div>
                            <div className="text-muted-foreground">{booking.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>{booking.name}</TableCell>
                        <TableCell>{booking.event}</TableCell>
                        <TableCell>{booking.qty}</TableCell>
                        <TableCell className="font-medium">{booking.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === 'Confirmed' ? 'default' :
                              booking.status === 'Pending' ? 'secondary' :
                              'destructive'
                            }
                            className={
                              booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        <span className="text-muted-foreground">{activity.action}</span>
                        {' '}
                        <span className="font-medium">"{activity.detail}"</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EventManagerDashboard;
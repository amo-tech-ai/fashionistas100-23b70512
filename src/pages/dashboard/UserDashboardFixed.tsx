import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, Users, TrendingUp, DollarSign, 
  BarChart3, Plus, MoreVertical, Zap,
  Ticket, Heart, CreditCard, User
} from 'lucide-react';

const UserDashboardFixed = () => {
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Demo data for User Dashboard
  const upcomingEvents = 3;
  const ticketsPurchased = 12;
  const savedEvents = 8;
  const totalSpent = '$3,450';

  const myTickets = [
    {
      id: '1',
      eventName: 'Medellín Fashion Week 2025',
      date: 'Sep 18, 2025',
      time: '7:00 PM',
      venue: 'Plaza Mayor Convention Center',
      ticketType: 'VIP',
      status: 'confirmed',
      price: '$450'
    },
    {
      id: '2',
      eventName: 'Sustainable Fashion Summit',
      date: 'Oct 5, 2025',
      time: '10:00 AM',
      venue: 'Museo de Arte Moderno',
      ticketType: 'General',
      status: 'confirmed',
      price: '$150'
    }
  ];

  const handleQuickAction = async (action: string) => {
    setQuickActionLoading(action);
    setTimeout(() => {
      setQuickActionLoading(null);
      if (action === 'browse-events') navigate('/events');
      if (action === 'view-tickets') navigate('/tickets');
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your fashion events and tickets</p>
          </div>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={() => handleQuickAction('browse-events')}
          >
            <Plus className="h-5 w-5 mr-2" />
            Browse Events
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Upcoming Events */}
          <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{upcomingEvents}</div>
              <p className="text-sm text-white/80">Next event in 3 days</p>
            </CardContent>
          </Card>

          {/* Tickets Purchased */}
          <Card className="border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                Tickets Purchased
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{ticketsPurchased}</div>
              <p className="text-sm text-white/80">This year</p>
            </CardContent>
          </Card>

          {/* Saved Events */}
          <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Saved Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{savedEvents}</div>
              <p className="text-sm text-white/80">In your wishlist</p>
            </CardContent>
          </Card>

          {/* Total Spent */}
          <Card className="border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{totalSpent}</div>
              <p className="text-sm text-white/80">Lifetime value</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* My Tickets - 2 columns */}
          <div className="xl:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-purple-600" />
                  My Tickets
                </CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myTickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 rounded-lg border hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-base">{ticket.eventName}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {ticket.date} • {ticket.time}
                          </p>
                          <p className="text-sm text-gray-500">{ticket.venue}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          {ticket.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4 text-sm">
                          <span className="font-medium">{ticket.ticketType} Ticket</span>
                          <span className="text-purple-600 font-semibold">{ticket.price}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          View Ticket
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuickAction('browse-events')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Browse Events
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuickAction('view-tickets')}
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  View All Tickets
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Saved Events
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Methods
                </Button>
              </CardContent>
            </Card>

            {/* Account Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Account Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Membership</span>
                  <Badge className="bg-purple-100 text-purple-700">VIP Member</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Loyalty Points</span>
                  <span className="font-semibold">850 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm">Jan 2024</span>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Manage Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboardFixed;

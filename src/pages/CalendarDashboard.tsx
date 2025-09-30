import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DashboardSidebar from '@/components/DashboardSidebar';
import Footer from '@/components/Footer';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Filter,
  Plus,
  X,
  MapPin,
  Clock,
  Phone,
  Mail,
  Search,
  Bell,
  Settings
} from 'lucide-react';

const CalendarDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [currentMonth] = useState('May 2029');

  // Agenda summary data
  const agendaSummary = [
    { title: 'All Schedules', count: 15, icon: '📅' },
    { title: 'Event', count: 4, icon: '🎉' },
    { title: 'Meeting', count: 5, icon: '💼' },
    { title: 'Setup and Rehearsal', count: 3, icon: '🔧' }
  ];

  // Calendar events
  const calendarEvents = [
    {
      id: 1,
      date: 1,
      title: 'Team Brainstorming for Marketing',
      time: '3:00 PM',
      type: 'Meeting',
      participants: ['MT', 'JS', '+2'],
      color: 'bg-purple-100 border-purple-300'
    },
    {
      id: 2,
      date: 5,
      title: 'Daily Debrief with V...',
      time: '8:00 PM',
      type: 'Meeting',
      participants: ['AL'],
      color: 'bg-purple-100 border-purple-300'
    },
    {
      id: 3,
      date: 5,
      title: 'Artistry Unveiled Cl...',
      time: '5:00 PM',
      type: 'Event',
      participants: ['JD'],
      color: 'bg-pink-100 border-pink-300'
    },
    {
      id: 4,
      date: 7,
      title: 'Vendor Feedback Collection',
      time: '3:00 PM',
      type: 'Meeting',
      participants: ['KR', 'LM', '+3'],
      color: 'bg-purple-100 border-purple-300'
    },
    {
      id: 5,
      date: 10,
      title: 'Final Event Report S...',
      time: '10:00 AM',
      type: 'Task Deadline',
      participants: ['PR'],
      color: 'bg-gray-100 border-gray-300'
    },
    {
      id: 6,
      date: 10,
      title: 'Post-Event Team Ap...',
      time: '12:30 PM',
      type: 'Meeting',
      participants: ['ST'],
      color: 'bg-purple-100 border-purple-300'
    },
    {
      id: 7,
      date: 17,
      title: 'Stage Setup for Symphony Under the Stars',
      time: '7:00 AM',
      type: 'Setup and Rehearsal',
      participants: ['MT', 'JS', 'KL', '+5'],
      color: 'bg-gray-100 border-gray-300'
    },
    {
      id: 8,
      date: 21,
      title: 'Symphony Under th...',
      time: '12:00 PM',
      type: 'Event',
      participants: ['AL', 'BR'],
      color: 'bg-pink-100 border-pink-300'
    },
    {
      id: 9,
      date: 21,
      title: 'Technical Rehearsal...',
      time: '5:00 PM',
      type: 'Setup and Rehearsal',
      participants: ['TM'],
      color: 'bg-gray-100 border-gray-300'
    },
    {
      id: 10,
      date: 23,
      title: 'Echo Beats Festival Main Performance',
      time: '7:00 PM',
      type: 'Event',
      participants: ['MT', 'JS', 'AL', '+2'],
      color: 'bg-pink-100 border-pink-300',
      featured: true,
      fullDetails: {
        title: 'Echo Beats Festival Main Performance',
        date: 'May 24, 2029 - 7:00 PM',
        location: 'Sunset Park, Los Angeles, CA',
        pic: {
          name: 'Michael Taylor',
          role: 'Event Coordinator',
          phone: '+1-800-555-7890',
          email: 'michael.taylor@eventmgmt.com',
          avatar: 'MT'
        },
        team: ['MT', 'JS', 'AL', 'KR', 'LM'],
        notes: [
          'This is the headline performance of the Echo Beats Festival, featuring top artists from EDM, pop, and hip-hop genres.',
          'Ensure the technical team is ready for sound and lighting checks by 5:00 PM. VIP seating arrangements must be finalized by 6:30 PM.',
          'VIP seating arrangements must be finalized by 6:30 PM.'
        ]
      }
    },
    {
      id: 11,
      date: 26,
      title: 'Sponsor and Vendor...',
      time: '2:00 PM',
      type: 'Meeting',
      participants: ['SR'],
      color: 'bg-purple-100 border-purple-300'
    },
    {
      id: 12,
      date: 26,
      title: 'Equipment Check fo...',
      time: '10:00 AM',
      type: 'Setup and Rehearsal',
      participants: ['TM'],
      color: 'bg-gray-100 border-gray-300'
    },
    {
      id: 13,
      date: 29,
      title: 'Pre-Event Committe...',
      time: '9:30 AM',
      type: 'Meeting',
      participants: ['MR'],
      color: 'bg-purple-100 border-purple-300'
    },
    {
      id: 14,
      date: 30,
      title: 'Culinary Delights Liv...',
      time: '11:30 AM',
      type: 'Event',
      participants: ['CR'],
      color: 'bg-pink-100 border-pink-300'
    }
  ];

  // Calendar grid (showing May 2029)
  const calendarDays = [
    { date: 29, isCurrentMonth: false },
    { date: 30, isCurrentMonth: false },
    ...Array.from({ length: 31 }, (_, i) => ({ date: i + 1, isCurrentMonth: true })),
    { date: 1, isCurrentMonth: false },
    { date: 2, isCurrentMonth: false }
  ];

  const getEventsForDay = (date: number) => {
    return calendarEvents.filter(event => event.date === date);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            {/* Left - Breadcrumbs and Title */}
            <div>
              <div className="text-xs text-muted-foreground mb-1">Dashboard / Calendar</div>
              <h1 className="text-xl font-semibold text-foreground">Calendar</h1>
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
          <div className="flex gap-6">
            {/* Main Calendar Area */}
            <div className="flex-1 space-y-6">
              {/* Agenda Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {agendaSummary.map((item, index) => (
                  <Card key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{item.title}</p>
                          <p className="text-2xl font-bold">{item.count}</p>
                          <p className="text-xs text-muted-foreground">Agenda</p>
                        </div>
                        <div className="h-10 w-10 bg-purple-200 rounded-full flex items-center justify-center">
                          <CalendarIcon className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Calendar View */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" className="font-semibold text-lg">
                        {currentMonth}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-gray-200 rounded"></div>
                          <span className="text-muted-foreground">Setup and Rehearsal</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-purple-200 rounded"></div>
                          <span className="text-muted-foreground">Meeting</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-pink-200 rounded"></div>
                          <span className="text-muted-foreground">Event</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-gray-300 rounded"></div>
                          <span className="text-muted-foreground">Task Deadlines</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Month
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        New Agenda
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Calendar Grid */}
                  <div className="border rounded-lg">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 border-b">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="p-3 text-center font-medium text-sm text-muted-foreground border-r last:border-r-0">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Days */}
                    <div className="grid grid-cols-7">
                      {calendarDays.map((day, index) => {
                        const events = getEventsForDay(day.date);
                        return (
                          <div
                            key={index}
                            className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${
                              !day.isCurrentMonth ? 'bg-muted/20' : ''
                            }`}
                          >
                            <div className={`text-sm font-medium mb-1 ${
                              !day.isCurrentMonth ? 'text-muted-foreground' : ''
                            }`}>
                              {day.date}
                            </div>
                            <div className="space-y-1">
                              {events.map((event) => (
                                <div
                                  key={event.id}
                                  className={`${event.color} border rounded p-1 text-xs cursor-pointer hover:shadow-md transition-shadow`}
                                  onClick={() => event.featured && setSelectedEvent(event.fullDetails)}
                                >
                                  <div className="font-medium truncate">{event.title}</div>
                                  <div className="text-muted-foreground">{event.time}</div>
                                  <div className="flex items-center gap-1 mt-1">
                                    {event.participants.map((p, i) => (
                                      <div
                                        key={i}
                                        className="w-5 h-5 bg-purple-400 rounded-full flex items-center justify-center text-[10px] text-white"
                                      >
                                        {p}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Schedule Details Panel */}
            {selectedEvent && (
              <Card className="w-80 flex-shrink-0">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Schedule Details</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedEvent(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Event Banner */}
                  <div className="relative h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/api/placeholder/320/128')] bg-cover bg-center opacity-80"></div>
                  </div>

                  {/* Event Title & Badge */}
                  <div>
                    <h3 className="font-semibold mb-2">{selectedEvent.title}</h3>
                    <Badge className="bg-pink-100 text-pink-700">Event</Badge>
                  </div>

                  {/* Date & Location */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">{selectedEvent.date}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-muted-foreground">{selectedEvent.location}</div>
                    </div>
                  </div>

                  {/* PIC Card */}
                  <Card className="bg-muted/50">
                    <CardContent className="p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">PIC</p>
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-purple-600 text-white">
                            {selectedEvent.pic.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{selectedEvent.pic.name}</div>
                          <div className="text-xs text-muted-foreground">{selectedEvent.pic.role}</div>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{selectedEvent.pic.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{selectedEvent.pic.email}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Team */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Team</p>
                    <div className="flex items-center gap-2">
                      {selectedEvent.team.map((member: string, index: number) => (
                        <Avatar key={index} className="h-8 w-8">
                          <AvatarFallback className="bg-purple-400 text-white text-xs">
                            {member}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Note</p>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {selectedEvent.notes.map((note: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-purple-600">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default CalendarDashboard;
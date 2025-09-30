import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Search,
  Bell,
  Settings,
  MapPin,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  MoreVertical,
  TrendingUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';

const revenueData = [
  { date: 'Week 1', revenue: 5000 },
  { date: 'Week 2', revenue: 12000 },
  { date: 'Week 3', revenue: 18000 },
  { date: 'Week 4', revenue: 28000 },
  { date: 'Week 5', revenue: 35000 },
  { date: 'Week 6', revenue: 42000 },
];

const packages = [
  {
    name: 'General Admission',
    price: 50,
    features: ['Standing', 'Access to Festival Grounds'],
  },
  {
    name: 'Silver Package',
    price: 70,
    features: ['Seating', 'Mid-Tier View'],
  },
  {
    name: 'Gold Package',
    price: 85,
    features: ['Seating', 'Prime View'],
  },
  {
    name: 'Platinum Package',
    price: 100,
    features: ['Seating', 'Near Stage'],
  },
  {
    name: 'Diamond Package',
    price: 120,
    features: ['Seating', 'Front-Row View'],
  },
  {
    name: 'VIP Lounge Package',
    price: 150,
    features: ['Seating', 'Exclusive Lounge'],
  },
  {
    name: 'Artist Meet-and-Greet',
    price: 180,
    features: ['Standing', 'Backstage Access'],
  },
  {
    name: 'Ultimate Fashion Experience',
    price: 250,
    features: ['Standing', 'All-Inclusive Benefits'],
  },
];

const merchandise = [
  { name: 'Fashion Show Tote Bag', price: 30 },
  { name: 'Event T-Shirt', price: 25 },
  { name: 'Designer Wristband', price: 15 },
];

const partners = [
  'Logo 1',
  'Logo 2',
  'Logo 3',
  'Logo 4',
  'Logo 5',
  'Logo 6',
  'Logo 7',
  'Logo 8',
];

export default function EventDetailDashboard() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link to="/dashboard/admin/overview" className="text-sm text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
                <span className="text-sm text-muted-foreground">/</span>
                <Link to="/dashboard/events" className="text-sm text-muted-foreground hover:text-foreground">
                  Events
                </Link>
                <span className="text-sm text-muted-foreground">/</span>
                <span className="text-sm text-muted-foreground">Event Details</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Event Details</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search event, category, etc" className="pl-10" />
              </div>

              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Orlando"
                  alt="Orlando Laurentius"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">Orlando Laurentius</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Event Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Banner */}
              <Card className="overflow-hidden">
                <div className="relative h-80">
                  <img
                    src="https://images.unsplash.com/photo-1558008258-3256797b43f3?q=80&w=2000"
                    alt="Paris Haute Couture Week"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-purple-500 text-white">Runway</Badge>
                    <Badge className="bg-green-500 text-white">Active</Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-3">Paris Haute Couture Week</h2>
                      <div className="space-y-2">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>July 2, 2029 – 7:00 PM</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>Grand Palais, Paris</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tickets Sold</p>
                      <p className="text-2xl font-bold">21,000 / 30,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Starts from</p>
                      <p className="text-2xl font-bold text-purple-600">$150</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Event */}
              <Card>
                <CardHeader>
                  <CardTitle>About Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Experience the pinnacle of haute couture at Paris Fashion Week. This exclusive
                    runway event showcases the latest collections from world-renowned designers,
                    featuring breathtaking garments, innovative textiles, and cutting-edge fashion
                    statements. Witness the artistry of fashion as top models grace the runway in
                    stunning creations that define the future of style. This is more than a fashion
                    show—it's a celebration of creativity, craftsmanship, and luxury that brings
                    together fashion enthusiasts, industry professionals, and trendsetters from
                    around the globe.
                  </p>
                </CardContent>
              </Card>

              {/* Terms & Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="ticket-purchase">
                      <AccordionTrigger>1. Ticket Purchase and Entry</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                          <li>All attendees must possess a valid ticket for entry.</li>
                          <li>
                            Tickets are non-refundable and non-transferable unless specified by the
                            event organizer.
                          </li>
                          <li>
                            Attendees must present a valid government-issued ID along with their
                            ticket at the gate.
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="security">
                      <AccordionTrigger>2. Security and Safety</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                          <li>
                            Attendees are subject to security checks, including bag inspections, upon
                            entry.
                          </li>
                          <li>
                            Prohibited items include weapons, drugs, alcohol, fireworks, and other
                            hazardous materials.
                          </li>
                          <li>
                            The event organizer reserves the right to deny entry to individuals
                            deemed a security risk.
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="code-of-conduct">
                      <AccordionTrigger>3. Code of Conduct</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                          <li>
                            Attendees are expected to behave responsibly and respectfully toward
                            others.
                          </li>
                          <li>
                            Any disruptive behavior, harassment, or illegal activity will result in
                            immediate removal from the event without refund.
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="schedule">
                      <AccordionTrigger>4. Event Schedule and Changes</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                          <li>
                            The event schedule is subject to change without prior notice.
                          </li>
                          <li>
                            The organizer is not liable for any changes to performers, schedule, or
                            event format.
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Official Merchandise */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Official Merchandise</CardTitle>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {merchandise.map((item, index) => (
                      <Card key={index} className="bg-purple-50 border-purple-200">
                        <CardContent className="p-6 text-center">
                          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center">
                            <span className="text-4xl">👜</span>
                          </div>
                          <h3 className="font-semibold mb-2">{item.name}</h3>
                          <p className="text-purple-600 font-bold">USD ${item.price}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Our Partners */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Our Partners</CardTitle>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {partners.map((partner, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center p-6 bg-gray-100 rounded-lg"
                      >
                        <span className="text-gray-400 font-semibold">{partner}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Financials & Packages */}
            <div className="space-y-6">
              {/* Financial KPIs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Tickets Sold</p>
                    <p className="text-2xl font-bold">21,000</p>
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>70% of capacity</span>
                    </div>
                  </div>

                  <div className="p-4 bg-pink-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Revenue Generated</p>
                    <p className="text-2xl font-bold">$3,150,000</p>
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+12% vs target</span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Average Ticket Price</p>
                    <p className="text-2xl font-bold">$150</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Capacity Filled</p>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-2xl font-bold">70%</p>
                      <span className="text-sm text-muted-foreground">21K / 30K</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: '70%' }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sales Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={{ fill: '#8B5CF6', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Packages */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Packages</CardTitle>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {packages.map((pkg, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{pkg.name}</h3>
                          <span className="text-lg font-bold text-purple-600">${pkg.price}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {pkg.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

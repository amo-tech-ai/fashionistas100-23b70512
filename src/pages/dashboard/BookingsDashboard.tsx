import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Calendar, 
  Ticket, 
  DollarSign,
  Download,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useBookingsData } from '@/hooks/useBookingsData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Exact colors from screenshot
const CATEGORY_COLORS = {
  'Music': '#E879F9',           // Bright Pink
  'Sport': '#3B4BC8',           // Deep Navy Blue  
  'Fashion': '#C4B5FD',         // Light Purple
  'Art & Design': '#4B5563',    // Dark Gray
  'Other': '#9CA3AF',           // Gray fallback
};

// Art & Design subcategories for detailed breakdown
const ART_DESIGN_SUBCATEGORIES = [
  { name: 'Landscape Architecture and Design', total: 4000, completed: 3415 },
  { name: 'Futuristic Art and Design', total: 2500, completed: 2246 },
  { name: 'Mixed Media Masterclass', total: 3200, completed: 2000 },
];

// Example bookings data matching screenshot
const EXAMPLE_BOOKINGS = [
  {
    invoice: 'INV10011',
    date: '2029/02/15',
    time: '10:00 AM',
    name: 'Jackson Moore',
    event: 'Symphony Under the Stars',
    category: 'Music',
    ticket: 'Diamond',
    price: 50,
    qty: 2,
    amount: 100,
    status: 'Confirmed',
    voucher: '123456-MUSIC'
  },
  {
    invoice: 'INV10012',
    date: '2029/02/16',
    time: '03:45 PM',
    name: 'Alicia Smithson',
    event: 'Runway Revolution 2024',
    category: 'Fashion',
    ticket: 'Platinum',
    price: 120,
    qty: 1,
    amount: 120,
    status: 'Pending',
    voucher: '987654-FASHION'
  },
  {
    invoice: 'INV10013',
    date: '2029/02/17',
    time: '01:15 PM',
    name: 'Natalie Johnson',
    event: 'Global Wellness Summit',
    category: 'Beauty & Wellness',
    ticket: 'CAT 1',
    price: 80,
    qty: 3,
    amount: 240,
    status: 'Confirmed',
    voucher: '564738-WELLNESS'
  },
  {
    invoice: 'INV10014',
    date: '2029/02/18',
    time: '04:10 PM',
    name: 'Patrick Cooper',
    event: 'Champions League Screening Night',
    category: 'Sport',
    ticket: 'CAT 3',
    price: 30,
    qty: 4,
    amount: 120,
    status: 'Cancelled',
    voucher: '223344-SPORT'
  },
  {
    invoice: 'INV10015',
    date: '2029/02/18',
    time: '05:30 PM',
    name: 'Gilda Ramos',
    event: 'Artistry Unveiled: Modern Art Expo',
    category: 'Art & Design',
    ticket: 'Silver',
    price: 25,
    qty: 2,
    amount: 50,
    status: 'Confirmed',
    voucher: '445566-ART'
  },
  {
    invoice: 'INV10016',
    date: '2029/02/19',
    time: '12:00 PM',
    name: 'Clara Simmons',
    event: 'Tech Future Expo',
    category: 'Technology',
    ticket: 'CAT 2',
    price: 75,
    qty: 2,
    amount: 150,
    status: 'Confirmed',
    voucher: '778899-TECH'
  },
  {
    invoice: 'INV10017',
    date: '2029/02/20',
    time: '02:30 PM',
    name: 'Daniel White',
    event: 'Culinary Delights Festival',
    category: 'Food & Culinary',
    ticket: 'Gold',
    price: 60,
    qty: 1,
    amount: 60,
    status: 'Cancelled',
    voucher: '334455-FOOD'
  },
  {
    invoice: 'INV10018',
    date: '2029/02/21',
    time: '06:00 PM',
    name: 'Natalie Johnson',
    event: 'Echo Beats Festival',
    category: 'Music',
    ticket: 'Platinum',
    price: 70,
    qty: 3,
    amount: 210,
    status: 'Pending',
    voucher: '998877-MUSIC'
  },
];

const BookingsDashboard = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const isLoading = false; // Using hardcoded data

  // Hardcoded data matching screenshot
  const metrics = { 
    totalBookings: 55000, 
    totalTickets: 45000, 
    totalEarnings: 27545000 // in cents ($275,450)
  };

  // Weekly chart data
  const weeklyData = [
    { day: 'Sun', bookings: 1200 },
    { day: 'Mon', bookings: 1100 },
    { day: 'Tue', bookings: 1396 },
    { day: 'Wed', bookings: 1150 },
    { day: 'Thu', bookings: 1580 },
    { day: 'Fri', bookings: 1650 },
    { day: 'Sat', bookings: 1550 },
  ];

  // Category breakdown data (total 44,115 bookings)
  const categoryChartData = [
    { name: 'Music', value: 14172, percentage: '25.77' },
    { name: 'Sport', value: 12476, percentage: '22.68' },
    { name: 'Fashion', value: 9806, percentage: '17.83' },
    { name: 'Art & Design', value: 7661, percentage: '13.93' },
  ];

  const totalCategoryBookings = categoryChartData.reduce((sum, cat) => sum + cat.value, 0);

  // Filter example bookings
  const filteredBookings = useMemo(() => {
    return EXAMPLE_BOOKINGS.filter(booking => {
      const matchesStatus = statusFilter === 'all' || booking.status.toLowerCase() === statusFilter;
      const matchesSearch = searchQuery === '' || 
        booking.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.invoice.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    toast.success('Exporting bookings data...');
    // TODO: Implement CSV export
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'cancelled':
        return 'bg-danger/10 text-danger border-danger/20';
      default:
        return 'bg-surface-2 text-text-muted border-border';
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Header with Search and Filters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Dashboard / Bookings</p>
              <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
            </div>
          </div>
          
          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search event, attendee, etc."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px] bg-background">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="runway">Runway</SelectItem>
                <SelectItem value="couture">Couture</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="week">
              <SelectTrigger className="w-full sm:w-[150px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards with Modern Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Total Bookings</p>
                  <p className="text-3xl font-bold text-foreground">
                    {isLoading ? '...' : metrics.totalBookings.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-400 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Total Tickets Sold</p>
                  <p className="text-3xl font-bold text-foreground">
                    {isLoading ? '...' : metrics.totalTickets.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-400 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <Ticket className="h-6 w-6 text-white" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Total Earnings</p>
                  <p className="text-3xl font-bold text-foreground">
                    {isLoading ? '...' : `$${(metrics.totalEarnings / 100).toLocaleString()}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-400 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bookings Overview Line Chart - Takes 2 columns */}
          <Card className="lg:col-span-2 border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Bookings Overview</CardTitle>
              <Select defaultValue="week">
                <SelectTrigger className="w-32 h-9 bg-muted/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[280px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={weeklyData}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E879F9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#E879F9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.2} />
                    <XAxis 
                      dataKey="day" 
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        padding: '12px',
                      }}
                      labelStyle={{ color: '#1F2937', fontWeight: 600, marginBottom: '4px' }}
                      itemStyle={{ color: '#E879F9', fontWeight: 500 }}
                      formatter={(value: any) => [`${value} Bookings`, '']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bookings" 
                      stroke="#E879F9" 
                      strokeWidth={3}
                      dot={{ fill: '#E879F9', r: 4 }}
                      activeDot={{ r: 6, fill: '#E879F9', strokeWidth: 0 }}
                      fill="url(#lineGradient)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Bookings Category - Takes 1 column */}
          <Card className="lg:col-span-1 border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Bookings Category</CardTitle>
              <Select defaultValue="week">
                <SelectTrigger className="w-28 h-9 bg-muted/50 border-border text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <div className="h-[280px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : categoryChartData.length > 0 ? (
                <div className="space-y-6">
                  {/* Donut Chart */}
                  <div className="relative mx-auto" style={{ width: '200px', height: '200px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={2}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {categoryChartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other} 
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-xs text-muted-foreground font-medium">Total Bookings</p>
                      <p className="text-2xl font-bold text-foreground">{totalCategoryBookings.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* Legend with Progress Bars */}
                  <div className="space-y-3">
                    {categoryChartData.map((category) => {
                      const percentage = parseFloat(category.percentage);
                      return (
                        <div key={category.name} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: CATEGORY_COLORS[category.name as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other }}
                              />
                              <span className="font-medium text-foreground text-xs">{category.name}</span>
                              <span className="text-muted-foreground text-xs">({category.percentage}%)</span>
                            </div>
                            <span className="font-semibold text-foreground text-xs">{category.value.toLocaleString()}</span>
                          </div>
                          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="absolute h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: CATEGORY_COLORS[category.name as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                  No category data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Art & Design Detailed Breakdown */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">Art & Design</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {ART_DESIGN_SUBCATEGORIES.reduce((sum, cat) => sum + cat.completed, 0).toLocaleString()} Bookings
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ART_DESIGN_SUBCATEGORIES.map((subcategory, index) => {
                const percentage = (subcategory.completed / subcategory.total) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{subcategory.name}</span>
                      <span className="text-muted-foreground">
                        {subcategory.completed.toLocaleString()}/{subcategory.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="pt-6">
            {/* Status Filter Tabs */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <div className="flex gap-2 flex-wrap">
                {(['all', 'confirmed', 'pending', 'cancelled'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "capitalize rounded-full transition-all",
                      statusFilter === status 
                        ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600 shadow-md" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {status}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 hover:from-indigo-600 hover:to-indigo-700 shadow-md"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 hover:from-indigo-600 hover:to-indigo-700 shadow-md"
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />
                ))}
              </div>
            ) : paginatedBookings.length > 0 ? (
              <>
                <div className="rounded-lg overflow-hidden border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
                        <TableHead className="text-xs font-semibold text-muted-foreground">Invoice</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">Date</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">Name</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">Event</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">Ticket</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground text-right">Amount</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">Status</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">E-Voucher</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedBookings.map((booking, index) => {
                        return (
                          <TableRow 
                            key={booking.invoice} 
                            className={cn(
                              "border-b border-border hover:bg-muted/50 transition-colors",
                              index % 2 === 0 ? "bg-background" : "bg-muted/10"
                            )}
                          >
                            <TableCell>
                              <div className="space-y-0.5">
                                <p className="font-mono text-xs text-muted-foreground font-medium">
                                  {booking.invoice}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {booking.name}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-0.5">
                                <p className="text-sm font-medium text-foreground">
                                  {booking.date}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {booking.time}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm font-medium text-foreground">
                                {booking.name}
                              </p>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-0.5">
                                <p className="text-sm font-medium text-foreground line-clamp-1">
                                  {booking.event}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {booking.category}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge 
                                  variant="secondary" 
                                  className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-0 font-medium text-xs"
                                >
                                  {booking.ticket}
                                </Badge>
                                <p className="text-xs text-muted-foreground">
                                  {booking.qty}x ${booking.price}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-bold text-foreground">
                              ${booking.amount}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary"
                                className={cn(
                                  'capitalize font-medium text-xs px-3 py-1 rounded-full border-0',
                                  booking.status === 'Confirmed' && 'bg-pink-50 text-pink-600',
                                  booking.status === 'Pending' && 'bg-purple-50 text-purple-600',
                                  booking.status === 'Cancelled' && 'bg-gray-100 text-gray-600'
                                )}
                              >
                                {booking.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <p className="font-mono text-xs text-muted-foreground">
                                {booking.voucher}
                              </p>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Enhanced Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-border gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{itemsPerPage}</span> out of{' '}
                    <span className="font-semibold text-foreground">{filteredBookings.length}</span>
                  </p>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-lg hover:bg-muted"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'ghost'}
                          size="icon"
                          className={cn(
                            "h-9 w-9 rounded-lg transition-all",
                            currentPage === pageNum 
                              ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600 shadow-md" 
                              : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          )}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    {totalPages > 5 && (
                      <>
                        <span className="text-muted-foreground px-2 text-sm">...</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg hover:bg-muted"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 hover:from-indigo-600 hover:to-indigo-700 shadow-md"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No bookings found</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'No bookings match your current filters. Try adjusting your search criteria.' 
                    : 'Bookings from your fashion events will appear here once customers make purchases.'}
                </p>
                {(searchQuery || statusFilter !== 'all') && (
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}
                    className="rounded-full"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BookingsDashboard;

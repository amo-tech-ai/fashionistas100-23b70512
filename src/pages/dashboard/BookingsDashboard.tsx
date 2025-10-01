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

const CATEGORY_COLORS = {
  'Music': '#E879F9',           // Bright Pink/Purple
  'Sport': '#3B4BC8',           // Navy Blue  
  'Fashion': '#C4B5FD',         // Light Purple
  'Art & Design': '#4B5563',    // Dark Gray
  'Other': '#9CA3AF',           // Gray
};

const BookingsDashboard = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data, isLoading } = useBookingsData();
  const bookings = data?.bookings || [];
  const metrics = data?.metrics || { totalBookings: 0, totalTickets: 0, totalEarnings: 0 };
  const weeklyData = data?.weeklyData || [];
  const categoryBreakdown = data?.categoryBreakdown || {};

  // Format category data for pie chart
  const categoryChartData = Object.entries(categoryBreakdown).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / metrics.totalBookings) * 100).toFixed(2),
  }));

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      const matchesSearch = searchQuery === '' || 
        booking.event?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.profile?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (booking.profile?.first_name + ' ' + booking.profile?.last_name).toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, searchQuery]);

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
      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Dashboard / Bookings</p>
            <h1 className="text-3xl font-bold">Bookings</h1>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="relative overflow-hidden border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">Total Bookings</p>
                  <p className="text-3xl font-bold">
                    {isLoading ? '...' : metrics.totalBookings.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">Total Tickets Sold</p>
                  <p className="text-3xl font-bold">
                    {isLoading ? '...' : metrics.totalTickets.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                    <Ticket className="h-6 w-6 text-white" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">Total Earnings</p>
                  <p className="text-3xl font-bold">
                    {isLoading ? '...' : `$${(metrics.totalEarnings / 100).toLocaleString()}`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bookings Overview Line Chart */}
          <Card className="lg:col-span-2 border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Bookings Overview</CardTitle>
              <Select defaultValue="week">
                <SelectTrigger className="w-32 h-9 bg-muted/50">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
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
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                      labelStyle={{ color: '#374151', fontWeight: 600 }}
                      itemStyle={{ color: '#E879F9' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bookings" 
                      stroke="#E879F9" 
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: '#E879F9' }}
                      fill="url(#lineGradient)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Bookings Category with Donut + Horizontal Bars */}
          <Card className="lg:col-span-2 border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Bookings Category</CardTitle>
              <Select defaultValue="week">
                <SelectTrigger className="w-32 h-9 bg-muted/50">
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
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : categoryChartData.length > 0 ? (
                <div className="flex flex-col lg:flex-row items-start gap-8">
                  {/* Donut Chart */}
                  <div className="relative flex-shrink-0">
                    <ResponsiveContainer width={220} height={220}>
                      <PieChart>
                        <Pie
                          data={categoryChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={3}
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
                      <p className="text-xs text-muted-foreground">Total Bookings</p>
                      <p className="text-2xl font-bold">{metrics.totalBookings.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* Horizontal Bar Chart */}
                  <div className="flex-1 w-full space-y-4">
                    {categoryChartData.map((category) => {
                      const percentage = parseFloat(category.percentage);
                      return (
                        <div key={category.name} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{category.name}</span>
                              <span className="text-muted-foreground">({category.percentage}%)</span>
                            </div>
                            <span className="font-semibold">{category.value.toLocaleString()}</span>
                          </div>
                          <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
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
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No category data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card className="border bg-card">
          <CardContent className="pt-6">
            {/* Status Filter Tabs */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <div className="flex gap-2">
                {(['all', 'confirmed', 'pending', 'cancelled'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "capitalize rounded-full",
                      statusFilter === status && "bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600"
                    )}
                  >
                    {status}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full bg-primary text-primary-foreground">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full bg-primary text-primary-foreground">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : paginatedBookings.length > 0 ? (
              <>
                <div className="rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b hover:bg-transparent">
                        <TableHead className="text-muted-foreground font-medium">Invoice</TableHead>
                        <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                        <TableHead className="text-muted-foreground font-medium">Event</TableHead>
                        <TableHead className="text-muted-foreground font-medium">Ticket</TableHead>
                        <TableHead className="text-muted-foreground font-medium">Amount</TableHead>
                        <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedBookings.map((booking) => {
                        const customerName = booking.profile?.first_name && booking.profile?.last_name
                          ? `${booking.profile.first_name} ${booking.profile.last_name}`
                          : booking.profile?.email || 'N/A';
                        
                        const ticketInfo = booking.booking_tickets?.[0];
                        const ticketName = ticketInfo?.event_ticket?.name || 'General';
                        const ticketQty = booking.booking_tickets?.reduce((sum, bt) => sum + bt.quantity, 0) || 1;

                        return (
                          <TableRow key={booking.id} className="border-b">
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">
                                  {booking.booking_reference || booking.id.slice(0, 8).toUpperCase()}
                                </p>
                                <p className="text-xs text-muted-foreground">{customerName}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">
                                  {format(new Date(booking.created_at), 'yyyy/MM/dd')}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(booking.created_at), 'hh:mm a')}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm font-medium">
                                  {booking.event?.title || 'Event'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {booking.event?.tags?.[0] || 'General'}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Badge variant="outline" className="w-fit text-xs font-medium border-purple-200 text-purple-700">
                                  {ticketName}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {ticketQty}x ${(ticketInfo?.unit_price || 0) / 100}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">
                              ${(booking.total_amount / 100).toFixed(0)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary"
                                className={cn(
                                  'capitalize font-medium',
                                  booking.status === 'confirmed' && 'bg-pink-100 text-pink-700 hover:bg-pink-100',
                                  booking.status === 'pending' && 'bg-purple-100 text-purple-700 hover:bg-purple-100',
                                  booking.status === 'cancelled' && 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                                )}
                              >
                                {booking.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{itemsPerPage}</span> out of{' '}
                    <span className="font-medium">{filteredBookings.length}</span>
                  </p>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
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
                            "h-9 w-9 rounded-full",
                            currentPage === pageNum && "bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600"
                          )}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    {totalPages > 5 && (
                      <>
                        <span className="text-muted-foreground px-2">...</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Bookings will appear here once created'}
                </p>
                {(searchQuery || statusFilter !== 'all') && (
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}
                  >
                    Clear Filters
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

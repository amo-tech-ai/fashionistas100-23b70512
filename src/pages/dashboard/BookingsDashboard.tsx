import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  TrendingUp,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useBookingsData } from '@/hooks/useBookingsData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const CATEGORY_COLORS = {
  'Music': 'hsl(271, 91%, 65%)',      // Purple
  'Sport': 'hsl(217, 91%, 60%)',      // Blue  
  'Fashion': 'hsl(271, 81%, 55%)',    // Light Purple
  'Art & Design': 'hsl(217, 81%, 50%)', // Dark Blue
  'Other': 'hsl(0, 0%, 60%)',         // Gray
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
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm text-text-muted mb-1">Dashboard / Bookings</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-text-primary">Bookings</h1>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
          <Card className="relative overflow-hidden border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-text-muted mb-1">Total Bookings</p>
                  <p className="text-4xl font-bold text-text-primary">
                    {isLoading ? '...' : metrics.totalBookings.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-action/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-action" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-text-muted mb-1">Total Tickets Sold</p>
                  <p className="text-4xl font-bold text-text-primary">
                    {isLoading ? '...' : metrics.totalTickets.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-text-muted mb-1">Total Earnings</p>
                  <p className="text-4xl font-bold text-text-primary">
                    {isLoading ? '...' : `$${(metrics.totalEarnings / 100).toLocaleString()}`}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bookings Overview Line Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Bookings Overview</CardTitle>
              <Select defaultValue="week">
                <SelectTrigger className="w-32 h-9">
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-action"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--text-muted))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--text-muted))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--surface-1))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bookings" 
                      stroke="hsl(var(--action))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--action))', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Bookings Category Pie Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Bookings Category</CardTitle>
              <Select defaultValue="week">
                <SelectTrigger className="w-32 h-9">
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-action"></div>
                </div>
              ) : categoryChartData.length > 0 ? (
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width="40%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
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
                  
                  <div className="flex-1 space-y-3">
                    {categoryChartData.map((category) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-3 w-3 rounded-full" 
                            style={{ backgroundColor: CATEGORY_COLORS[category.name as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other }}
                          />
                          <span className="text-sm font-medium text-text-primary">{category.name}</span>
                          <span className="text-xs text-text-muted">({category.percentage}%)</span>
                        </div>
                        <span className="text-sm font-semibold text-text-primary">
                          {category.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-text-muted">
                  No category data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            {/* Status Filter Tabs */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
              <div className="flex gap-2">
                {(['all', 'confirmed', 'pending', 'cancelled'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'action' : 'ghost'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="secondary" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-16 bg-surface-2 rounded animate-pulse" />
                ))}
              </div>
            ) : paginatedBookings.length > 0 ? (
              <>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-surface-2 hover:bg-surface-2">
                        <TableHead className="font-semibold">Invoice</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Event</TableHead>
                        <TableHead className="font-semibold">Ticket</TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
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
                          <TableRow key={booking.id} className="hover:bg-surface-2">
                            <TableCell>
                              <div>
                                <p className="font-medium text-text-primary">
                                  {booking.booking_reference || booking.id.slice(0, 8).toUpperCase()}
                                </p>
                                <p className="text-xs text-text-muted">{customerName}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm text-text-primary">
                                  {format(new Date(booking.created_at), 'yyyy/MM/dd')}
                                </p>
                                <p className="text-xs text-text-muted">
                                  {format(new Date(booking.created_at), 'hh:mm a')}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm font-medium text-text-primary">
                                  {booking.event?.title || 'Event'}
                                </p>
                                <p className="text-xs text-text-muted">
                                  {booking.event?.tags?.[0] || 'General'}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {ticketName}
                                </Badge>
                                <span className="text-xs text-text-muted">
                                  {ticketQty}x ${(ticketInfo?.unit_price || 0) / 100}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-text-primary">
                              ${(booking.total_amount / 100).toFixed(0)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={cn('capitalize', getStatusColor(booking.status))}
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
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-text-muted">
                    Showing <span className="font-medium">{itemsPerPage}</span> out of{' '}
                    <span className="font-medium">{filteredBookings.length}</span>
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
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
                          variant={currentPage === pageNum ? 'action' : 'ghost'}
                          size="icon"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    {totalPages > 5 && (
                      <>
                        <span className="text-text-muted">...</span>
                        <Button
                          variant="ghost"
                          size="icon"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="secondary"
                      size="icon"
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
                <Calendar className="h-16 w-16 text-text-muted mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">No bookings found</h3>
                <p className="text-text-muted mb-4">
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

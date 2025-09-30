import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Bell, Settings, MoreVertical, TrendingUp, TrendingDown } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const cashflowData = [
  { month: 'Jan', income: 8000, expense: 4500 },
  { month: 'Feb', income: 7500, expense: 5200 },
  { month: 'Mar', income: 6800, expense: 4800 },
  { month: 'Apr', income: 9200, expense: 5500 },
  { month: 'May', income: 8500, expense: 5100 },
  { month: 'Jun', income: 9000, expense: 4900 },
  { month: 'Jul', income: 8300, expense: 5300 },
  { month: 'Aug', income: 7800, expense: 4700 },
  { month: 'Sep', income: 9500, expense: 5400 },
  { month: 'Oct', income: 10200, expense: 5800 },
];

const salesRevenueData = [
  { name: 'Music', value: 45000, percentage: 30, color: '#8B5CF6' },
  { name: 'Fashion', value: 30000, percentage: 20, color: '#EC4899' },
  { name: 'Sports', value: 24000, percentage: 16, color: '#3B82F6' },
  { name: 'Art & Design', value: 21000, percentage: 14, color: '#6366F1' },
  { name: 'Health & Wellness', value: 15000, percentage: 10, color: '#D946EF' },
  { name: 'Technology', value: 15000, percentage: 10, color: '#A855F7' },
];

const expenseBreakdownData = [
  { name: 'Marketing', value: 13846.15, percentage: 30.77, color: '#EC4899' },
  { name: 'Venue', value: 12115.38, percentage: 26.92, color: '#3B82F6' },
  { name: 'Staffing', value: 8653.85, percentage: 19.23, color: '#6366F1' },
  { name: 'Equipment', value: 5192.31, percentage: 11.54, color: '#8B5CF6' },
  { name: 'Miscellaneous', value: 3461.54, percentage: 7.69, color: '#A855F7' },
  { name: 'Utilities', value: 1730.77, percentage: 3.85, color: '#D946EF' },
];

const transactions = [
  {
    date: '2029/05/01',
    time: '10:00 AM',
    event: 'Sunset Park Booking',
    category: 'Vendor',
    amount: -7000,
    note: 'Echo Beats Festival venue payment',
    status: 'Completed',
  },
  {
    date: '2029/05/02',
    time: '2:00 PM',
    event: 'Ticket Sales',
    category: 'Event',
    amount: 15000,
    note: 'Echo Beats Festival ticket sales',
    status: 'Completed',
  },
  {
    date: '2029/05/03',
    time: '9:30 AM',
    event: 'Echo Beats Festival Promotion',
    category: 'Marketing',
    amount: -8000,
    note: 'Social media promotions',
    status: 'Pending',
  },
  {
    date: '2029/05/04',
    time: '3:00 PM',
    event: 'Harmony Audio Deposit',
    category: 'Sponsorship',
    amount: 10000,
    note: '-',
    status: 'Completed',
  },
  {
    date: '2029/05/05',
    time: '11:00 AM',
    event: 'Sound & Lighting Rental',
    category: 'Equipment',
    amount: -3000,
    note: '-',
    status: 'Pending',
  },
  {
    date: '2029/05/06',
    time: '12:00 PM',
    event: 'Merchandise Sales',
    category: 'Event',
    amount: 2500,
    note: 'Echo Beats Festival merch',
    status: 'Completed',
  },
  {
    date: '2029/05/07',
    time: '9:00 AM',
    event: 'Catering Services Payment',
    category: 'Vendor',
    amount: -5500,
    note: '-',
    status: 'Completed',
  },
  {
    date: '2029/05/08',
    time: '4:30 PM',
    event: 'Volunteer Stipends',
    category: 'Staffing',
    amount: -2000,
    note: '-',
    status: 'Pending',
  },
];

export default function FinancialsDashboard() {
  const [timeRange, setTimeRange] = useState('this-month');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Dashboard / Financials</p>
              <h1 className="text-2xl font-bold text-foreground">Financials</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search event, category, etc"
                  className="pl-10"
                />
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
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <div className="w-5 h-5 bg-purple-500 rounded" />
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Balance</p>
                <p className="text-3xl font-bold mb-2">$75,000</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+3.85%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                  <div className="w-5 h-5 bg-pink-500 rounded-full" />
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Income</p>
                <p className="text-3xl font-bold mb-2">$150,000</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+2.08%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <div className="w-5 h-5 bg-purple-500 rounded-lg" />
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Expenses</p>
                <p className="text-3xl font-bold mb-2">$45,000</p>
                <div className="flex items-center text-sm text-red-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span>-0.84%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Transactions</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search event, category, etc"
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button size="icon" className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                        <Search className="h-4 w-4" />
                      </Button>
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="this-month">This Month</SelectItem>
                          <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                          <SelectItem value="last-10-months">Last 10 Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentTransactions.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{transaction.date}</p>
                              <p className="text-xs text-muted-foreground">{transaction.time}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{transaction.event}</p>
                              <p className="text-xs text-muted-foreground">{transaction.category}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={transaction.amount > 0 ? 'text-green-600 font-semibold' : 'text-gray-900 font-semibold'}>
                              {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {transaction.note}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={transaction.status === 'Completed' ? 'default' : 'secondary'}
                              className={
                                transaction.status === 'Completed'
                                  ? 'bg-pink-100 text-pink-700 hover:bg-pink-100'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {itemsPerPage} out of {transactions.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        ←
                      </Button>
                      {[...Array(totalPages)].map((_, i) => (
                        <Button
                          key={i}
                          variant={currentPage === i + 1 ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => setCurrentPage(i + 1)}
                          className={
                            currentPage === i + 1
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                              : ''
                          }
                        >
                          {i + 1}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cashflow Chart */}
            <div>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Cashflow</CardTitle>
                    <Select defaultValue="last-10-months">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-10-months">Last 10 Months</SelectItem>
                        <SelectItem value="this-year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">May 2029</p>
                    <p className="text-xl font-bold">Income: $6,815</p>
                    <p className="text-xl font-bold text-red-600">Expense: -$5,120</p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cashflowData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="income" fill="#EC4899" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="expense" fill="#E5E7EB" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Revenue and Expense Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Sales Revenue */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Sales Revenue</CardTitle>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <div className="relative">
                    <ResponsiveContainer width={200} height={200}>
                      <PieChart>
                        <Pie
                          data={salesRevenueData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {salesRevenueData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <p className="text-xs text-muted-foreground">Total All Revenue</p>
                      <p className="text-xl font-bold">$150,000</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    {salesRevenueData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">${item.value.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expense Breakdown */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Expense Breakdown</CardTitle>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <div className="relative">
                    <ResponsiveContainer width={200} height={200}>
                      <PieChart>
                        <Pie
                          data={expenseBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {expenseBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <p className="text-xs text-muted-foreground">Total All Expenses</p>
                      <p className="text-xl font-bold">$45,000</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    {expenseBreakdownData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">${item.value.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">({item.percentage.toFixed(2)}%)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

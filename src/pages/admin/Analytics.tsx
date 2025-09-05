import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Ticket, Calendar, Eye, ShoppingBag, Clock } from 'lucide-react';

export default function Analytics() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$245,890",
      change: "+12.5%",
      icon: DollarSign,
      description: "vs last month"
    },
    {
      title: "Tickets Sold",
      value: "1,847",
      change: "+23.1%",
      icon: Ticket,
      description: "This month"
    },
    {
      title: "Active Events",
      value: "24",
      change: "+4",
      icon: Calendar,
      description: "Currently live"
    },
    {
      title: "Page Views",
      value: "89.2K",
      change: "+18.3%",
      icon: Eye,
      description: "Last 30 days"
    }
  ];

  const topEvents = [
    { name: "Fashion Week Milano", revenue: "$45,230", tickets: 342 },
    { name: "Designer Showcase Paris", revenue: "$38,500", tickets: 285 },
    { name: "Emerging Designers NYC", revenue: "$31,200", tickets: 256 },
    { name: "Haute Couture Gala", revenue: "$28,400", tickets: 189 },
    { name: "Sustainable Fashion Summit", revenue: "$24,100", tickets: 201 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Analytics Dashboard</h1>
          
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                      {stat.change}
                    </span>{' '}
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Charts Row */}
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/20 rounded flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2">Revenue Chart</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ticket Sales by Type</CardTitle>
                <CardDescription>Distribution of ticket types sold</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">General</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="h-2 bg-muted rounded">
                      <div className="h-2 bg-black rounded" style={{width: '45%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">VIP</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="h-2 bg-muted rounded">
                      <div className="h-2 bg-gray-600 rounded" style={{width: '35%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Sponsor</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <div className="h-2 bg-muted rounded">
                      <div className="h-2 bg-gray-400 rounded" style={{width: '20%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Top Events Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Events</CardTitle>
              <CardDescription>Events with highest revenue this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Event Name</th>
                      <th className="text-right p-2">Revenue</th>
                      <th className="text-right p-2">Tickets Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topEvents.map((event, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{event.name}</td>
                        <td className="text-right p-2 font-medium">{event.revenue}</td>
                        <td className="text-right p-2">{event.tickets}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
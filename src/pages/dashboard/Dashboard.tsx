import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Users, 
  Calendar, 
  Palette, 
  MessageSquare, 
  BarChart3, 
  Shield,
  Activity,
  TrendingUp
} from 'lucide-react';
import { useAdmin, AdminStats } from '@/hooks/useAdmin';
import EventManagerSimple from '@/components/admin/EventManagerSimple';
import DesignerManagerSimple from '@/components/admin/DesignerManagerSimple';
import ContactManagerSimple from '@/components/admin/ContactManagerSimple';

const Dashboard = () => {
  const { isAdmin, loading } = useAdmin();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAdmin) return;
      
      setLoadingStats(true);
      try {
        // We'll implement this in the useAdmin hook
        // const adminStats = await getAdminStats();
        // setStats(adminStats);
        
        // For now, use mock data
        setStats({
          totalEvents: 25,
          totalDesigners: 48,
          totalContacts: 156,
          totalUsers: 2847,
          totalRevenue: 125000,
          totalBookings: 89
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access the admin dashboard.
            </p>
            <Button onClick={() => window.location.href = '/'} variant="outline">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-playfair font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your Fashionistas platform</p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Administrator
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="designers" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Designers
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Events Card */}
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    Total Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white mb-1">{stats?.totalEvents || 25}</div>
                  <p className="text-sm text-white/80 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              {/* Designers Card */}
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-500 to-emerald-600">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Palette className="h-5 w-5 text-white" />
                    </div>
                    Designers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white mb-1">{stats?.totalDesigners || 48}</div>
                  <p className="text-sm text-white/80 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              {/* Contact Submissions Card */}
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    Contact Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white mb-1">{stats?.totalContacts || 156}</div>
                  <p className="text-sm text-white/80 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    +24% from last month
                  </p>
                </CardContent>
              </Card>

              {/* Total Users Card */}
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-amber-600">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white mb-1">{stats?.totalUsers || 2847}</div>
                  <p className="text-sm text-white/80 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    +15% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Created new event', target: 'Fashion Week 2025', time: '2 minutes ago' },
                    { action: 'Approved designer', target: 'Maria Rodriguez', time: '1 hour ago' },
                    { action: 'Updated event', target: 'Sustainable Fashion Summit', time: '3 hours ago' },
                    { action: 'Responded to contact', target: 'John Smith inquiry', time: '5 hours ago' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.target}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <EventManagerSimple />
          </TabsContent>

          <TabsContent value="designers">
            <DesignerManagerSimple />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactManagerSimple />
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
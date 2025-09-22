import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, Calendar, Users, TrendingUp, DollarSign, Ticket, Heart, Palette, Building2 } from 'lucide-react';

// Import individual dashboard components
import OrganizerDashboardDemo from './OrganizerDashboardDemo';
import UserDashboard from './UserDashboard';
import DesignerDashboard from './DesignerDashboard';
import VenueDashboard from './VenueDashboard';
import SponsorDashboardNew from './SponsorDashboardNew';

const MainDashboard = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    if (isLoaded && !isSignedIn) {
      navigate('/sign-in');
      return;
    }

    if (user) {
      // Get user role from metadata or default to 'user'
      const role = user.publicMetadata?.role || 
                   user.unsafeMetadata?.role || 
                   'user';
      setUserRole(role as string);
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  // Show loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // If not signed in (shouldn't happen due to redirect, but just in case)
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-destructive" />
                <CardTitle>Access Denied</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You need to be signed in to access the dashboard.
              </p>
              <Button onClick={() => navigate('/sign-in')} className="w-full">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render dashboard based on user role
  const renderDashboard = () => {
    switch (userRole) {
      case 'organizer':
      case 'event_organizer':
        return <OrganizerDashboardDemo />;
      
      case 'designer':
        return <DesignerDashboard />;
      
      case 'venue':
      case 'venue_owner':
        return <VenueDashboard />;
      
      case 'sponsor':
        return <SponsorDashboardNew />;
      
      case 'model':
        return <UserDashboard />;
      
      case 'admin':
        return <AdminDashboard />;
      
      case 'user':
      case 'customer':
      case 'fashion_enthusiast':
      default:
        return <UserDashboard />;
    }
  };

  // If we have a specific dashboard component for the role, render it
  const DashboardComponent = renderDashboard();
  if (DashboardComponent) {
    return DashboardComponent;
  }

  // Fallback to a generic dashboard if no specific component
  return <GenericDashboard userRole={userRole} user={user} />;
};

// Generic Dashboard Component for fallback
const GenericDashboard = ({ userRole, user }: { userRole: string; user: any }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 mt-16 lg:mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-foreground mb-2">
            Welcome back, {user?.firstName || user?.username || 'User'}!
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {userRole.replace(/_/g, ' ')}
            </Badge>
            <span className="text-muted-foreground">
              • Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No events scheduled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No tickets purchased</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Following</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Designers & Events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activity</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">New</div>
              <p className="text-xs text-muted-foreground">Member</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => navigate('/events')}
                variant="outline"
                className="justify-start"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Browse Events
              </Button>
              <Button 
                onClick={() => navigate('/designers')}
                variant="outline"
                className="justify-start"
              >
                <Palette className="mr-2 h-4 w-4" />
                Discover Designers
              </Button>
              <Button 
                onClick={() => navigate('/tickets')}
                variant="outline"
                className="justify-start"
              >
                <Ticket className="mr-2 h-4 w-4" />
                My Tickets
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 mt-16 lg:mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <Badge variant="destructive">Administrator Access</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+10% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">Across all venues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45.2K</div>
              <p className="text-xs text-muted-foreground">+20% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+23%</div>
              <p className="text-xs text-muted-foreground">Overall platform growth</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={() => navigate('/admin/analytics')} variant="outline" className="w-full justify-start">
                View Analytics
              </Button>
              <Button onClick={() => navigate('/admin/users')} variant="outline" className="w-full justify-start">
                Manage Users
              </Button>
              <Button onClick={() => navigate('/admin/events')} variant="outline" className="w-full justify-start">
                Manage Events
              </Button>
              <Button onClick={() => navigate('/admin/settings')} variant="outline" className="w-full justify-start">
                System Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>New user registration</span>
                  <span className="text-muted-foreground">2 min ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Event created</span>
                  <span className="text-muted-foreground">15 min ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ticket purchased</span>
                  <span className="text-muted-foreground">1 hour ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Designer verified</span>
                  <span className="text-muted-foreground">3 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;

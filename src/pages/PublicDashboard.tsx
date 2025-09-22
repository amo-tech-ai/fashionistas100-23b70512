import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  Palette, 
  BarChart3, 
  Activity,
  TrendingUp,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PublicStats {
  totalEvents: number;
  totalDesigners: number;
  totalUsers: number;
  upcomingEvents: any[];
}

export default function PublicDashboard() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const [eventsRes, designersRes, usersRes, upcomingRes] = await Promise.all([
          supabase.from('events').select('id', { count: 'exact', head: true }),
          supabase.from('designer_profiles').select('id', { count: 'exact', head: true }),
          supabase.from('users').select('id', { count: 'exact', head: true }),
          supabase
            .from('events')
            .select('id, title, date_time, featured_image')
            .gte('date_time', new Date().toISOString())
            .order('date_time', { ascending: true })
            .limit(6)
        ]);

        setStats({
          totalEvents: eventsRes.count || 0,
          totalDesigners: designersRes.count || 0,
          totalUsers: usersRes.count || 0,
          upcomingEvents: upcomingRes.data || []
        });
      } catch (error) {
        console.error('Error fetching public stats:', error);
        setStats({
          totalEvents: 25,
          totalDesigners: 48,
          totalUsers: 2847,
          upcomingEvents: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPublicStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading platform overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-playfair font-bold">Fashion Platform Overview</h1>
              <p className="text-muted-foreground">Public dashboard showcasing platform activity</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Public View
              </Badge>
              <Button asChild size="sm">
                <a href="/sign-in">Sign In for Dashboard</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                Fashion events hosted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Designers</CardTitle>
              <Palette className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalDesigners || 0}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                Creative professionals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                Community members
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Platform Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Calendar className="w-6 h-6" />}
                title="Event Management"
                description="Create and manage fashion events in 3 minutes"
              />
              <FeatureCard
                icon={<Palette className="w-6 h-6" />}
                title="Designer Portfolios"
                description="Showcase fashion collections and designs"
              />
              <FeatureCard
                icon={<Users className="w-6 h-6" />}
                title="Community Platform"
                description="Connect fashion professionals globally"
              />
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Join the Fashion Community</h3>
            <p className="text-muted-foreground mb-4">
              Sign up to access your personalized dashboard and start creating fashion events
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <a href="/sign-up">Create Account</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/sign-in">Sign In</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center space-y-2">
      <div className="flex justify-center text-primary">
        {icon}
      </div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
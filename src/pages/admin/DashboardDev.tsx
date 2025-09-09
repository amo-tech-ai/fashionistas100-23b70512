import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Shield,
  Activity,
  TrendingUp,
  Menu,
  X,
  Home,
  PlusCircle,
  FileText,
  UserCheck,
  Building2,
  DollarSign,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const DashboardDev = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useUser();
  
  // Mock data for development
  const stats = {
    totalEvents: 25,
    totalDesigners: 48,
    totalContacts: 156,
    totalUsers: 2847,
  };

  const recentActivity = [
    { id: 1, action: 'Created new event', details: 'Fashion Week 2025', time: '2 minutes ago', icon: Calendar, status: 'success' },
    { id: 2, action: 'Approved designer', details: 'Maria Rodriguez', time: '1 hour ago', icon: UserCheck, status: 'success' },
    { id: 3, action: 'Updated event', details: 'Sustainable Fashion Summit', time: '3 hours ago', icon: Calendar, status: 'info' },
    { id: 4, action: 'Responded to contact', details: 'John Smith inquiry', time: '5 hours ago', icon: MessageSquare, status: 'success' },
  ];

  const sidebarItems = [
    { icon: Home, label: 'Home', href: '/', badge: null },
    { icon: PlusCircle, label: 'Create Event', href: '/admin/create-event', badge: null },
    { icon: FileText, label: 'Create Event Brief', href: '/admin/event-brief', badge: null },
    { icon: BarChart3, label: 'Overview', href: '/admin/dashboard-dev', badge: null, active: true },
    { icon: Calendar, label: 'Events', href: '/events', badge: null },
    { icon: Users, label: 'Users', href: '/admin/users', badge: null },
    { icon: UserCheck, label: 'Designers', href: '/designers', badge: 'NEW' },
    { icon: Building2, label: 'Sponsors', href: '/sponsors', badge: null },
    { icon: MessageSquare, label: 'Contacts', href: '/admin/contacts', badge: null },
    { icon: Activity, label: 'Analytics', href: '/admin/analytics', badge: null },
    { icon: Settings, label: 'Settings', href: '/admin/settings', badge: null },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/fashionistas-logo-f1.jpg" 
              alt="Fashionistas" 
              className="h-10 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">F</div>';
              }}
            />
            {isSidebarOpen && <span className="font-bold text-xl">Fashionistas</span>}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-4">
            <p className={`text-xs font-semibold text-gray-400 uppercase tracking-wider ${!isSidebarOpen && 'hidden'}`}>
              Admin Tools
            </p>
          </div>
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                item.active 
                  ? 'bg-purple-50 text-purple-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Toggle */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full justify-center"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Manage your Fashionistas platform</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Development Mode
              </Badge>
              <Avatar>
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  {user?.firstName?.[0] || 'A'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
                <Calendar className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.totalEvents}</div>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Designers</CardTitle>
                <Users className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.totalDesigners}</div>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Contact Submissions</CardTitle>
                <MessageSquare className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.totalContacts}</div>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +24% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                <Users className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +15% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const StatusIcon = getStatusIcon(activity.status);
                  return (
                    <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.details}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default DashboardDev;

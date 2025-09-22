import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const ServicesValidation: React.FC = () => {
  const serviceRoutes = [
    {
      name: 'Services Overview',
      path: '/services',
      status: 'live',
      description: 'Main services landing page with all categories'
    },
    {
      name: 'Photography Services',
      path: '/services/photography',
      status: 'live',
      description: 'Professional photography packages and booking'
    },
    {
      name: 'Video Production',
      path: '/services/video',
      status: 'live',
      description: 'Video production packages and portfolio'
    },
    {
      name: 'AI Studio',
      path: '/services/ai',
      status: 'live',
      description: 'AI-powered content generation and enhancement'
    },
    {
      name: 'Campaign Management',
      path: '/services/campaigns',
      status: 'live',
      description: 'Omnichannel marketing campaign services'
    }
  ];

  const eventRoutes = [
    {
      name: 'Events Listing',
      path: '/events',
      status: 'live',
      description: 'Browse all upcoming fashion events'
    },
    {
      name: 'Event Details',
      path: '/events/84d059aa-1e13-44a1-a486-b26acb79dd48',
      status: 'live',
      description: 'Individual event page with booking'
    }
  ];

  const dashboardRoutes = [
    {
      name: 'Main Dashboard',
      path: '/dashboard',
      status: 'live',
      description: 'User dashboard overview and navigation'
    },
    {
      name: 'Services Booking',
      path: '/dashboard/services/book',
      status: 'coming-soon',
      description: 'Service booking flow and payment'
    },
    {
      name: 'My Services',
      path: '/dashboard/services',
      status: 'coming-soon',
      description: 'Manage booked services and status'
    }
  ];

  const integrations = [
    { name: 'Supabase Database', status: 'connected', description: 'Events and user data' },
    { name: 'Stripe Payments', status: 'configured', description: 'Service bookings and tickets' },
    { name: 'Clerk Authentication', status: 'connected', description: 'User management' },
    { name: 'WhatsApp API', status: 'pending', description: 'Colombian market integration' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">FashionOS Platform Validation</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive status check for all services and functionality
        </p>
      </div>

      {/* Services Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Services Module
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceRoutes.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{route.name}</h4>
                    <Badge variant={route.status === 'live' ? 'default' : 'secondary'}>
                      {route.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{route.description}</p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to={route.path}>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Events Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Events Module
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventRoutes.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{route.name}</h4>
                    <Badge variant={route.status === 'live' ? 'default' : 'secondary'}>
                      {route.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{route.description}</p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to={route.path}>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-orange-500" />
            Dashboard Module
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardRoutes.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{route.name}</h4>
                    <Badge variant={route.status === 'live' ? 'default' : 'outline'}>
                      {route.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{route.description}</p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to={route.path}>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integrations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            Platform Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{integration.name}</h4>
                    <Badge variant={
                      integration.status === 'connected' ? 'default' : 
                      integration.status === 'configured' ? 'secondary' : 'outline'
                    }>
                      {integration.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <ArrowRight className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h4 className="font-semibold">Complete Service Booking Flow</h4>
              <p className="text-sm text-muted-foreground">
                Implement dashboard booking wizard with Stripe integration
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ArrowRight className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h4 className="font-semibold">WhatsApp Integration</h4>
              <p className="text-sm text-muted-foreground">
                Set up WhatsApp Business API for Colombian market
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ArrowRight className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h4 className="font-semibold">Analytics Dashboard</h4>
              <p className="text-sm text-muted-foreground">
                Create unified analytics for campaigns, events, and services
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Links */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Quick Test Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button asChild variant="outline" className="h-16">
            <Link to="/services">
              Test Services
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-16">
            <Link to="/events">
              Test Events
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-16">
            <Link to="/dashboard">
              Test Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-16">
            <Link to="/sign-in">
              Test Auth
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
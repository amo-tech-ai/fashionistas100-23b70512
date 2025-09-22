import { useUser, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { StandardCard, StandardCardHeader, StandardCardContent } from '@/components/ui/StandardCard'
import { DashboardCardSkeleton } from '@/components/ui/DashboardSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import DashboardLayout from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Palette, Building2, Settings, Ticket, Heart, TrendingUp, ShoppingBag, DollarSign, Eye, Package, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

function CustomerDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      {/* KPI Cards */}
      <div className="col-span-12 xl:col-span-8">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-6">
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Upcoming Events"
                action={<Calendar className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Next event in 2 days</p>
              </StandardCardContent>
            </StandardCard>
          </div>
          
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Tickets Purchased"
                action={<Ticket className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </StandardCardContent>
            </StandardCard>
          </div>

          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Favorite Designers"
                action={<Heart className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Following designers</p>
              </StandardCardContent>
            </StandardCard>
          </div>

          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Saved Events"
                action={<Package className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">In your wishlist</p>
              </StandardCardContent>
            </StandardCard>
          </div>
        </div>

        {/* Quick Actions */}
        <StandardCard>
          <StandardCardHeader title="Quick Actions" />
          <StandardCardContent className="flex flex-wrap gap-3">
            <Link to="/events">
              <Button variant="outline">Browse Events</Button>
            </Link>
            <Link to="/tickets">
              <Button variant="outline">My Tickets</Button>
            </Link>
            <Link to="/designers">
              <Button variant="outline">Discover Designers</Button>
            </Link>
          </StandardCardContent>
        </StandardCard>
      </div>

      {/* Sidebar */}
      <div className="col-span-12 xl:col-span-4">
        <StandardCard>
          <StandardCardHeader 
            title="Recent Activity"
            subtitle="Your latest interactions"
          />
          <StandardCardContent>
            <EmptyState
              icon={Calendar}
              title="No recent activity"
              description="Start exploring events to see your activity here"
              action={{
                label: "Browse Events",
                onClick: () => window.location.href = '/events'
              }}
            />
          </StandardCardContent>
        </StandardCard>
      </div>
    </div>
  )
}

function DesignerDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      <div className="col-span-12 xl:col-span-8">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-6">
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Active Collections"
                action={<Palette className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">2 in upcoming shows</p>
              </StandardCardContent>
            </StandardCard>
          </div>
          
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Profile Views"
                action={<Eye className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">1.2k</div>
                <p className="text-xs text-muted-foreground">+20% from last week</p>
              </StandardCardContent>
            </StandardCard>
          </div>

          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Followers"
                action={<Users className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">856</div>
                <p className="text-xs text-muted-foreground">+47 this month</p>
              </StandardCardContent>
            </StandardCard>
          </div>

          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Event Bookings"
                action={<Calendar className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Next show Feb 15</p>
              </StandardCardContent>
            </StandardCard>
          </div>
        </div>

        <StandardCard>
          <StandardCardHeader title="Designer Tools" />
          <StandardCardContent className="flex flex-wrap gap-3">
            <Link to="/designer-dashboard">
              <Button variant="outline">Manage Portfolio</Button>
            </Link>
            <Link to="/events">
              <Button variant="outline">Apply to Events</Button>
            </Link>
            <Button variant="outline">Upload Collection</Button>
          </StandardCardContent>
        </StandardCard>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <StandardCard>
          <StandardCardHeader title="Portfolio Stats" />
          <StandardCardContent>
            <EmptyState
              icon={Palette}
              title="Upload your portfolio"
              description="Show your best work to event organizers"
              action={{
                label: "Upload Photos",
                onClick: () => window.location.href = '/admin/portfolio-upload'
              }}
            />
          </StandardCardContent>
        </StandardCard>
      </div>
    </div>
  )
}

function OrganizerDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      <div className="col-span-12 xl:col-span-8">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-6">
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Active Events"
                action={<Calendar className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">3 this month</p>
              </StandardCardContent>
            </StandardCard>
          </div>
          
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Total Attendees"
                action={<Users className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">2,450</div>
                <p className="text-xs text-muted-foreground">+320 this month</p>
              </StandardCardContent>
            </StandardCard>
          </div>

          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Revenue"
                action={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">$45.6k</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </StandardCardContent>
            </StandardCard>
          </div>

          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Tickets Sold"
                action={<Ticket className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">892</div>
                <p className="text-xs text-muted-foreground">78% capacity</p>
              </StandardCardContent>
            </StandardCard>
          </div>
        </div>

        <StandardCard>
          <StandardCardHeader title="Event Management" />
          <StandardCardContent className="flex flex-wrap gap-3">
            <Link to="/admin/create-event">
              <Button>Create New Event</Button>
            </Link>
            <Link to="/organizer-dashboard">
              <Button variant="outline">Manage Events</Button>
            </Link>
            <Link to="/admin/analytics">
              <Button variant="outline">View Analytics</Button>
            </Link>
            <Button variant="outline">Download Reports</Button>
          </StandardCardContent>
        </StandardCard>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <StandardCard>
          <StandardCardHeader title="Recent Events" />
          <StandardCardContent>
            <EmptyState
              icon={Calendar}
              title="Create your first event"
              description="Start organizing amazing fashion events"
              action={{
                label: "Create Event",
                onClick: () => window.location.href = '/admin/create-event'
              }}
            />
          </StandardCardContent>
        </StandardCard>
      </div>
    </div>
  )
}

function VenueDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      <div className="col-span-12 xl:col-span-8">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-6">
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Bookings"
                action={<Building2 className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </StandardCardContent>
            </StandardCard>
          </div>

          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Revenue"
                action={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">$28.5k</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </StandardCardContent>
            </StandardCard>
          </div>

          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Occupancy Rate"
                action={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">Above average</p>
              </StandardCardContent>
            </StandardCard>
          </div>

          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Inquiries"
                action={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">5 pending response</p>
              </StandardCardContent>
            </StandardCard>
          </div>
        </div>

        <StandardCard>
          <StandardCardHeader title="Venue Management" />
          <StandardCardContent className="flex flex-wrap gap-3">
            <Link to="/venue-dashboard">
              <Button variant="outline">Manage Venue</Button>
            </Link>
            <Link to="/admin/venue-availability">
              <Button variant="outline">Update Availability</Button>
            </Link>
            <Link to="/admin/venue-photos">
              <Button variant="outline">Update Photos</Button>
            </Link>
          </StandardCardContent>
        </StandardCard>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <StandardCard>
          <StandardCardHeader title="Upcoming Bookings" />
          <StandardCardContent>
            <EmptyState
              icon={Building2}
              title="No upcoming bookings"
              description="Update your availability to get more bookings"
              action={{
                label: "Add Availability",
                onClick: () => window.location.href = '/admin/venue-availability'
              }}
            />
          </StandardCardContent>
        </StandardCard>
      </div>
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      <div className="col-span-12 xl:col-span-8">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-6">
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Total Users"
                action={<Users className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">12.4k</div>
                <p className="text-xs text-muted-foreground">+18% from last month</p>
              </StandardCardContent>
            </StandardCard>
          </div>
          
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Active Events"
                action={<Calendar className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">34</div>
                <p className="text-xs text-muted-foreground">Across all organizers</p>
              </StandardCardContent>
            </StandardCard>
          </div>

          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Platform Revenue"
                action={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">$156k</div>
                <p className="text-xs text-muted-foreground">+25% from last quarter</p>
              </StandardCardContent>
            </StandardCard>
          </div>

          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StandardCard>
              <StandardCardHeader 
                title="Support Tickets"
                action={<Settings className="h-4 w-4 text-muted-foreground" />}
              />
              <StandardCardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">2 pending resolution</p>
              </StandardCardContent>
            </StandardCard>
          </div>
        </div>

        <StandardCard>
          <StandardCardHeader title="Platform Administration" />
          <StandardCardContent className="flex flex-wrap gap-3">
            <Link to="/admin/dashboard">
              <Button>Admin Panel</Button>
            </Link>
            <Link to="/admin/analytics">
              <Button variant="outline">Platform Analytics</Button>
            </Link>
            <Button variant="outline">User Management</Button>
            <Button variant="outline">System Settings</Button>
          </StandardCardContent>
        </StandardCard>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <StandardCard>
          <StandardCardHeader title="System Health" />
          <StandardCardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Status</span>
                <Badge className="bg-success text-success-foreground">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge className="bg-success text-success-foreground">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <Badge className="bg-warning text-warning-foreground">95% Used</Badge>
              </div>
            </div>
          </StandardCardContent>
        </StandardCard>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser()
  const [userRole, setUserRole] = useState<string>('fashion_enthusiast')
  
  useEffect(() => {
    if (user) {
      // Check multiple possible locations for role
      const role = user.publicMetadata?.role || 
                   user.unsafeMetadata?.role || 
                   user.organizationMemberships?.[0]?.role ||
                   'fashion_enthusiast'
      setUserRole(role as string)
    }
  }, [user])

  // Show loading state
  if (!isLoaded) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-12 xl:col-span-8">
            <div className="grid grid-cols-12 gap-4 lg:gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="col-span-12 md:col-span-6 xl:col-span-3">
                  <DashboardCardSkeleton />
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-12 xl:col-span-4">
            <DashboardCardSkeleton />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Handle not signed in
  if (!isSignedIn) {
    return <RedirectToSignIn />
  }
  
  const userName = user?.firstName || user?.username || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'
  
  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      fashion_enthusiast: 'Fashion Enthusiast',
      designer: 'Fashion Designer',
      event_organizer: 'Event Organizer', 
      venue_owner: 'Venue Owner',
      admin: 'Platform Administrator'
    }
    return roleMap[role] || 'Fashion Enthusiast'
  }
  
  const renderDashboard = () => {
    switch(userRole) {
      case 'designer':
        return <DesignerDashboard />
      case 'event_organizer':
        return <OrganizerDashboard />
      case 'venue_owner':
        return <VenueDashboard />
      case 'admin':
        return <AdminDashboard />
      default:
        return <CustomerDashboard />
    }
  }
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-foreground mb-2">
              Welcome back, {userName}!
            </h1>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                {getRoleDisplay(userRole)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Account Settings
            </Button>
            <Link to="/admin/create-event">
              <Button className="bg-gradient-brand hover:opacity-90 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {renderDashboard()}
    </DashboardLayout>
  )
}
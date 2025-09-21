import { useUser } from '@clerk/clerk-react'
import { Navigation } from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, DollarSign, TrendingUp, Activity, Eye, ShoppingBag, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDashboardMetrics, useRecentActivities, useBookingPipeline } from '@/hooks/useDashboardMetrics'
import { format } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { subDays } from 'date-fns'

// Metric Card Component
function MetricCard({ title, value, icon: Icon, trend, loading }: any) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
      </CardContent>
    </Card>
  )
}

// Revenue Chart Component
function RevenueChart({ loading }: { loading: boolean }) {
  // Generate sample data for the last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    return {
      date: format(date, 'MMM dd'),
      revenue: Math.random() * 5000 + 1000,
      bookings: Math.floor(Math.random() * 20 + 5)
    }
  })

  if (loading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-4">
      <CardHeader>        <CardTitle>Revenue Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Revenue ($)"
            />
            <Line 
              type="monotone" 
              dataKey="bookings" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Bookings"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Activity Feed Component
function ActivityFeed({ activities, loading }: any) {
  const getIcon = (type: string) => {
    switch(type) {      case 'registration': return Users
      case 'ticket': return ShoppingBag
      case 'inquiry': return Eye
      default: return Activity
    }
  }

  if (loading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No recent activities</p>        ) : (
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity: any, index: number) => {
              const Icon = getIcon(activity.type)
              return (
                <div key={index} className="flex items-start space-x-3">
                  <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp ? format(new Date(activity.timestamp), 'MMM dd, HH:mm') : 'Just now'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Main Dashboard Component
export function EnhancedDashboard() {
  const { user } = useUser()
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics()
  const { data: activities, isLoading: activitiesLoading } = useRecentActivities()
  const { data: pipeline, isLoading: pipelineLoading } = useBookingPipeline()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.firstName || 'User'}! Here's your Fashionistas overview
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Events"
            value={metrics?.totalEvents || 0}
            icon={Calendar}
            loading={metricsLoading}
            trend={`${0} active, ${0} upcoming`}
          />
          <MetricCard
            title="Daily Revenue"
            value={`$0.00`}
            icon={DollarSign}
            loading={metricsLoading}
            trend="Today's earnings"
          />
          <MetricCard
            title="Weekly Revenue"
            value={`$0.00`}
            icon={TrendingUp}
            loading={metricsLoading}
            trend="Last 7 days"
          />
          <MetricCard            title="Total Bookings"
            value={0}
            icon={Users}
            loading={pipelineLoading}
            trend={`0 pending`}
          />
        </div>

        {/* Charts and Activities */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <RevenueChart loading={metricsLoading} />
          
          {/* Booking Pipeline */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Booking Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pipelineLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse h-8 bg-gray-100 rounded"></div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        Pending
                      </span>
                      <span className="text-sm font-bold">0</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all"
                        style={{ width: `0%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Badge className="bg-green-500">✓</Badge>
                        Confirmed
                      </span>
                      <span className="text-sm font-bold">0</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `0%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">Total</span>
                      <span className="text-lg font-bold">
                        0
                      </span>                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities - Full Width */}
        <ActivityFeed activities={activities || []} loading={activitiesLoading} />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-wrap">
            <Button asChild>
              <Link to="/events/new">Create Event</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/events">Manage Events</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/venues">Browse Venues</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/analytics">View Analytics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
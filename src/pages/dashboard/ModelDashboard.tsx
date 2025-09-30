import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Camera, Star, TrendingUp, User, MapPin } from "lucide-react";

export default function ModelDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Model Dashboard</h1>
          <p className="text-gray-600">Manage your modeling career and bookings</p>
        </div>
        <Button>
          <Camera className="mr-2 h-4 w-4" />
          Update Portfolio
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Views</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,205</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">
              Based on 24 reviews
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,240</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>
            Your confirmed bookings and casting calls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                event: "Fashion Week Runway Show",
                designer: "Valentina Designs",
                date: "Jan 28, 2024",
                time: "2:00 PM",
                location: "NYC Fashion Center",
                status: "confirmed",
                fee: "$800"
              },
              {
                event: "Editorial Photoshoot",
                designer: "Vogue Magazine",
                date: "Jan 30, 2024", 
                time: "10:00 AM",
                location: "Studio 42, Manhattan",
                status: "pending",
                fee: "$1,200"
              },
              {
                event: "Brand Campaign",
                designer: "Luxury Brand Co.",
                date: "Feb 5, 2024",
                time: "9:00 AM",
                location: "Los Angeles",
                status: "casting",
                fee: "TBD"
              }
            ].map((booking, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{booking.event}</h3>
                    <Badge variant={
                      booking.status === 'confirmed' ? 'default' :
                      booking.status === 'pending' ? 'secondary' :
                      'outline'
                    }>
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{booking.designer}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{booking.date} at {booking.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{booking.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{booking.fee}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
            <CardDescription>
              Your modeling profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-8 w-8 bg-gray-100 rounded-full p-2" />
                <div>
                  <p className="font-medium">Sophia Anderson</p>
                  <p className="text-sm text-gray-500">Professional Model</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Height</p>
                  <p className="font-medium">5'9"</p>
                </div>
                <div>
                  <p className="text-gray-500">Experience</p>
                  <p className="font-medium">3 years</p>
                </div>
                <div>
                  <p className="text-gray-500">Specialties</p>
                  <p className="font-medium">Runway, Editorial</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium">New York, NY</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest portfolio updates and bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: "Portfolio updated", time: "2 hours ago" },
                { action: "Booking confirmed for Fashion Week", time: "1 day ago" },
                { action: "New casting application submitted", time: "3 days ago" },
                { action: "Profile viewed by Vogue Magazine", time: "1 week ago" }
              ].map((activity, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
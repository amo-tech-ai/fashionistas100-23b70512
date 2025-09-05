import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { Package, Truck, Calendar, Users, CheckCircle } from 'lucide-react';

export default function Production() {
  const [activeTab, setActiveTab] = useState('equipment');
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Production Management</h1>
          
          <div className="flex gap-4 mb-8">
            <Button 
              variant={activeTab === 'equipment' ? 'default' : 'outline'}
              onClick={() => setActiveTab('equipment')}
            >
              <Package className="mr-2 h-4 w-4" /> Equipment
            </Button>
            <Button 
              variant={activeTab === 'logistics' ? 'default' : 'outline'}
              onClick={() => setActiveTab('logistics')}
            >
              <Truck className="mr-2 h-4 w-4" /> Logistics
            </Button>
            <Button 
              variant={activeTab === 'timeline' ? 'default' : 'outline'}
              onClick={() => setActiveTab('timeline')}
            >
              <Calendar className="mr-2 h-4 w-4" /> Timeline
            </Button>
            <Button 
              variant={activeTab === 'crew' ? 'default' : 'outline'}
              onClick={() => setActiveTab('crew')}
            >
              <Users className="mr-2 h-4 w-4" /> Crew
            </Button>
          </div>
          
          {activeTab === 'equipment' && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Lighting Equipment</CardTitle>
                  <CardDescription>Manage runway and stage lighting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>LED Panels (50 units)</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Spotlights (20 units)</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Moving Heads (10 units)</span>
                      <span className="text-yellow-600">In Transit</span>
                    </div>
                    <Button className="w-full">Request Equipment</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sound System</CardTitle>
                  <CardDescription>Audio equipment status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Line Array Speakers</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Wireless Microphones (8)</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>DJ Booth Setup</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <Button className="w-full">Sound Check Schedule</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Runway Setup</CardTitle>
                  <CardDescription>Stage and runway components</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Runway Sections (40m)</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Backdrop Frame</span>
                      <span className="text-red-600">Pending</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Red Carpet</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <Button className="w-full">View Setup Plan</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Backstage Equipment</CardTitle>
                  <CardDescription>Dressing room and backstage needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Makeup Stations (20)</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Clothing Racks (50)</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Mirrors & Lighting</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <Button className="w-full">Backstage Layout</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeTab === 'logistics' && (
            <Card>
              <CardHeader>
                <CardTitle>Logistics Overview</CardTitle>
                <CardDescription>Transportation and delivery schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Equipment Delivery - Sept 10</h4>
                    <p className="text-sm text-muted-foreground">Lighting and sound equipment from warehouse</p>
                    <p className="text-sm mt-2">Status: <span className="text-green-600">Confirmed</span></p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Runway Installation - Sept 11</h4>
                    <p className="text-sm text-muted-foreground">Professional crew for runway setup</p>
                    <p className="text-sm mt-2">Status: <span className="text-yellow-600">Scheduled</span></p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Designer Collections Arrival - Sept 12</h4>
                    <p className="text-sm text-muted-foreground">Secure transport for designer pieces</p>
                    <p className="text-sm mt-2">Status: <span className="text-blue-600">In Progress</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'timeline' && (
            <Card>
              <CardHeader>
                <CardTitle>Production Timeline</CardTitle>
                <CardDescription>Key milestones and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold">Venue Booking Confirmed</h4>
                      <p className="text-sm text-muted-foreground">August 15, 2025</p>
                      <p className="text-sm mt-1">✅ Completed</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold">Equipment Ordered</h4>
                      <p className="text-sm text-muted-foreground">August 20, 2025</p>
                      <p className="text-sm mt-1">✅ Completed</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-400 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold">Setup Day</h4>
                      <p className="text-sm text-muted-foreground">September 11, 2025</p>
                      <p className="text-sm mt-1">⏳ Upcoming</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-400 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">4</div>
                    <div>
                      <h4 className="font-semibold">Event Day</h4>
                      <p className="text-sm text-muted-foreground">September 12, 2025</p>
                      <p className="text-sm mt-1">⏳ Upcoming</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'crew' && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Crew</CardTitle>
                  <CardDescription>8 members</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">View Team</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Security Team</CardTitle>
                  <CardDescription>12 members</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">View Team</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Catering Staff</CardTitle>
                  <CardDescription>15 members</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">View Team</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
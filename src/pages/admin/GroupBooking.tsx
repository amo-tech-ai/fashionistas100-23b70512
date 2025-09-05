import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import { Users, Calendar, Ticket, Mail } from 'lucide-react';

export default function GroupBooking() {
  const [formData, setFormData] = useState({
    group_name: '',
    contact_name: '',
    email: '',
    phone: '',
    event_id: '',
    num_tickets: '',
    ticket_type: 'general',
    special_requests: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Group booking request submitted!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Group Booking</CardTitle>
              <CardDescription>
                Book tickets for groups of 10 or more with special rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="group_name">Group/Organization Name *</Label>
                  <Input
                    id="group_name"
                    required
                    value={formData.group_name}
                    onChange={(e) => setFormData({...formData, group_name: e.target.value})}
                    placeholder="Fashion Institute Students"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_name">Contact Person *</Label>
                    <Input
                      id="contact_name"
                      required
                      value={formData.contact_name}
                      onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="num_tickets">Number of Tickets *</Label>
                    <Input
                      id="num_tickets"
                      type="number"
                      min="10"
                      required
                      value={formData.num_tickets}
                      onChange={(e) => setFormData({...formData, num_tickets: e.target.value})}
                      placeholder="Minimum 10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ticket_type">Ticket Type *</Label>
                    <select
                      id="ticket_type"
                      className="w-full px-3 py-2 border rounded-md"
                      value={formData.ticket_type}
                      onChange={(e) => setFormData({...formData, ticket_type: e.target.value})}
                    >
                      <option value="general">General</option>
                      <option value="vip">VIP</option>
                      <option value="sponsor">Sponsor</option>
                    </select>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Group Discount Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>10-25 tickets:</span>
                        <span className="font-semibold">10% off</span>
                      </div>
                      <div className="flex justify-between">
                        <span>26-50 tickets:</span>
                        <span className="font-semibold">15% off</span>
                      </div>
                      <div className="flex justify-between">
                        <span>50+ tickets:</span>
                        <span className="font-semibold">20% off</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button type="submit" className="w-full">Submit Group Booking Request</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
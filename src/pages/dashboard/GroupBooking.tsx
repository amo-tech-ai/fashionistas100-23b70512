import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, Plus, Minus, Calendar, Mail, Phone, Save, ArrowLeft, MessageSquare, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GroupBooking = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([
    { name: '', email: '', phone: '' }
  ]);
  const [formData, setFormData] = useState({
    groupName: '',
    eventId: '',
    groupSize: 1,
    organizer: {
      name: '',
      email: '',
      phone: '',
      company: ''
    },
    specialRequests: '',
    paymentMethod: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/admin/leap');
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOrganizerChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      organizer: { ...prev.organizer, [field]: value }
    }));
  };

  const addMember = () => {
    setMembers([...members, { name: '', email: '', phone: '' }]);
    setFormData(prev => ({ ...prev, groupSize: members.length + 1 }));
  };

  const removeMember = (index: number) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
    setFormData(prev => ({ ...prev, groupSize: newMembers.length }));
  };

  const updateMember = (index: number, field: string, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const calculateTotal = () => {
    const pricePerTicket = 150; // This would come from the selected event
    return pricePerTicket * members.length;
  };

  const getDiscount = () => {
    if (members.length >= 10) return 20;
    if (members.length >= 5) return 15;
    return 0;
  };

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/leap')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Create Group Booking</h1>
            <p className="text-gray-600 mt-2">Book tickets for multiple attendees at once</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Group Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Group Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="groupName">Group Name *</Label>
                      <Input
                        id="groupName"
                        placeholder="Marketing Team Outing"
                        value={formData.groupName}
                        onChange={(e) => handleChange('groupName', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="event">Select Event *</Label>
                      <Select
                        value={formData.eventId}
                        onValueChange={(value) => handleChange('eventId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an event" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fashion-week-2025">Fashion Week 2025 - Oct 15</SelectItem>
                          <SelectItem value="designer-showcase">Designer Showcase - Nov 20</SelectItem>
                          <SelectItem value="summer-collection">Summer Collection Launch - Jun 01</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Group Organizer */}
                <Card>
                  <CardHeader>
                    <CardTitle>Group Organizer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="organizerName">Full Name *</Label>
                        <Input
                          id="organizerName"
                          placeholder="John Doe"
                          value={formData.organizer.name}
                          onChange={(e) => handleOrganizerChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          placeholder="Fashion Corp"
                          value={formData.organizer.company}
                          onChange={(e) => handleOrganizerChange('company', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">
                          <Mail className="h-4 w-4 inline mr-1" />
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.organizer.email}
                          onChange={(e) => handleOrganizerChange('email', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">
                          <Phone className="h-4 w-4 inline mr-1" />
                          Phone *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 234 567 890"
                          value={formData.organizer.phone}
                          onChange={(e) => handleOrganizerChange('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Group Members */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Group Members ({members.length})</span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={addMember}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Member
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {members.map((member, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Member {index + 1}</span>
                          {members.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMember(index)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Input
                            placeholder="Name"
                            value={member.name}
                            onChange={(e) => updateMember(index, 'name', e.target.value)}
                            required
                          />
                          <Input
                            type="email"
                            placeholder="Email"
                            value={member.email}
                            onChange={(e) => updateMember(index, 'email', e.target.value)}
                            required
                          />
                          <Input
                            type="tel"
                            placeholder="Phone (optional)"
                            value={member.phone}
                            onChange={(e) => updateMember(index, 'phone', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Special Requests */}
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="requests">Special Requests</Label>
                      <Textarea
                        id="requests"
                        placeholder="Any dietary requirements, accessibility needs, or special arrangements..."
                        rows={4}
                        value={formData.specialRequests}
                        onChange={(e) => handleChange('specialRequests', e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="chat" className="h-4 w-4" />
                      <Label htmlFor="chat" className="flex items-center gap-2 cursor-pointer">
                        <MessageSquare className="h-4 w-4" />
                        Create group chat for this booking
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Pricing Summary */}
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tickets</span>
                        <span>{members.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Price per ticket</span>
                        <span>$150</span>
                      </div>
                      {getDiscount() > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Group discount</span>
                          <span>-{getDiscount()}%</span>
                        </div>
                      )}
                      <hr />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>
                          ${getDiscount() > 0 
                            ? (calculateTotal() * (1 - getDiscount() / 100)).toFixed(2)
                            : calculateTotal()
                          }
                        </span>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Group Benefits</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>✓ Priority check-in</li>
                        <li>✓ Dedicated group seating</li>
                        {members.length >= 5 && <li>✓ 15% group discount</li>}
                        {members.length >= 10 && <li>✓ 20% group discount</li>}
                        {members.length >= 10 && <li>✓ Complimentary refreshments</li>}
                      </ul>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <Label htmlFor="payment">Payment Method</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleChange('paymentMethod', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="invoice">Company Invoice</SelectItem>
                          <SelectItem value="credit-card">Credit Card</SelectItem>
                          <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button type="submit" className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Create Group Booking
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/admin/leap')}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GroupBooking;
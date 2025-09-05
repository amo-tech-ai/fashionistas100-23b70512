import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Calendar, MapPin, Users, DollarSign, Clock, Image, 
  Save, ArrowLeft, Globe, Lock, Ticket, Tag, CreditCard,
  Mail, Phone, AlertCircle, CheckCircle, Info, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    category: '',
    subcategory: '',
    
    // Date & Time
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    timezone: 'America/New_York',
    recurring: false,
    
    // Location
    locationType: 'venue',
    venue: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    onlineUrl: '',
    
    // Ticketing
    ticketType: 'paid',
    price: '',
    earlyBirdPrice: '',
    earlyBirdDeadline: '',
    capacity: '',
    ticketsPerOrder: '',
    salesStartDate: '',
    salesEndDate: '',
    
    // Details
    description: '',
    image: '',
    tags: [],
    
    // Organizer
    organizerName: '',
    organizerEmail: '',
    organizerPhone: '',
    organizerWebsite: '',
    
    // Settings
    featured: false,
    private: false,
    passwordProtected: false,
    eventPassword: '',
    requireApproval: false,
    waitlist: false,
    showRemainingTickets: true,
    
    // Additional Options
    ageRestriction: 'none',
    dressCode: '',
    refundPolicy: 'no-refunds',
    terms: ''
  });

  const [currentTag, setCurrentTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to backend
    navigate('/admin/events');
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      handleChange('tags', [...formData.tags, currentTag]);
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    handleChange('tags', formData.tags.filter(t => t !== tag));
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
            <h1 className="text-3xl font-bold">Create New Event</h1>
            <p className="text-gray-600 mt-2">Fill in the details to create a new fashion event</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Event Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Event Name *</Label>
                      <Input
                        id="name"
                        placeholder="Fashion Week 2025"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This will be your event's title. Your title will be used to help create your event's summary, description, category, and tags - so be specific!
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleChange('category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fashion-show">Fashion Show</SelectItem>
                            <SelectItem value="exhibition">Exhibition</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="networking">Networking</SelectItem>
                            <SelectItem value="product-launch">Product Launch</SelectItem>
                            <SelectItem value="pop-up">Pop-up Event</SelectItem>
                            <SelectItem value="conference">Conference</SelectItem>
                            <SelectItem value="gala">Gala/Awards</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Select
                          value={formData.subcategory}
                          onValueChange={(value) => handleChange('subcategory', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="haute-couture">Haute Couture</SelectItem>
                            <SelectItem value="ready-to-wear">Ready-to-Wear</SelectItem>
                            <SelectItem value="sustainable">Sustainable Fashion</SelectItem>
                            <SelectItem value="streetwear">Streetwear</SelectItem>
                            <SelectItem value="luxury">Luxury</SelectItem>
                            <SelectItem value="emerging-designers">Emerging Designers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Date and Time */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Date and Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => handleChange('startDate', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="startTime">Start Time *</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => handleChange('startTime', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="endDate">End Date *</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => handleChange('endDate', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">End Time *</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => handleChange('endTime', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="timezone">Time Zone</Label>
                      <Select
                        value={formData.timezone}
                        onValueChange={(value) => handleChange('timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT)</SelectItem>
                          <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="recurring"
                        checked={formData.recurring}
                        onChange={(e) => handleChange('recurring', e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="recurring" className="cursor-pointer">
                        This is a recurring event
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="locationType"
                          value="venue"
                          checked={formData.locationType === 'venue'}
                          onChange={(e) => handleChange('locationType', e.target.value)}
                        />
                        <span>Venue</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="locationType"
                          value="online"
                          checked={formData.locationType === 'online'}
                          onChange={(e) => handleChange('locationType', e.target.value)}
                        />
                        <span>Online event</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="locationType"
                          value="tba"
                          checked={formData.locationType === 'tba'}
                          onChange={(e) => handleChange('locationType', e.target.value)}
                        />
                        <span>To be announced</span>
                      </label>
                    </div>

                    {formData.locationType === 'venue' && (
                      <>
                        <div>
                          <Label htmlFor="venue">Venue Name *</Label>
                          <Select
                            value={formData.venue}
                            onValueChange={(value) => handleChange('venue', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select venue or enter new" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="grand-palais">Grand Palais</SelectItem>
                              <SelectItem value="the-venue">The Venue</SelectItem>
                              <SelectItem value="rooftop-gallery">Rooftop Gallery</SelectItem>
                              <SelectItem value="convention-center">Convention Center</SelectItem>
                              <SelectItem value="boutique-space">Boutique Space</SelectItem>
                              <SelectItem value="new">+ Add New Venue</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="address">Street Address</Label>
                          <Input
                            id="address"
                            placeholder="123 Fashion Ave"
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              placeholder="New York"
                              value={formData.city}
                              onChange={(e) => handleChange('city', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State/Province</Label>
                            <Input
                              id="state"
                              placeholder="NY"
                              value={formData.state}
                              onChange={(e) => handleChange('state', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                            <Input
                              id="zipCode"
                              placeholder="10001"
                              value={formData.zipCode}
                              onChange={(e) => handleChange('zipCode', e.target.value)}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {formData.locationType === 'online' && (
                      <div>
                        <Label htmlFor="onlineUrl">Event URL</Label>
                        <Input
                          id="onlineUrl"
                          type="url"
                          placeholder="https://zoom.us/j/..."
                          value={formData.onlineUrl}
                          onChange={(e) => handleChange('onlineUrl', e.target.value)}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Describe your event..."
                      rows={8}
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Add more details about your event like the agenda, what attendees should bring, and how to get there.
                    </p>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tags (e.g., fashion, runway, designer)"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Ticketing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ticket className="h-5 w-5" />
                      Ticketing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Ticket Type</Label>
                      <div className="mt-2 space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="ticketType"
                            value="free"
                            checked={formData.ticketType === 'free'}
                            onChange={(e) => handleChange('ticketType', e.target.value)}
                          />
                          <span>Free</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="ticketType"
                            value="paid"
                            checked={formData.ticketType === 'paid'}
                            onChange={(e) => handleChange('ticketType', e.target.value)}
                          />
                          <span>Paid</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="ticketType"
                            value="donation"
                            checked={formData.ticketType === 'donation'}
                            onChange={(e) => handleChange('ticketType', e.target.value)}
                          />
                          <span>Donation</span>
                        </label>
                      </div>
                    </div>

                    {formData.ticketType === 'paid' && (
                      <>
                        <div>
                          <Label htmlFor="price">
                            <DollarSign className="h-4 w-4 inline mr-1" />
                            Ticket Price *
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            placeholder="150.00"
                            value={formData.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="earlyBirdPrice">Early Bird Price</Label>
                          <Input
                            id="earlyBirdPrice"
                            type="number"
                            step="0.01"
                            placeholder="120.00"
                            value={formData.earlyBirdPrice}
                            onChange={(e) => handleChange('earlyBirdPrice', e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <Label htmlFor="capacity">
                        <Users className="h-4 w-4 inline mr-1" />
                        Event Capacity *
                      </Label>
                      <Input
                        id="capacity"
                        type="number"
                        placeholder="500"
                        value={formData.capacity}
                        onChange={(e) => handleChange('capacity', e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Total number of tickets you're willing to sell
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="ticketsPerOrder">Max Tickets Per Order</Label>
                      <Input
                        id="ticketsPerOrder"
                        type="number"
                        placeholder="10"
                        value={formData.ticketsPerOrder}
                        onChange={(e) => handleChange('ticketsPerOrder', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Event Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Event Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Featured Event</h4>
                        <p className="text-xs text-gray-600">Display on homepage</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => handleChange('featured', e.target.checked)}
                        className="h-4 w-4"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Private Event</h4>
                        <p className="text-xs text-gray-600">Only visible via direct link</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.private}
                        onChange={(e) => handleChange('private', e.target.checked)}
                        className="h-4 w-4"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Require Approval</h4>
                        <p className="text-xs text-gray-600">Manually approve attendees</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.requireApproval}
                        onChange={(e) => handleChange('requireApproval', e.target.checked)}
                        className="h-4 w-4"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Enable Waitlist</h4>
                        <p className="text-xs text-gray-600">When tickets sell out</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.waitlist}
                        onChange={(e) => handleChange('waitlist', e.target.checked)}
                        className="h-4 w-4"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Show Remaining</h4>
                        <p className="text-xs text-gray-600">Display tickets left</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.showRemainingTickets}
                        onChange={(e) => handleChange('showRemainingTickets', e.target.checked)}
                        className="h-4 w-4"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="ageRestriction">Age Restriction</Label>
                      <Select
                        value={formData.ageRestriction}
                        onValueChange={(value) => handleChange('ageRestriction', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">All Ages</SelectItem>
                          <SelectItem value="18+">18+</SelectItem>
                          <SelectItem value="21+">21+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dressCode">Dress Code</Label>
                      <Input
                        id="dressCode"
                        placeholder="e.g., Business Casual, Cocktail"
                        value={formData.dressCode}
                        onChange={(e) => handleChange('dressCode', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="refundPolicy">Refund Policy</Label>
                      <Select
                        value={formData.refundPolicy}
                        onValueChange={(value) => handleChange('refundPolicy', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-refunds">No Refunds</SelectItem>
                          <SelectItem value="7-days">7 Days Before Event</SelectItem>
                          <SelectItem value="14-days">14 Days Before Event</SelectItem>
                          <SelectItem value="30-days">30 Days Before Event</SelectItem>
                          <SelectItem value="anytime">Anytime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button type="submit" className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Create Event
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

export default CreateEvent;
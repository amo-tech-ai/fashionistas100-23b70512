import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, MapPin, Users, DollarSign, Image } from 'lucide-react';

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'runway_show',
    venue_name: '',
    venue_address: '',
    date: new Date().toISOString().split('T')[0],
    start_time: '',
    end_time: '',
    capacity: '',
    price_general: '',
    price_vip: '',
    price_sponsor: '',
    image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: formData.title,
          description: formData.description,
          venue_id: formData.venue_name, // Map to venue_id for consistency
          organizer_id: user?.id || 'test-organizer',
          status: 'draft',
          start_datetime: `${formData.date}T${formData.start_time}:00`,
          end_datetime: `${formData.date}T${formData.end_time}:00`
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Event created successfully!');
      navigate(`/events/${data.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Create Fashion Event</CardTitle>
              <CardDescription>
                Fill in the details below to create your fashion event.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  
                  <div>
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Fashion Week 2025"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Event Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="runway_show">Runway Show</SelectItem>
                        <SelectItem value="fashion_week">Fashion Week</SelectItem>
                        <SelectItem value="exhibition">Exhibition</SelectItem>
                        <SelectItem value="popup">Pop-up Event</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder="Describe your fashion event..."
                    />
                  </div>
                </div>

                {/* Venue Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Venue Information</h3>
                  
                  <div>
                    <Label htmlFor="venue_name">Venue Name *</Label>
                    <Input
                      id="venue_name"
                      name="venue_name"
                      value={formData.venue_name}
                      onChange={handleInputChange}
                      required
                      placeholder="Grand Palais"
                    />
                  </div>

                  <div>
                    <Label htmlFor="venue_address">Venue Address *</Label>
                    <Input
                      id="venue_address"
                      name="venue_address"
                      value={formData.venue_address}
                      onChange={handleInputChange}
                      required
                      placeholder="123 Fashion Ave, New York, NY 10001"
                    />
                  </div>
                </div>

                {/* Date and Time */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Date and Time</h3>
                  
                  <div>
                    <Label htmlFor="date">Event Date *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_time">Start Time *</Label>
                      <Input
                        id="start_time"
                        name="start_time"
                        type="time"
                        value={formData.start_time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_time">End Time *</Label>
                      <Input
                        id="end_time"
                        name="end_time"
                        type="time"
                        value={formData.end_time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Capacity and Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Capacity and Pricing</h3>
                  
                  <div>
                    <Label htmlFor="capacity">Event Capacity *</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                      placeholder="500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price_general">General Price ($) *</Label>
                      <Input
                        id="price_general"
                        name="price_general"
                        type="number"
                        step="0.01"
                        value={formData.price_general}
                        onChange={handleInputChange}
                        required
                        placeholder="99"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price_vip">VIP Price ($) *</Label>
                      <Input
                        id="price_vip"
                        name="price_vip"
                        type="number"
                        step="0.01"
                        value={formData.price_vip}
                        onChange={handleInputChange}
                        required
                        placeholder="249"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price_sponsor">Sponsor Price ($) *</Label>
                      <Input
                        id="price_sponsor"
                        name="price_sponsor"
                        type="number"
                        step="0.01"
                        value={formData.price_sponsor}
                        onChange={handleInputChange}
                        required
                        placeholder="499"
                      />
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Event Image</h3>
                  
                  <div>
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/event-image.jpg"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin/dashboard')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Event'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
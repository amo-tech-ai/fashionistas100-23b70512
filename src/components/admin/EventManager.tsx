import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, Calendar, MapPin, Users, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdmin';

interface Event {
  id: string;
  event_name: string;
  description: string | null;
  status: string;
  start_datetime: string;
  end_datetime: string;
  organizer_id: string | null;
  venue_id: string | null;
  created_at: string;
  updated_at: string;
}

interface Venue {
  id: string;
  venue_name: string;
  city: string;
  address: string;
}

export const EventManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const { logAdminAction } = useAdmin();

  const [eventForm, setEventForm] = useState({
    event_name: '',
    description: '',
    status: 'draft',
    start_datetime: '',
    end_datetime: '',
    venue_id: ''
  });

  useEffect(() => {
    fetchEvents();
    fetchVenues();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: Record<string, unknown>) {
      toast({
        title: 'Error fetching events',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVenues = async () => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('id, venue_name, city, address')
        .eq('status', 'active')
        .order('venue_name');

      if (error) throw error;
      setVenues(data || []);
    } catch (error: Record<string, unknown>) {
      console.error('Error fetching venues:', error);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventForm,
          organizer_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      await logAdminAction('create', 'events', data.id, null, data);
      
      toast({
        title: 'Event created',
        description: 'The event has been created successfully.'
      });

      setShowEventDialog(false);
      resetForm();
      fetchEvents();
    } catch (error: Record<string, unknown>) {
      toast({
        title: 'Error creating event',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .update(eventForm)
        .eq('id', editingEvent.id)
        .select()
        .single();

      if (error) throw error;

      await logAdminAction('update', 'events', editingEvent.id, editingEvent, data);

      toast({
        title: 'Event updated',
        description: 'The event has been updated successfully.'
      });

      setShowEventDialog(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (error: Record<string, unknown>) {
      toast({
        title: 'Error updating event',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const eventToDelete = events.find(e => e.id === eventId);
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      await logAdminAction('delete', 'events', eventId, eventToDelete, null);

      toast({
        title: 'Event deleted',
        description: 'The event has been deleted successfully.'
      });

      fetchEvents();
    } catch (error: Record<string, unknown>) {
      toast({
        title: 'Error deleting event',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      event_name: event.event_name,
      description: event.description || '',
      status: event.status,
      start_datetime: new Date(event.start_datetime).toISOString().slice(0, 16),
      end_datetime: new Date(event.end_datetime).toISOString().slice(0, 16),
      venue_id: event.venue_id || ''
    });
    setShowEventDialog(true);
  };

  const resetForm = () => {
    setEventForm({
      event_name: '',
      description: '',
      status: 'draft',
      start_datetime: '',
      end_datetime: '',
      venue_id: ''
    });
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Event Management</h2>
          <p className="text-muted-foreground">Create and manage fashion events</p>
        </div>
        
        <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingEvent(null); }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="event_name">Event Name</Label>
                <Input
                  id="event_name"
                  value={eventForm.event_name}
                  onChange={(e) => setEventForm({...eventForm, event_name: e.target.value})}
                  placeholder="Enter event name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  placeholder="Enter event description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_datetime">Start Date & Time</Label>
                  <Input
                    id="start_datetime"
                    type="datetime-local"
                    value={eventForm.start_datetime}
                    onChange={(e) => setEventForm({...eventForm, start_datetime: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_datetime">End Date & Time</Label>
                  <Input
                    id="end_datetime"
                    type="datetime-local"
                    value={eventForm.end_datetime}
                    onChange={(e) => setEventForm({...eventForm, end_datetime: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Select value={eventForm.venue_id} onValueChange={(value) => setEventForm({...eventForm, venue_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.venue_name} - {venue.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={eventForm.status} onValueChange={(value) => setEventForm({...eventForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                  className="flex-1"
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowEventDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No events match your current filters.'
                  : 'Get started by creating your first event.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{event.event_name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.start_datetime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {venues.find(v => v.id === event.venue_id)?.venue_name || 'No venue'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(event.status)}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(event)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {event.description && (
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{event.description}</p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
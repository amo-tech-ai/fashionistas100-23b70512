import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Edit, Trash2 } from 'lucide-react';

const EventManagerSimple = () => {
  // Mock data for now
  const events = [
    {
      id: '1',
      title: 'Fashion Week Bogotá 2024',
      description: 'Annual fashion week showcasing Colombian designers.',
      organizer_id: 'org1',
      start_datetime: '2024-03-15T18:00:00Z',
      end_datetime: '2024-03-17T22:00:00Z',
      venue_id: 'venue1',
      status: 'published',
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z'
    },
    {
      id: '2',
      title: 'Sustainable Fashion Summit',
      description: 'Conference on sustainable practices in fashion.',
      organizer_id: 'org2',
      start_datetime: '2024-04-20T09:00:00Z',
      end_datetime: '2024-04-20T17:00:00Z',
      venue_id: 'venue2',
      status: 'draft',
      created_at: '2024-01-12T15:30:00Z',
      updated_at: '2024-01-12T15:30:00Z'
    }
  ];

  const venues = [
    { id: 'venue1', name: 'Centro de Convenciones', location: 'Bogotá, Colombia' },
    { id: 'venue2', name: 'Hotel Sofitel', location: 'Medellín, Colombia' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getVenueName = (venueId: string | null) => {
    const venue = venues.find(v => v.id === venueId);
    return venue ? `${venue.name}, ${venue.location}` : 'TBD';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Event Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {event.description}
                  </p>
                </div>
                {getStatusBadge(event.status)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {new Date(event.start_datetime).toLocaleDateString()} - {' '}
                    {new Date(event.end_datetime).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{getVenueName(event.venue_id)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Updated {event.updated_at === event.created_at ? 'Never' : new Date(event.updated_at).toLocaleDateString()}
                </span>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Users className="w-4 h-4 mr-1" />
                    Attendees
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {events.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No events yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventManagerSimple;
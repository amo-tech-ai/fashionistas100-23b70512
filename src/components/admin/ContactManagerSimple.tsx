import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, CheckCircle, Trash2 } from 'lucide-react';

const ContactManagerSimple = () => {
  // Mock data for now
  const contacts = [
    {
      id: '1',
      name: 'Maria Rodriguez',
      email: 'maria@email.com',
      subject: 'Event Partnership',
      message: 'Looking to partner for upcoming fashion week.',
      status: 'new',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Carlos Silva',
      email: 'carlos@email.com',
      subject: 'Designer Application',
      message: 'Interested in joining the platform as a designer.',
      status: 'replied',
      created_at: '2024-01-14T15:30:00Z'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">New</Badge>;
      case 'replied':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Replied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Contact Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium">{contact.name}</h3>
                  <p className="text-sm text-muted-foreground">{contact.email}</p>
                </div>
                {getStatusBadge(contact.status)}
              </div>
              
              {contact.subject && (
                <p className="font-medium text-sm mb-1">Subject: {contact.subject}</p>
              )}
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {contact.message}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(contact.created_at).toLocaleDateString()}
                </span>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Reply
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {contacts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No contact forms yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactManagerSimple;
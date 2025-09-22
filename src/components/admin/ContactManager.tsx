import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, MessageSquare, Eye, CheckCircle, Mail, Phone, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdmin';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  inquiry_type: string;
  status: string;
  event_id: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  assigned_to: string | null;
}

export const ContactManager = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { toast } = useToast();
  const { logAdminAction } = useAdmin();

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Map database schema to component interface
      const mappedContacts = (data || []).map(contact => ({
        id: contact.id,
        name: contact.name || '',
        email: contact.email || '',
        phone: null, // Not in current schema
        subject: 'General Inquiry', // Default value
        message: contact.message || '',
        inquiry_type: 'general',
        status: 'new',
        event_id: null,
        user_id: null,
        created_at: contact.created_at,
        updated_at: contact.created_at,
        resolved_at: null,
        assigned_to: null
      }));
      setContacts(mappedContacts);
    } catch (error: any) {
      toast({
        title: 'Error fetching contacts',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleUpdateStatus = async (contactId: string, newStatus: string) => {
    try {
      const contact = contacts.find(c => c.id === contactId);
      const updates: Record<string, unknown> = { status: newStatus };
      
      if (newStatus === 'resolved') {
        updates.resolved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('contact_forms')
        .update(updates)
        .eq('id', contactId)
        .select()
        .single();

      if (error) throw error;

      await logAdminAction('update', 'contact_forms', contactId, contact, data);

      toast({
        title: 'Status updated',
        description: `Contact status has been updated to ${newStatus}.`
      });

      fetchContacts();
    } catch (error: any) {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const openContactDialog = (contact: ContactSubmission) => {
    setSelectedContact(contact);
    setShowContactDialog(true);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    const matchesType = typeFilter === 'all' || contact.inquiry_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new': return 'destructive';
      case 'in_progress': return 'default';
      case 'resolved': return 'secondary';
      default: return 'outline';
    }
  };

  const getInquiryTypeLabel = (type: string) => {
    switch (type) {
      case 'general': return 'General';
      case 'event_inquiry': return 'Event Inquiry';
      case 'designer_application': return 'Designer Application';
      case 'partnership': return 'Partnership';
      case 'media': return 'Media';
      case 'support': return 'Support';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contact Management</h2>
          <p className="text-muted-foreground">Manage and respond to contact submissions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search contacts..."
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
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="event_inquiry">Event Inquiry</SelectItem>
            <SelectItem value="designer_application">Designer Application</SelectItem>
            <SelectItem value="partnership">Partnership</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="support">Support</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contacts List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading contacts...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'No contacts match your current filters.'
                  : 'No contact submissions have been received yet.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredContacts.map((contact) => (
            <Card key={contact.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{contact.subject}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {contact.name} ({contact.email})
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {contact.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(contact.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{contact.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getStatusBadgeVariant(contact.status)}>
                        {contact.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {getInquiryTypeLabel(contact.inquiry_type)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openContactDialog(contact)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {contact.status === 'new' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(contact.id, 'in_progress')}
                      >
                        Start Review
                      </Button>
                    )}
                    {contact.status === 'in_progress' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(contact.id, 'resolved')}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {/* Contact Detail Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Name:</strong>
                  <p>{selectedContact.name}</p>
                </div>
                <div>
                  <strong>Email:</strong>
                  <p>{selectedContact.email}</p>
                </div>
              </div>

              {selectedContact.phone && (
                <div>
                  <strong>Phone:</strong>
                  <p>{selectedContact.phone}</p>
                </div>
              )}

              <div>
                <strong>Subject:</strong>
                <p>{selectedContact.subject}</p>
              </div>

              <div>
                <strong>Message:</strong>
                <p className="whitespace-pre-wrap">{selectedContact.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Type:</strong>
                  <Badge variant="outline" className="ml-2">
                    {getInquiryTypeLabel(selectedContact.inquiry_type)}
                  </Badge>
                </div>
                <div>
                  <strong>Status:</strong>
                  <Badge variant={getStatusBadgeVariant(selectedContact.status)} className="ml-2">
                    {selectedContact.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <strong>Submitted:</strong>
                  <p>{new Date(selectedContact.created_at).toLocaleString()}</p>
                </div>
                {selectedContact.resolved_at && (
                  <div>
                    <strong>Resolved:</strong>
                    <p>{new Date(selectedContact.resolved_at).toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                {selectedContact.status === 'new' && (
                  <Button 
                    onClick={() => {
                      handleUpdateStatus(selectedContact.id, 'in_progress');
                      setShowContactDialog(false);
                    }}
                  >
                    Start Review
                  </Button>
                )}
                {selectedContact.status === 'in_progress' && (
                  <Button 
                    onClick={() => {
                      handleUpdateStatus(selectedContact.id, 'resolved');
                      setShowContactDialog(false);
                    }}
                  >
                    Mark Resolved
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => window.open(`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`)}
                >
                  Reply via Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
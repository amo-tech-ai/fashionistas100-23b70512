// Utility functions to handle database schema mapping

export const mapEventData = (event: any) => ({
  id: event.id,
  event_name: event.title || event.event_name, // Map title to event_name for UI compatibility
  title: event.title || event.event_name,
  description: event.description,
  start_datetime: event.start_datetime,
  end_datetime: event.end_datetime,
  status: event.status,
  organizer_id: event.organizer_id,
  venue_id: event.venue_id,
  created_at: event.created_at,
  updated_at: event.updated_at
});

export const mapDesignerData = (designer: any) => ({
  id: designer.id,
  user_id: designer.user_id || '',
  brand_name: designer.brand_name || designer.name || '',
  brand_slug: (designer.brand_name || designer.name || '').toLowerCase().replace(/\s+/g, '-'),
  bio: designer.bio,
  website_url: null,
  portfolio_urls: [],
  social_links: {},
  is_verified: false,
  created_at: designer.created_at,
  updated_at: designer.created_at
});

export const mapTicketData = (ticket: any) => ({
  id: ticket.id,
  ticket_name: ticket.ticket_type || 'General Admission',
  ticket_type: ticket.ticket_type || 'general',
  description: null,
  price: ticket.price,
  currency: 'USD',
  total_quantity: ticket.quantity,
  sold_quantity: ticket.sold,
  available_quantity: ticket.quantity - ticket.sold,
  status: 'active'
});
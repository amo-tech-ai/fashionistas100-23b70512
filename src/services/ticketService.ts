import { supabase } from "@/integrations/supabase/client";

export interface TicketPurchaseRequest {
  eventId: string;
  tickets: Array<{
    ticketId: string;
    quantity: number;
  }>;
  attendeeInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  specialRequests?: string;
}

export interface BookingResponse {
  bookingId: string;
  bookingReference: string;
  totalAmount: number;
  currency: string;
  status: string;
  qrCode?: string;
}

export interface Result<T> {
  data: T | null;
  error: string | null;
}

// Purchase tickets for an event
export async function purchaseTickets(request: TicketPurchaseRequest): Promise<Result<BookingResponse>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Calculate total amount
    let totalAmount = 0;
    const ticketIds = request.tickets.map(t => t.ticketId);
    
    const { data: ticketData, error: ticketError } = await supabase
      .from('event_tickets')
      .select('id, price, currency')
      .in('id', ticketIds);
      
    if (ticketError) {
      return { data: null, error: ticketError.message };
    }
    
    // Calculate total and verify availability
    for (const requestTicket of request.tickets) {
      const ticket = ticketData.find(t => t.id === requestTicket.ticketId);
      if (!ticket) {
        return { data: null, error: `Ticket ${requestTicket.ticketId} not found` };
      }
      totalAmount += ticket.price * requestTicket.quantity;
    }
    
    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        event_id: request.eventId,
        user_id: user?.id || null,
        attendee_name: request.attendeeInfo.name,
        attendee_email: request.attendeeInfo.email,
        attendee_phone: request.attendeeInfo.phone,
        total_amount: totalAmount,
        currency: ticketData[0]?.currency || 'USD',
        special_requests: request.specialRequests,
        booking_status: 'pending'
      })
      .select()
      .single();
      
    if (bookingError) {
      return { data: null, error: bookingError.message };
    }
    
    // Create booking tickets
    const bookingTickets = request.tickets.map(t => {
      const ticket = ticketData.find(td => td.id === t.ticketId)!;
      return {
        booking_id: booking.id,
        ticket_id: t.ticketId,
        quantity: t.quantity,
        unit_price: ticket.price,
        total_price: ticket.price * t.quantity
      };
    });
    
    const { error: ticketInsertError } = await supabase
      .from('booking_tickets')
      .insert(bookingTickets);
      
    if (ticketInsertError) {
      return { data: null, error: ticketInsertError.message };
    }
    
    return {
      data: {
        bookingId: booking.id,
        bookingReference: booking.booking_reference,
        totalAmount: booking.total_amount,
        currency: booking.currency,
        status: booking.booking_status,
        qrCode: booking.qr_code
      },
      error: null
    };
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";
    return { data: null, error: errorMessage };
  }
}

// Get user's bookings
export async function getUserBookings(): Promise<Result<BookingResponse[]>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: "User not authenticated" };
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        events(event_name),
        booking_tickets(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      return { data: null, error: error.message };
    }
    
    const bookings: BookingResponse[] = (data || []).map(booking => ({
      bookingId: booking.id,
      bookingReference: booking.booking_reference,
      totalAmount: booking.total_amount,
      currency: booking.currency,
      status: booking.booking_status,
      qrCode: booking.qr_code
    }));
    
    return { data: bookings, error: null };
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";
    return { data: null, error: errorMessage };
  }
}

// Get event tickets for purchase
export async function getEventTickets(eventId: string) {
  try {
    const { data, error } = await supabase
      .from('event_tickets')
      .select('*')
      .eq('event_id', eventId)
      .eq('status', 'active')
      .order('price', { ascending: true });
      
    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data: data || [], error: null };
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";
    return { data: null, error: errorMessage };
  }
}
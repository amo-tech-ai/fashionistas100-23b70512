-- Create bookings table for the booking flow
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_id UUID NOT NULL REFERENCES public.events(id),
  booking_status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  booking_reference TEXT UNIQUE DEFAULT CONCAT('BK-', UPPER(LEFT(gen_random_uuid()::text, 8))),
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  attendee_phone TEXT,
  special_requests TEXT,
  qr_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create booking_tickets table for individual ticket selections
CREATE TABLE public.booking_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES public.event_tickets(id),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0 AND quantity <= 10),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Event organizers can view event bookings" 
ON public.bookings 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.events 
  WHERE events.id = bookings.event_id 
  AND events.organizer_id = auth.uid()
));

-- RLS Policies for booking_tickets
CREATE POLICY "Users can view their booking tickets" 
ON public.booking_tickets 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.bookings 
  WHERE bookings.id = booking_tickets.booking_id 
  AND bookings.user_id = auth.uid()
));

CREATE POLICY "Users can create booking tickets" 
ON public.booking_tickets 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.bookings 
  WHERE bookings.id = booking_tickets.booking_id 
  AND (bookings.user_id = auth.uid() OR bookings.user_id IS NULL)
));

-- Add indexes for performance
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_event_id ON public.bookings(event_id);
CREATE INDEX idx_booking_tickets_booking_id ON public.booking_tickets(booking_id);

-- Function to update booking total
CREATE OR REPLACE FUNCTION update_booking_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.bookings 
  SET total_amount = (
    SELECT COALESCE(SUM(total_price), 0)
    FROM public.booking_tickets 
    WHERE booking_id = NEW.booking_id
  ),
  updated_at = now()
  WHERE id = NEW.booking_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update booking total when tickets are added/updated
CREATE TRIGGER trigger_update_booking_total
  AFTER INSERT OR UPDATE OR DELETE ON public.booking_tickets
  FOR EACH ROW EXECUTE FUNCTION update_booking_total();
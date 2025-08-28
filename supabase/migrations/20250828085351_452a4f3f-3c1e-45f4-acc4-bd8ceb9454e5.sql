-- Fix the function search path issue
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
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;
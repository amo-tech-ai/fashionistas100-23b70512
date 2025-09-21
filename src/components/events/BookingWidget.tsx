import { useState, useEffect } from "react";
import { ShoppingCart, CreditCard, User, Mail, Phone, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TicketSelector } from "./TicketSelector";
import { EventSummary } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TicketTier {
  id: string;
  ticket_name: string;
  ticket_type: string;
  description: string | null;
  price: number;
  currency: string;
  total_quantity: number;
  sold_quantity: number;
  available_quantity: number;
  status: string;
}

interface TicketSelection {
  [ticketId: string]: number;
}

interface BookingWidgetProps {
  event: EventSummary;
  tickets: TicketTier[];
  className?: string;
}

interface AttendeeInfo {
  name: string;
  email: string;
  phone: string;
  specialRequests: string;
}

export const BookingWidget = ({ event, tickets, className }: BookingWidgetProps) => {
  const [selection, setSelection] = useState<TicketSelection>({});
  const [attendeeInfo, setAttendeeInfo] = useState<AttendeeInfo>({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [isBooking, setIsBooking] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const { toast } = useToast();

  const getTotalPrice = () => {
    return Object.entries(selection).reduce((total, [ticketId, quantity]) => {
      const ticket = tickets.find(t => t.id === ticketId);
      return total + (ticket ? ticket.price * quantity : 0);
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(selection).reduce((sum, qty) => sum + qty, 0);
  };

  const getProcessingFee = () => {
    const subtotal = getTotalPrice();
    return subtotal * 0.029 + 0.30; // 2.9% + $0.30 processing fee
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getProcessingFee();
  };

  const getSelectedTicketsDetails = () => {
    return Object.entries(selection).map(([ticketId, quantity]) => {
      const ticket = tickets.find(t => t.id === ticketId);
      return ticket ? { ticket, quantity } : null;
    }).filter(Boolean);
  };

  const handleProceedToCheckout = () => {
    if (getTotalTickets() === 0) {
      toast({
        title: "No tickets selected",
        description: "Please select at least one ticket to continue.",
        variant: "destructive",
      });
      return;
    }
    setShowForm(true);
  };

  const validateForm = (): boolean => {
    if (!attendeeInfo.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!attendeeInfo.email.trim() || !attendeeInfo.email.includes('@')) {
      toast({
        title: "Valid email required",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleBooking = async () => {
    if (!validateForm()) return;

    setIsBooking(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user?.id || null,
          event_id: event.id,
          attendee_name: attendeeInfo.name,
          attendee_email: attendeeInfo.email,
          attendee_phone: attendeeInfo.phone || null,
          special_requests: attendeeInfo.specialRequests || null,
          currency: tickets[0]?.currency || 'USD',
          booking_status: 'confirmed'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create booking tickets
      const bookingTickets = getSelectedTicketsDetails().map(item => ({
        booking_id: booking.id,
        ticket_id: item!.ticket.id,
        quantity: item!.quantity,
        unit_price: item!.ticket.price,
        total_price: item!.ticket.price * item!.quantity
      }));

      const { error: ticketsError } = await supabase
        .from('booking_tickets')
        .insert(bookingTickets);

      if (ticketsError) throw ticketsError;

      // Success
      setBookingReference(booking.booking_reference);
      setBookingComplete(true);
      
      toast({
        title: "Booking confirmed!",
        description: `Your booking reference is ${booking.booking_reference}`,
      });

    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking failed",
        description: error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const resetBooking = () => {
    setSelection({});
    setAttendeeInfo({ name: '', email: '', phone: '', specialRequests: '' });
    setShowForm(false);
    setBookingComplete(false);
    setBookingReference('');
  };

  if (bookingComplete) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h3 className="text-xl font-playfair font-bold mb-2">Booking Confirmed!</h3>
          <p className="text-muted-foreground mb-4">
            Thank you for your booking. You'll receive a confirmation email shortly.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="font-semibold">Booking Reference:</p>
            <p className="text-lg font-mono">{bookingReference}</p>
          </div>
          <Button onClick={resetBooking} variant="outline" className="w-full">
            Book Another Event
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          {showForm ? 'Booking Details' : 'Book Tickets'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!showForm ? (
          <>
            <TicketSelector
              tickets={tickets}
              selection={selection}
              onSelectionChange={setSelection}
            />

            {getTotalTickets() > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold">Order Summary</h4>
                  {getSelectedTicketsDetails().map(item => (
                    <div key={item!.ticket.id} className="flex justify-between text-sm">
                      <span>{item!.quantity}x {item!.ticket.ticket_name}</span>
                      <span>${(item!.ticket.price * item!.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Processing fee</span>
                    <span>${getProcessingFee().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button onClick={handleProceedToCheckout} className="w-full" size="lg">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold mb-2">Your Order</h4>
              {getSelectedTicketsDetails().map(item => (
                <div key={item!.ticket.id} className="flex justify-between text-sm">
                  <span>{item!.quantity}x {item!.ticket.ticket_name}</span>
                  <span>${(item!.ticket.price * item!.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${getFinalTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Attendee Information */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Attendee Information
              </h4>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={attendeeInfo.name}
                    onChange={(e) => setAttendeeInfo({...attendeeInfo, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={attendeeInfo.email}
                    onChange={(e) => setAttendeeInfo({...attendeeInfo, email: e.target.value})}
                    placeholder="Enter your email address"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={attendeeInfo.phone}
                    onChange={(e) => setAttendeeInfo({...attendeeInfo, phone: e.target.value})}
                    placeholder="Enter your phone number"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="requests">Special Requests</Label>
                  <Textarea
                    id="requests"
                    value={attendeeInfo.specialRequests}
                    onChange={(e) => setAttendeeInfo({...attendeeInfo, specialRequests: e.target.value})}
                    placeholder="Any special dietary requirements or accessibility needs?"
                    className="mt-1 min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Notice */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900">Payment Processing</p>
                  <p className="text-blue-700">
                    This is a demo booking system. In a real implementation, this would integrate with a payment processor like Stripe.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleBooking} 
                disabled={isBooking}
                className="flex-1"
              >
                {isBooking ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
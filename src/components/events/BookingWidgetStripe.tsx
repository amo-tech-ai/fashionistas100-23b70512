import { useState } from "react";
import { ShoppingCart, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TicketSelector } from "./TicketSelector";
import { StripeCheckout } from "@/components/payments/StripeCheckout";
import { EventSummary } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
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
  const [showForm, setShowForm] = useState(false);
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
    return subtotal * 0.029 + 0.30; // 2.9% + $0.30 Stripe fee
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

  const getTicketTypeName = () => {
    const selectedTickets = getSelectedTicketsDetails();
    if (selectedTickets.length === 0) return '';
    if (selectedTickets.length === 1) {
      return selectedTickets[0]!.ticket.ticket_name;
    }
    return 'Multiple Tickets';
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

  const handleConfirmBooking = async () => {
    if (!validateForm()) return;
    
    // Store attendee info for later use
    localStorage.setItem('attendeeInfo', JSON.stringify(attendeeInfo));
    localStorage.setItem('eventBooking', JSON.stringify({
      eventId: event.id,
      eventTitle: event.title,
      tickets: getSelectedTicketsDetails(),
      totalAmount: getFinalTotal()
    }));
    
    // Show Stripe checkout
    setShowStripeCheckout(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      // Create booking in database
      const bookingData = {
        event_id: event.id,
        user_id: attendeeInfo.email, // In production, use actual user ID
        booking_date: new Date().toISOString(),
        booking_reference: `BK${Date.now()}`,
        total_amount: getFinalTotal(),
        payment_status: 'completed',
        attendee_name: attendeeInfo.name,
        attendee_email: attendeeInfo.email,
        attendee_phone: attendeeInfo.phone,
        special_requests: attendeeInfo.specialRequests,
        status: 'confirmed'
      };

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;

      // Navigate to success page
      navigate(`/booking-success?ref=${booking.id}`);
      
    } catch (error) {
      console.error('Error saving booking:', error);
      // Still navigate to success page even if DB save fails
      navigate('/booking-success');
    }
  };

  const handleCancelCheckout = () => {
    setShowStripeCheckout(false);
    setShowForm(false);
  };

  // Show Stripe Checkout
  if (showStripeCheckout) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Secure Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StripeCheckout
            amount={getFinalTotal()}
            currency="usd"
            eventTitle={event.title}
            ticketType={getTicketTypeName()}
            quantity={getTotalTickets()}
            onSuccess={handlePaymentSuccess}
            onCancel={handleCancelCheckout}
          />
        </CardContent>
      </Card>
    );
  }

  // Show booking form
  if (showForm) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Booking Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Your Order</h4>
              {getSelectedTicketsDetails().map(item => (
                <div key={item!.ticket.id} className="flex justify-between text-sm">
                  <span>{item!.quantity}x {item!.ticket.ticket_name}</span>
                  <span>${(item!.ticket.price * item!.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${getFinalTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Attendee Information
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={attendeeInfo.name}
                  onChange={(e) => setAttendeeInfo({...attendeeInfo, name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={attendeeInfo.email}
                  onChange={(e) => setAttendeeInfo({...attendeeInfo, email: e.target.value})}
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={attendeeInfo.phone}
                  onChange={(e) => setAttendeeInfo({...attendeeInfo, phone: e.target.value})}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requests">Special Requests</Label>
                <Textarea
                  id="requests"
                  value={attendeeInfo.specialRequests}
                  onChange={(e) => setAttendeeInfo({...attendeeInfo, specialRequests: e.target.value})}
                  placeholder="Any special dietary requirements or accessibility needs?"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleConfirmBooking}
              className="flex-1 bg-pink-600 hover:bg-pink-700"
            >
              Proceed to Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show ticket selection
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Book Tickets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
          </>
        )}

        <Button
          onClick={handleProceedToCheckout}
          disabled={getTotalTickets() === 0}
          className="w-full bg-pink-600 hover:bg-pink-700"
          size="lg"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Proceed to Checkout
        </Button>

        {getTotalTickets() === 0 && (
          <p className="text-sm text-center text-muted-foreground">
            Select at least one ticket to continue
          </p>
        )}
      </CardContent>
    </Card>
  );
};
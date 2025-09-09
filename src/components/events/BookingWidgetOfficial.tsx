// BOOKING WIDGET WITH OFFICIAL STRIPE INTEGRATION
// Following Stripe's official React documentation patterns

import { useState } from "react";
import { ShoppingCart, CreditCard, AlertCircle, CheckCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { TicketSelector } from "./TicketSelector";
import { StripeCheckoutOfficial } from "@/components/payments/StripeCheckoutOfficial";
import { EventSummary } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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

interface BookingWidgetOfficialProps {
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

export const BookingWidgetOfficial = ({ event, tickets, className }: BookingWidgetOfficialProps) => {
  const [selection, setSelection] = useState<TicketSelection>({});
  const [attendeeInfo, setAttendeeInfo] = useState<AttendeeInfo>({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [currentStep, setCurrentStep] = useState<'tickets' | 'details' | 'payment' | 'success'>('tickets');
  const [bookingReference, setBookingReference] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Calculate totals
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
    return subtotal * 0.029 + 0.30; // Standard Stripe fee
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

  // Step 1: Select Tickets
  const handleProceedToDetails = () => {
    if (getTotalTickets() === 0) {
      toast({
        title: "No tickets selected",
        description: "Please select at least one ticket to continue.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep('details');
  };

  // Step 2: Enter Details
  const validateAttendeeInfo = () => {
    if (!attendeeInfo.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!attendeeInfo.email.trim() || !/\S+@\S+\.\S+/.test(attendeeInfo.email)) {
      toast({
        title: "Valid email required",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleProceedToPayment = () => {
    if (!validateAttendeeInfo()) {
      return;
    }
    
    // Store attendee info for later use
    sessionStorage.setItem('attendeeInfo', JSON.stringify(attendeeInfo));
    sessionStorage.setItem('ticketSelection', JSON.stringify(selection));
    
    setCurrentStep('payment');
  };

  // Step 3: Payment Success Handler
  const handlePaymentSuccess = async () => {
    // Generate booking reference
    const reference = `FOS-${Date.now().toString(36).toUpperCase()}`;
    setBookingReference(reference);
    
    // Clear session storage
    sessionStorage.removeItem('attendeeInfo');
    sessionStorage.removeItem('ticketSelection');
    
    // Show success
    setCurrentStep('success');
    
    toast({
      title: "Payment successful!",
      description: `Your booking reference is ${reference}`,
    });
    
    // TODO: Save booking to database via API
    // This would typically involve calling your backend to:
    // 1. Create booking record
    // 2. Send confirmation email
    // 3. Generate tickets/QR codes
  };

  const handlePaymentCancel = () => {
    setCurrentStep('details');
  };

  const resetBooking = () => {
    setSelection({});
    setAttendeeInfo({ name: '', email: '', phone: '', specialRequests: '' });
    setCurrentStep('tickets');
    setBookingReference('');
  };

  // Render Success State
  if (currentStep === 'success') {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
          <p className="text-muted-foreground mb-4">
            Thank you for your booking. You'll receive a confirmation email shortly.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
            <p className="font-semibold">Booking Reference:</p>
            <p className="text-lg font-mono">{bookingReference}</p>
          </div>
          <div className="space-y-2">
            <Button onClick={() => navigate('/dashboard/tickets')} className="w-full">
              View My Tickets
            </Button>
            <Button onClick={resetBooking} variant="outline" className="w-full">
              Book Another Event
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render Payment Step (Using Official Stripe Component)
  if (currentStep === 'payment') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Secure Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StripeCheckoutOfficial
            amount={getFinalTotal()}
            currency="usd"
            eventTitle={event.title}
            ticketType={getTicketTypeName()}
            quantity={getTotalTickets()}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
            metadata={{
              eventId: event.id,
              eventSlug: event.slug || '',
              customerName: attendeeInfo.name,
              customerEmail: attendeeInfo.email,
              customerPhone: attendeeInfo.phone,
              specialRequests: attendeeInfo.specialRequests
            }}
          />
        </CardContent>
      </Card>
    );
  }

  // Render Details Step
  if (currentStep === 'details') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Booking Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Your Order</h4>
            {getSelectedTicketsDetails().map(item => (
              <div key={item!.ticket.id} className="flex justify-between text-sm">
                <span>{item!.quantity}x {item!.ticket.ticket_name}</span>
                <span>${(item!.ticket.price * item!.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Processing fee</span>
              <span>${getProcessingFee().toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
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
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={attendeeInfo.name}
                onChange={(e) => setAttendeeInfo({...attendeeInfo, name: e.target.value})}
                placeholder="Enter your full name"
                required
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
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={attendeeInfo.phone}
                onChange={(e) => setAttendeeInfo({...attendeeInfo, phone: e.target.value})}
                placeholder="Enter your phone number (optional)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requests">Special Requests</Label>
              <Textarea
                id="requests"
                value={attendeeInfo.specialRequests}
                onChange={(e) => setAttendeeInfo({...attendeeInfo, specialRequests: e.target.value})}
                placeholder="Any dietary requirements or accessibility needs?"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentStep('tickets')}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleProceedToPayment}
              className="flex-1 bg-pink-600 hover:bg-pink-700"
            >
              Proceed to Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render Ticket Selection Step (Default)
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
          onClick={handleProceedToDetails}
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
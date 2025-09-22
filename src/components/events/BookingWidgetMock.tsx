import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, CreditCard, CheckCircle } from 'lucide-react';

interface BookingWidgetMockProps {
  eventId: string;
  eventTitle?: string;
}

const BookingWidgetMock: React.FC<BookingWidgetMockProps> = ({ 
  eventId, 
  eventTitle = "Fashion Event" 
}) => {
  const [isBooking, setIsBooking] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Mock ticket data
  const ticketTiers = [
    {
      id: 'general',
      name: 'General Admission',
      price: 75000,
      available: 150,
      description: 'Access to main runway shows and exhibition area'
    },
    {
      id: 'vip',
      name: 'VIP Experience',
      price: 150000,
      available: 50,
      description: 'Front row seating, backstage access, welcome drink'
    },
    {
      id: 'premium',
      name: 'Premium Package',
      price: 300000,
      available: 20,
      description: 'All VIP benefits plus designer meet & greet, gift bag'
    }
  ];

  const handleBookTicket = async (tierId: string) => {
    setIsBooking(true);
    
    // Mock booking process
    setTimeout(() => {
      setIsBooking(false);
      setBookingComplete(true);
    }, 2000);
  };

  if (bookingComplete) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
          <p className="text-muted-foreground mb-4">
            Your ticket for {eventTitle} has been reserved.
          </p>
          <Button onClick={() => setBookingComplete(false)}>
            Book Another Ticket
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Book Tickets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ticketTiers.map((tier) => (
          <div key={tier.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{tier.name}</h3>
              <div className="text-right">
                <div className="font-bold text-lg">
                  ${tier.price.toLocaleString()} COP
                </div>
                <Badge variant="secondary" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {tier.available} left
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {tier.description}
            </p>
            
            <Button 
              onClick={() => handleBookTicket(tier.id)}
              disabled={isBooking || tier.available === 0}
              className="w-full"
            >
              {isBooking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Book Now
                </>
              )}
            </Button>
          </div>
        ))}
        
        <div className="text-xs text-muted-foreground text-center pt-4 border-t">
          Secure payment processing • Instant confirmation
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingWidgetMock;
import { useState } from 'react';
import { TicketPurchase } from '@/components/payments/TicketPurchase';
import { TicketDisplay } from '@/components/payments/TicketDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';

// Mock data for testing
const mockEvent = {
  id: 'event_123',
  title: 'Milan Fashion Week 2025',
  date: 'March 15, 2025 at 7:00 PM',
  venue: 'Palazzo delle Stelline',
  location: 'Milan, Italy',
  featuredImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop&crop=center'
};

const mockTicketTiers = [
  {
    id: 'general',
    name: 'General Admission',
    description: 'Standing room access to the main runway show',
    price: 75,
    currency: 'EUR',
    available: 50,
    maxPerCustomer: 4,
    benefits: [
      'Access to main runway show',
      'Standing room viewing',
      'Complimentary program',
      'Access to afterparty area'
    ],
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'vip',
    name: 'VIP Experience',
    description: 'Premium seating with exclusive perks',
    price: 200,
    currency: 'EUR',
    available: 25,
    maxPerCustomer: 2,
    benefits: [
      'Premium front row seating',
      'Welcome champagne reception',
      'Meet & greet with designers',
      'Exclusive gift bag',
      'VIP afterparty access',
      'Professional photos'
    ],
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'backstage',
    name: 'Backstage Pass',
    description: 'Behind-the-scenes access and runway viewing',
    price: 350,
    currency: 'EUR',
    available: 10,
    maxPerCustomer: 1,
    benefits: [
      'Exclusive backstage tour',
      'Watch models prepare',
      'Meet hair & makeup artists',
      'Premium front row seat',
      'Designer meet & greet',
      'Professional photoshoot',
      'Limited edition merchandise',
      'Private dinner with organizers'
    ],
    color: 'bg-pink-100 text-pink-800'
  }
];

const mockPurchasedTickets = [
  {
    id: 'ticket_001',
    eventId: 'event_123',
    eventTitle: 'Milan Fashion Week 2025',
    eventDate: 'March 15, 2025 at 7:00 PM',
    eventVenue: 'Palazzo delle Stelline',
    eventLocation: 'Milan, Italy',
    ticketType: 'VIP Experience',
    quantity: 2,
    totalAmount: 400,
    currency: 'EUR',
    qrCode: 'FASHION2025_VIP_001_ABC123',
    status: 'confirmed' as const,
    purchaseDate: 'February 20, 2025',
    metadata: {
      seatNumber: 'A1-A2',
      section: 'Front Row VIP',
      specialInstructions: 'Please arrive 30 minutes early for champagne reception'
    }
  }
];

export default function StripeTestPage() {
  const [currentView, setCurrentView] = useState<'purchase' | 'tickets' | 'success'>('purchase');
  const [purchasedTickets, setPurchasedTickets] = useState(mockPurchasedTickets);
  const [latestPurchase, setLatestPurchase] = useState<any>(null);

  const handlePurchaseComplete = (newTickets: any[]) => {
    // Simulate successful purchase
    const completedTickets = newTickets.map((ticket, index) => ({
      id: `ticket_${Date.now()}_${index}`,
      eventId: ticket.eventId,
      eventTitle: mockEvent.title,
      eventDate: mockEvent.date,
      eventVenue: mockEvent.venue,
      eventLocation: mockEvent.location,
      ticketType: ticket.tierName,
      quantity: ticket.quantity,
      totalAmount: ticket.totalAmount,
      currency: 'EUR',
      qrCode: `FASHION2025_${ticket.tierName?.toUpperCase().replace(/\s+/g, '_')}_${Date.now()}`,
      status: 'confirmed' as const,
      purchaseDate: new Date().toLocaleDateString(),
      metadata: {
        specialInstructions: 'Please arrive 15 minutes before the show starts',
        paymentMethod: 'stripe_test'
      }
    }));

    setPurchasedTickets([...purchasedTickets, ...completedTickets]);
    setLatestPurchase(completedTickets[0]);
    setCurrentView('success');
  };

  const handleDownloadTicket = (ticket: any) => {
    console.log('Downloading ticket:', ticket);
    // Implement actual download logic here
  };

  const handleShareTicket = (ticket: any) => {
    console.log('Sharing ticket:', ticket);
    // Implement actual share logic here
  };

  if (currentView === 'success' && latestPurchase) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader className="bg-green-50">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-2xl text-green-800">
                  Payment Successful!
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Your payment has been processed successfully.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Event:</p>
                        <p>{latestPurchase.eventTitle}</p>
                      </div>
                      <div>
                        <p className="font-medium">Ticket Type:</p>
                        <p>{latestPurchase.ticketType}</p>
                      </div>
                      <div>
                        <p className="font-medium">Quantity:</p>
                        <p>{latestPurchase.quantity}</p>
                      </div>
                      <div>
                        <p className="font-medium">Total Paid:</p>
                        <p className="font-bold text-green-600">
                          {latestPurchase.currency} {latestPurchase.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      onClick={() => setCurrentView('tickets')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      View My Tickets
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentView('purchase')}
                    >
                      Purchase More
                    </Button>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mt-6">
                    <h4 className="font-semibold text-blue-800 mb-2">🎉 Test Complete!</h4>
                    <p className="text-sm text-blue-700">
                      This was a simulated payment using Stripe test mode. In production, 
                      this would process a real payment and store the ticket in your database.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-pink-500" />
                Stripe Payment Test
              </h1>
              <p className="text-gray-600 mt-2">
                Test the complete ticket purchasing flow with Stripe integration
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={currentView === 'purchase' ? 'default' : 'outline'}
                onClick={() => setCurrentView('purchase')}
              >
                Purchase Tickets
              </Button>
              <Button
                variant={currentView === 'tickets' ? 'default' : 'outline'}
                onClick={() => setCurrentView('tickets')}
              >
                My Tickets ({purchasedTickets.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Test Environment Notice */}
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                TEST MODE
              </Badge>
              <p className="text-sm text-yellow-800">
                This is running in Stripe test mode. Use test card 4242 4242 4242 4242 with any future date and CVC.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {currentView === 'purchase' ? (
            <TicketPurchase
              event={mockEvent}
              ticketTiers={mockTicketTiers}
              onPurchaseComplete={handlePurchaseComplete}
            />
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('purchase')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Purchase
                </Button>
              </div>
              
              {purchasedTickets.length > 0 ? (
                <TicketDisplay
                  tickets={purchasedTickets}
                  onDownload={handleDownloadTicket}
                  onShare={handleShareTicket}
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Tickets Yet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      You haven't purchased any tickets yet. Go to the purchase page to buy your first ticket!
                    </p>
                    <Button onClick={() => setCurrentView('purchase')}>
                      Purchase Tickets
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Test Instructions */}
        <Card className="mt-8 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Test Card Numbers:</h4>
              <ul className="text-sm space-y-1 mt-2">
                <li><code className="bg-gray-100 px-2 py-1 rounded">4242 4242 4242 4242</code> - Successful payment</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">4000 0000 0000 0002</code> - Card declined</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">4000 0000 0000 9995</code> - Insufficient funds</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Other Test Data:</h4>
              <ul className="text-sm space-y-1 mt-2">
                <li>Use any future expiry date (e.g., 12/25)</li>
                <li>Use any 3-digit CVC (e.g., 123)</li>
                <li>Use any ZIP code (e.g., 12345)</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This demo uses simulated payments for testing the UI flow. 
                In production, this would connect to your actual Stripe account and process real payments.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
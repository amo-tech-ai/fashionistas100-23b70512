import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutForm } from './CheckoutForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Ticket, Clock, MapPin, Calendar } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface TicketTier {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  available: number;
  maxPerCustomer: number;
  benefits: string[];
  color: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  location: string;
  featuredImage: string;
}

interface TicketPurchaseProps {
  event: Event;
  ticketTiers: TicketTier[];
  onPurchaseComplete: (tickets: any[]) => void;
}

export function TicketPurchase({ event, ticketTiers, onPurchaseComplete }: TicketPurchaseProps) {
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleTierSelect = (tier: TicketTier) => {
    setSelectedTier(tier);
    setQuantity(1);
    setShowCheckout(false);
  };

  const handleQuantityChange = (change: number) => {
    if (!selectedTier) return;
    const newQuantity = Math.max(1, Math.min(selectedTier.maxPerCustomer, quantity + change));
    setQuantity(newQuantity);
  };

  const handleProceedToCheckout = () => {
    setShowCheckout(true);
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent);
    onPurchaseComplete([
      {
        eventId: event.id,
        tierName: selectedTier?.name,
        quantity,
        totalAmount: (selectedTier?.price || 0) * quantity,
        paymentIntentId: paymentIntent.id,
      }
    ]);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    setShowCheckout(false);
  };

  if (showCheckout && selectedTier) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Complete Purchase
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowCheckout(false)}
            className="self-start"
          >
            ← Back to ticket selection
          </Button>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              event={event}
              ticketType={selectedTier}
              quantity={quantity}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Event Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <img
              src={event.featuredImage}
              alt={event.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
              <div className="space-y-2 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {event.venue}, {event.location}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Tiers */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Tickets</h3>
        {ticketTiers.map((tier) => (
          <Card 
            key={tier.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTier?.id === tier.id ? 'ring-2 ring-pink-500 bg-pink-50' : ''
            }`}
            onClick={() => handleTierSelect(tier)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {tier.name}
                    <Badge className={tier.color}>
                      {tier.currency} {tier.price}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {tier.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {tier.available} available
                  </p>
                  <p className="text-xs text-gray-400">
                    Max {tier.maxPerCustomer} per person
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Includes:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quantity Selection */}
      {selectedTier && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{selectedTier.name}</p>
                <p className="text-sm text-gray-600">
                  {selectedTier.currency} {selectedTier.price} each
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= selectedTier.maxPerCustomer || quantity >= selectedTier.available}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-pink-600">
                {selectedTier.currency} {(selectedTier.price * quantity).toFixed(2)}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleProceedToCheckout}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              size="lg"
              disabled={selectedTier.available < quantity}
            >
              <Ticket className="w-4 h-4 mr-2" />
              Proceed to Checkout
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, CheckCircle } from 'lucide-react';

interface TicketType {
  id: string;
  name: string;
  price: number;
  currency: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
}

interface CheckoutFormProps {
  event: Event;
  ticketType: TicketType;
  quantity: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

export function CheckoutForm({ event, ticketType, quantity, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  const totalAmount = ticketType.price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError('Card element not found.');
      return;
    }

    setProcessing(true);
    setError(null);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // For demo purposes, simulate a successful payment
      // In production, this would call your backend API
      
      // Simulate checking card validation
      const cardResult = await stripe.createToken(card);
      
      if (cardResult.error) {
        throw new Error(cardResult.error.message || 'Card validation failed');
      }

      // Simulate successful payment intent
      const mockPaymentIntent = {
        id: `pi_test_${Date.now()}`,
        amount: Math.round(totalAmount * 100), // Amount in cents
        currency: ticketType.currency.toLowerCase(),
        status: 'succeeded',
        metadata: {
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.date,
          ticketType: ticketType.name,
          quantity: quantity.toString(),
        }
      };

      // Call success handler
      onSuccess(mockPaymentIntent);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900">{event.title}</h3>
          <p className="text-sm text-gray-600">{event.date}</p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm">{ticketType.name} × {quantity}</span>
            <span className="font-semibold">
              {ticketType.currency} {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-md p-3 bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
              onChange={handleCardChange}
            />
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!stripe || processing || !cardComplete}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3"
        size="lg"
      >
        {processing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay {ticketType.currency} {totalAmount.toFixed(2)}
          </>
        )}
      </Button>

      <div className="bg-blue-50 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <CheckCircle className="h-4 w-4" />
          <span className="font-medium">Demo Mode Active</span>
        </div>
        <p className="text-xs text-blue-700 mt-1">
          This is a demo that simulates Stripe payment processing. 
          The card will be validated but no actual charge will be made.
        </p>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Your payment is secured by Stripe. We do not store your card information.
      </p>
    </form>
  );
}
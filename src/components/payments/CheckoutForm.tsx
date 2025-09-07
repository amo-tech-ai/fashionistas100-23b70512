import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard } from 'lucide-react';

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

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          ticketType: ticketType.id,
          quantity,
          amount: Math.round(totalAmount * 100), // Convert to cents
          currency: ticketType.currency.toLowerCase(),
          eventTitle: event.title,
          eventDate: event.date,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { client_secret } = await response.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card,
          billing_details: {
            name: 'Fashion Event Attendee', // TODO: Get from user form
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Payment failed');
      } else {
        // Payment succeeded
        onSuccess(result.paymentIntent);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setProcessing(false);
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
        disabled={!stripe || processing}
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

      <p className="text-xs text-gray-500 text-center">
        Your payment is secured by Stripe. We do not store your card information.
      </p>
    </form>
  );
}

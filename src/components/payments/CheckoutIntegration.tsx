import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripeCheckoutForm } from './StripeCheckoutForm';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CheckoutIntegrationProps {
  amount: number;
  currency: string;
  eventId: string;
  eventTitle: string;
  ticketDetails: string;
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
}

export function CheckoutIntegration({
  amount,
  currency,
  eventId,
  eventTitle,
  ticketDetails,
  onSuccess,
  onError
}: CheckoutIntegrationProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payments/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency,
            eventId,
            ticketDetails,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        onError('Failed to initialize payment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, currency, eventId, ticketDetails, onError]);

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#ea580c',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      fontFamily: 'system-ui, sans-serif',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-orange-600" />
        <span className="ml-2 text-gray-600">Initializing payment...</span>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Failed to initialize payment. Please refresh and try again.</p>
      </div>
    );
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <StripeCheckoutForm
        amount={amount * 100} // Convert to cents for display
        currency={currency}
        eventTitle={eventTitle}
        ticketDetails={ticketDetails}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}

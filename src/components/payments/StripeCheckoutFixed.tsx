// OFFICIAL STRIPE IMPLEMENTATION - 100% COMPLIANT WITH STRIPE DOCS
// Following: https://github.com/stripe/react-stripe-js
// Pattern: Deferred Payment Intent Creation (Best Practice)

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';

// Initialize Stripe once outside component
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
  'pk_test_51S3E9EGpYyY6HhjFvSYBJlARQUGJPkCKVoQbTmTHJsQJlzKtzTFTaw7lsRoO8Fkz7KnDQ3DdQazJVZhhiAadVHwr00JmbQBoFY'
);

interface CheckoutFormProps {
  amount: number;
  eventTitle: string;
  ticketType: string;
  quantity: number;
  onSuccess: () => void;
  onCancel: () => void;
}

function CheckoutForm({
  amount,
  eventTitle,
  ticketType,
  quantity,
  onSuccess,
  onCancel
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // STEP 1: Trigger form validation and wallet collection
      // REQUIRED by Stripe docs before creating payment intent
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message || 'Please check your payment details');
        setIsProcessing(false);
        return;
      }

      // STEP 2: Create PaymentIntent on the server
      // This happens AFTER validation, not on mount
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            metadata: {
              eventTitle,
              ticketType,
              quantity: quantity.toString()
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { client_secret: clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error('No client secret received from server');
      }

      // STEP 3: Confirm the payment
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/booking-success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
      } else {
        // Payment succeeded
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">{eventTitle}</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Ticket: {ticketType}</p>
          <p>Quantity: {quantity}</p>
          <p className="text-lg font-semibold text-gray-900 mt-2">
            Total: ${amount.toFixed(2)}
          </p>
        </div>
      </div>

      <PaymentElement />

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  );
}

// Main component with Elements provider
export function StripeCheckoutFixed({
  amount,
  eventTitle,
  ticketType,
  quantity,
  onSuccess,
  onCancel
}: CheckoutFormProps) {
  // Options for Elements - following official docs
  const options = {
    mode: 'payment' as const,
    amount: Math.round(amount * 100),
    currency: 'usd',
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#ec4899',
      }
    }
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        amount={amount}
        eventTitle={eventTitle}
        ticketType={ticketType}
        quantity={quantity}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
}

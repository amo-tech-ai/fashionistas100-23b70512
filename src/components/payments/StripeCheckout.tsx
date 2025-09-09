import React, { useState, useEffect } from 'react';
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

// Load Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51S3E9EGpYyY6HhjFvSYBJlARQUGJPkCKVoQbTmTHJsQJlzKtzTFTaw7lsRoO8Fkz7KnDQ3DdQazJVZhhiAadVHwr00JmbQBoFY');

interface StripeCheckoutProps {
  amount: number;
  currency?: string;
  eventTitle: string;
  ticketType: string;
  quantity: number;
  onSuccess: () => void;
  onCancel: () => void;
}

function CheckoutForm({ amount, eventTitle, ticketType, quantity, onSuccess }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking-success`,
      },
      redirect: 'if_required'
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setProcessing(false);
    } else {
      setSucceeded(true);
      setProcessing(false);
      setTimeout(() => {
        onSuccess();
      }, 2000);
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

      <PaymentElement 
        options={{
          layout: 'tabs',
          defaultValues: {
            billingDetails: {
              email: 'customer@example.com'
            }
          }
        }}
      />

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {succeeded && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Payment successful! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!stripe || processing || succeeded}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white"
        size="lg"
      >
        {processing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : succeeded ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Payment Successful!
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </Button>

      <p className="text-xs text-center text-gray-500">
        Powered by Stripe • Your payment info is secure
      </p>
    </form>
  );
}

export function StripeCheckout({
  amount,
  currency = 'usd',
  eventTitle,
  ticketType,
  quantity,
  onSuccess,
  onCancel
}: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create payment intent on component mount
    fetch('http://localhost:8000/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency,
        metadata: {
          eventTitle,
          ticketType,
          quantity: quantity.toString()
        }
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setLoading(false);
        } else {
          throw new Error(data.error || 'Failed to create payment intent');
        }
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [amount, currency, eventTitle, ticketType, quantity]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
        <span className="ml-2">Initializing payment...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button 
            onClick={onCancel} 
            variant="outline" 
            size="sm" 
            className="ml-4"
          >
            Go Back
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#db2777',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '8px'
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            amount={amount}
            eventTitle={eventTitle}
            ticketType={ticketType}
            quantity={quantity}
            onSuccess={onSuccess}
          />
        </Elements>
      )}
      
      <button
        onClick={onCancel}
        className="w-full mt-4 text-sm text-gray-600 hover:text-gray-900 underline"
      >
        Cancel and return
      </button>
    </div>
  );
}
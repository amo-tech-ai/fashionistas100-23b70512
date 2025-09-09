import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';

interface StripeCheckoutFormProps {
  amount: number;
  currency: string;
  eventTitle: string;
  ticketDetails: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

export function StripeCheckoutForm({ 
  amount, 
  currency, 
  eventTitle, 
  ticketDetails, 
  onSuccess, 
  onError 
}: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage('Stripe is not ready yet. Please try again.');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Confirm the payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || 'Payment failed');
          onError(error.message || 'Payment failed');
        } else {
          setMessage('An unexpected error occurred');
          onError('An unexpected error occurred');
        }
      } else {
        // Payment succeeded
        setMessage('Payment successful!');
        onSuccess({ status: 'succeeded' });
      }
    } catch (err) {
      setMessage('Payment processing failed');
      onError('Payment processing failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Your Purchase</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Event:</strong> {eventTitle}</p>
          <p><strong>Tickets:</strong> {ticketDetails}</p>
          <p className="text-lg font-semibold text-gray-900">
            <strong>Total: {currency.toUpperCase()} {(amount / 100).toFixed(2)}</strong>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-md">
          <PaymentElement 
            options={{
              layout: 'tabs'
            }}
          />
        </div>

        {message && (
          <Alert className={message.includes('successful') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {message.includes('successful') ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.includes('successful') ? 'text-green-800' : 'text-red-800'}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          disabled={isLoading || !stripe || !elements}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-base font-medium"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Pay {currency.toUpperCase()} {(amount / 100).toFixed(2)}
            </div>
          )}
        </Button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>🔒 Your payment information is secure and encrypted</p>
      </div>
    </div>
  );
}

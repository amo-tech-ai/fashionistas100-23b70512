// OFFICIAL STRIPE IMPLEMENTATION - Following Stripe Documentation Exactly
// Reference: https://github.com/stripe/react-stripe-js
// This implementation follows the official Stripe Payment Element integration guide

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

// Initialize Stripe outside of component to avoid re-creating on every render
// As per official docs: https://docs.stripe.com/sdks/stripejs-react
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
  'pk_test_51S3E9EGpYyY6HhjFvSYBJlARQUGJPkCKVoQbTmTHJsQJlzKtzTFTaw7lsRoO8Fkz7KnDQ3DdQazJVZhhiAadVHwr00JmbQBoFY'
);

// Props interface
interface StripeCheckoutOfficialProps {
  amount: number;
  currency?: string;
  eventTitle: string;
  ticketType: string;
  quantity: number;
  onSuccess: () => void;
  onCancel: () => void;
  metadata?: Record<string, string>;
}

// Internal Checkout Form Component - Following official Stripe pattern
function CheckoutForm({ 
  amount, 
  eventTitle, 
  ticketType, 
  quantity, 
  onSuccess,
  onCancel,
  metadata = {}
}: StripeCheckoutOfficialProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // STEP 1: Trigger form validation and wallet collection
    // This is REQUIRED by Stripe docs before creating payment intent
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message || 'Please check your payment details');
      setIsProcessing(false);
      return;
    }

    // STEP 2: Create PaymentIntent on the server
    // This should happen AFTER form validation, not on component mount
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'usd',
          metadata: {
            eventTitle,
            ticketType,
            quantity: quantity.toString(),
            ...metadata
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error('No client secret received from server');
      }

      // STEP 3: Confirm the payment using the client secret
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/booking-success`,
          payment_method_data: {
            billing_details: {
              // Add billing details if collected
            }
          }
        },
        // Use redirect: 'if_required' to handle the payment in-page when possible
        redirect: 'if_required'
      });

      if (confirmError) {
        // Show error to customer
        setErrorMessage(confirmError.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
      } else {
        // Payment succeeded
        setSucceeded(true);
        setIsProcessing(false);
        
        // Call success callback after a brief delay
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred. Please try again.'
      );
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">{eventTitle}</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>Ticket: {ticketType}</p>
          <p>Quantity: {quantity}</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
            Total: ${amount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Payment Element - Stripe's prebuilt UI component */}
      <PaymentElement 
        options={{
          layout: 'tabs',
          defaultValues: {
            billingDetails: {
              // Pre-fill if you have customer info
            }
          }
        }}
      />

      {/* Error Message Display */}
      {errorMessage && !succeeded && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {succeeded && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Payment successful! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing || succeeded}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white"
        size="lg"
      >
        {isProcessing ? (
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

      {/* Cancel Link */}
      <button
        type="button"
        onClick={onCancel}
        className="w-full text-sm text-gray-600 hover:text-gray-900 underline"
        disabled={isProcessing}
      >
        Cancel and return
      </button>

      {/* Stripe Branding */}
      <p className="text-xs text-center text-gray-500">
        Powered by Stripe • Your payment info is secure and encrypted
      </p>
    </form>
  );
}

// Main Export Component - Wrapper with Elements Provider
export function StripeCheckoutOfficial({
  amount,
  currency = 'usd',
  eventTitle,
  ticketType,
  quantity,
  onSuccess,
  onCancel,
  metadata
}: StripeCheckoutOfficialProps) {
  // Elements options - Following official Stripe docs pattern
  // Do NOT pass clientSecret here - it should be created on form submission
  const options = {
    mode: 'payment' as const,
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    // Appearance customization
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#db2777', // Pink to match your brand
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
        fontSizeBase: '16px'
      },
      rules: {
        '.Tab': {
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
        '.Tab:hover': {
          border: '1px solid #d1d5db',
        },
        '.Tab--selected': {
          borderColor: '#db2777',
          boxShadow: '0 1px 2px 0 rgba(219, 39, 119, 0.1)',
        },
        '.Input': {
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
        '.Input:focus': {
          boxShadow: '0 1px 2px 0 rgba(219, 39, 119, 0.1)',
        }
      }
    },
    // Automatically detect customer's preferred payment methods
    paymentMethodCreation: 'manual' as const,
  };

  return (
    <div className="max-w-md mx-auto">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm
          amount={amount}
          currency={currency}
          eventTitle={eventTitle}
          ticketType={ticketType}
          quantity={quantity}
          onSuccess={onSuccess}
          onCancel={onCancel}
          metadata={metadata}
        />
      </Elements>
    </div>
  );
}

// Export a hook for advanced usage
export function useStripeCheckout() {
  const stripe = useStripe();
  const elements = useElements();
  
  return {
    stripe,
    elements,
    isReady: !!stripe && !!elements
  };
}
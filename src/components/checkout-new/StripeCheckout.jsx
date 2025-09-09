import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import STRIPE_PRODUCTS from '../../config/stripe-products';
import './StripeCheckout.css';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51S3E9EGpYyY6HhjF8WyNVMTNk8AVGdmOKCA2iRxhMJvFfpOcB8EYrLWtvLQzN4kVCjJQzoVhBw0bwNBCRKLVygvT00i9NGyPTP');

// API base URL - connects to our running server
const API_URL = 'http://localhost:4242';

function CheckoutForm({ amount, eventId, ticketType, eventName, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setErrorMessage(null);

    // Validate form
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setProcessing(false);
      return;
    }

    try {
      // Create payment intent on our server
      const response = await fetch(`${API_URL}/api/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          eventId,
          ticketType,
          eventName,
          email: 'test@fashionos.com', // In production, get from user input
          userId: 'test-user-001'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // Confirm payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret: data.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setErrorMessage(confirmError.message);
      } else if (paymentIntent?.status === 'succeeded') {
        setSucceeded(true);
        if (onSuccess) {
          onSuccess(paymentIntent);
        }
      }
    } catch (error) {
      setErrorMessage(error.message || 'Payment failed');
    }

    setProcessing(false);
  };

  if (succeeded) {
    return (
      <div className="payment-success">
        <div className="success-icon">✓</div>
        <h2>Payment Successful!</h2>
        <p>Your ticket has been confirmed. Check your email for details.</p>
        <p className="success-details">
          Event: {eventName}<br />
          Ticket Type: {ticketType}<br />
          Amount: ${amount}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="submit-button"
      >
        {processing ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
}

export default function StripeCheckout({ 
  amount, 
  eventId, 
  eventName, 
  ticketType = 'general',
  onSuccess 
}) {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get product details from configuration
  const product = STRIPE_PRODUCTS.tickets[ticketType.toLowerCase()] || STRIPE_PRODUCTS.tickets.general;

  useEffect(() => {
    // Create PaymentIntent when component loads
    const createPaymentIntent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/create-payment-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amount || product.amount,
            eventId,
            ticketType,
            eventName,
            email: 'test@fashionos.com',
            userId: 'test-user-001'
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to initialize payment');
        }

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, eventId, ticketType, eventName, product.amount]);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#000000',
        borderRadius: '8px',
        fontFamily: 'system-ui, sans-serif',
      },
    },
  };

  if (loading) {
    return (
      <div className="stripe-checkout-container">
        <div className="loading">Initializing payment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stripe-checkout-container">
        <div className="error-message">
          Error: {error}
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="stripe-checkout-container">
      <div className="checkout-header">
        <h1>Complete Your Purchase</h1>
        <p className="event-details">{eventName}</p>
      </div>
      
      <div className="checkout-content">
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-item">
            <span>Event:</span>
            <span>{eventName}</span>
          </div>
          <div className="summary-item">
            <span>Ticket Type:</span>
            <span>{product.name}</span>
          </div>
          <div className="summary-item">
            <span>Description:</span>
            <span className="description">{product.description}</span>
          </div>
          <div className="summary-item">
            <span>Quantity:</span>
            <span>1</span>
          </div>
          <div className="summary-total">
            <span>Total:</span>
            <span>${amount || product.amount}</span>
          </div>
        </div>

        <div className="payment-section">
          {clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm
                amount={amount || product.amount}
                eventId={eventId}
                eventName={eventName}
                ticketType={ticketType}
                onSuccess={onSuccess}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
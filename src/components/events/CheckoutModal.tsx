import React, { useState } from 'react';
import { CheckoutIntegration } from '@/components/payments/CheckoutIntegration';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  orderSummary: {
    tickets: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    processingFee: number;
    total: number;
  };
  attendeeInfo: {
    fullName: string;
    email: string;
    phone?: string;
    specialRequests?: string;
  };
}

export function CheckoutModal({ 
  isOpen, 
  onClose, 
  eventId, 
  eventTitle, 
  orderSummary, 
  attendeeInfo 
}: CheckoutModalProps) {
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment'>('details');

  const handleSuccess = (result: any) => {
    // Redirect to success page
    window.location.href = '/booking-success?payment_intent=' + result.id;
  };

  const handleError = (error: string) => {
    console.error('Payment error:', error);
    // You can show an error toast here
  };

  const ticketDetails = orderSummary.tickets
    .map(ticket => `${ticket.quantity}x ${ticket.name}`)
    .join(', ');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            {paymentStep === 'details' ? 'Booking Details' : 'Payment'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {paymentStep === 'details' ? (
          <div className="space-y-6">
            {/* Order Summary */}
            <div>
              <h3 className="font-semibold mb-4">Your Order</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {orderSummary.tickets.map((ticket, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{ticket.quantity}x {ticket.name}</span>
                    <span>${(ticket.price * ticket.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing fee</span>
                    <span>${orderSummary.processingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendee Information */}
            <div>
              <h3 className="font-semibold mb-4">Attendee Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <span className="font-medium">Name:</span> {attendeeInfo.fullName}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {attendeeInfo.email}
                </div>
                {attendeeInfo.phone && (
                  <div>
                    <span className="font-medium">Phone:</span> {attendeeInfo.phone}
                  </div>
                )}
                {attendeeInfo.specialRequests && (
                  <div>
                    <span className="font-medium">Special Requests:</span> {attendeeInfo.specialRequests}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={() => setPaymentStep('payment')}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back button */}
            <Button 
              variant="ghost" 
              onClick={() => setPaymentStep('details')}
              className="p-0 h-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Details
            </Button>

            {/* Stripe Checkout */}
            <CheckoutIntegration
              amount={orderSummary.total}
              currency="usd"
              eventId={eventId}
              eventTitle={eventTitle}
              ticketDetails={ticketDetails}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const [ticketDetails, setTicketDetails] = useState<any>(null);

  useEffect(() => {
    // In a real app, you'd fetch the booking details from your database
    // using the payment_intent or session_id from the URL params
    const paymentIntent = searchParams.get('payment_intent');
    
    // Mock ticket details for demo
    setTicketDetails({
      eventTitle: 'Fashion Week VIP Experience',
      ticketType: 'VIP Access',
      quantity: 2,
      totalAmount: 498.00,
      bookingReference: 'FW-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      eventDate: 'September 15, 2025',
      eventTime: '7:00 PM',
      venue: 'Grand Fashion Center, New York'
    });
  }, [searchParams]);

  if (!ticketDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your booking confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your fashion event tickets have been successfully purchased.</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking Reference</span>
                <span className="font-mono font-semibold">{ticketDetails.bookingReference}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Event</span>
                <span className="font-semibold text-right">{ticketDetails.eventTitle}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tickets</span>
                <span>{ticketDetails.quantity}x {ticketDetails.ticketType}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time</span>
                <span>{ticketDetails.eventDate} at {ticketDetails.eventTime}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Venue</span>
                <span className="text-right">{ticketDetails.venue}</span>
              </div>
              
              <div className="flex justify-between text-lg font-semibold pt-4 border-t">
                <span>Total Paid</span>
                <span>${ticketDetails.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 mt-6">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">Confirmation Email Sent</p>
                <p className="text-sm text-orange-700">Check your email for your digital tickets and event details.</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <Button asChild className="flex-1">
              <Link to="/events" className="flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Browse More Events
              </Link>
            </Button>
            
            <Button variant="outline" className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              Add to Calendar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

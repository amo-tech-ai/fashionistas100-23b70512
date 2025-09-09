import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Ticket, 
  Download, 
  Share2, 
  Calendar, 
  MapPin, 
  Clock,
  QrCode,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import QRCode from 'qrcode';

interface TicketData {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  eventLocation: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  currency: string;
  qrCode: string;
  status: 'confirmed' | 'used' | 'cancelled' | 'disputed';
  purchaseDate: string;
  metadata?: {
    seatNumber?: string;
    section?: string;
    specialInstructions?: string;
  };
}

interface TicketDisplayProps {
  tickets: TicketData[];
  onDownload?: (ticket: TicketData) => void;
  onShare?: (ticket: TicketData) => void;
}

export function TicketDisplay({ tickets, onDownload, onShare }: TicketDisplayProps) {
  const [qrCodeUrls, setQrCodeUrls] = useState<Record<string, string>>({});

  const generateQRCode = async (ticketId: string, qrData: string) => {
    try {
      const url = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeUrls(prev => ({ ...prev, [ticketId]: url }));
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'used':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'disputed':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Ticket className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'disputed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleDownload = (ticket: TicketData) => {
    // Generate downloadable ticket
    const ticketData = {
      ...ticket,
      qrCodeUrl: qrCodeUrls[ticket.id],
    };
    
    // Create download logic here
    if (onDownload) {
      onDownload(ticketData);
    } else {
      // Default download implementation
      const dataStr = JSON.stringify(ticketData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `ticket-${ticket.eventTitle.replace(/\s+/g, '-')}-${ticket.id}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const handleShare = (ticket: TicketData) => {
    if (onShare) {
      onShare(ticket);
    } else {
      // Default share implementation
      if (navigator.share) {
        navigator.share({
          title: `Ticket: ${ticket.eventTitle}`,
          text: `I'm going to ${ticket.eventTitle}!`,
          url: window.location.href,
        });
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(
          `I'm going to ${ticket.eventTitle} on ${ticket.eventDate}!`
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      {tickets.map((ticket) => {
        // Generate QR code if not already generated
        if (!qrCodeUrls[ticket.id] && ticket.qrCode) {
          generateQRCode(ticket.id, ticket.qrCode);
        }

        return (
          <Card key={ticket.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    {ticket.eventTitle}
                  </CardTitle>
                  <div className="space-y-1 mt-2 text-pink-100">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {ticket.eventDate}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      {ticket.eventVenue}, {ticket.eventLocation}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(ticket.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(ticket.status)}
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </div>
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Ticket Details */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Ticket Type</h4>
                      <p className="text-gray-600">{ticket.ticketType}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Quantity</h4>
                      <p className="text-gray-600">{ticket.quantity} ticket(s)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Total Paid</h4>
                      <p className="text-gray-600 font-medium">
                        {ticket.currency} {ticket.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Purchase Date</h4>
                      <p className="text-gray-600">{ticket.purchaseDate}</p>
                    </div>
                  </div>

                  {/* Additional Details */}
                  {ticket.metadata && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Additional Details</h4>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm">
                        {ticket.metadata.seatNumber && (
                          <p className="text-gray-600">
                            <span className="font-medium">Seat:</span> {ticket.metadata.seatNumber}
                          </p>
                        )}
                        {ticket.metadata.section && (
                          <p className="text-gray-600">
                            <span className="font-medium">Section:</span> {ticket.metadata.section}
                          </p>
                        )}
                        {ticket.metadata.specialInstructions && (
                          <p className="text-gray-600 sm:col-span-2">
                            <span className="font-medium">Instructions:</span> {ticket.metadata.specialInstructions}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(ticket)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(ticket)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    {qrCodeUrls[ticket.id] ? (
                      <img
                        src={qrCodeUrls[ticket.id]}
                        alt="Ticket QR Code"
                        className="w-32 h-32"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                        <QrCode className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Show this QR code at the event entrance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
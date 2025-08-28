import { useState } from "react";
import { Plus, Minus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TicketTier {
  id: string;
  ticket_name: string;
  ticket_type: string;
  description: string | null;
  price: number;
  currency: string;
  total_quantity: number;
  sold_quantity: number;
  available_quantity: number;
  status: string;
}

interface TicketSelection {
  [ticketId: string]: number;
}

interface TicketSelectorProps {
  tickets: TicketTier[];
  selection: TicketSelection;
  onSelectionChange: (selection: TicketSelection) => void;
  maxPerPerson?: number;
}

export const TicketSelector = ({ 
  tickets, 
  selection, 
  onSelectionChange, 
  maxPerPerson = 10 
}: TicketSelectorProps) => {
  const updateQuantity = (ticketId: string, quantity: number) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const maxAllowed = Math.min(ticket.available_quantity, maxPerPerson);
    const newQuantity = Math.max(0, Math.min(quantity, maxAllowed));
    
    const newSelection = { ...selection };
    if (newQuantity === 0) {
      delete newSelection[ticketId];
    } else {
      newSelection[ticketId] = newQuantity;
    }
    
    onSelectionChange(newSelection);
  };

  const getTotalSelectedTickets = () => {
    return Object.values(selection).reduce((sum, qty) => sum + qty, 0);
  };

  const getTicketVariant = (ticketType: string) => {
    switch (ticketType.toLowerCase()) {
      case 'vip':
      case 'platinum':
        return 'destructive';
      case 'general':
      case 'standard':
        return 'secondary';
      case 'student':
      case 'earlybird':
        return 'accent';
      default:
        return 'outline';
    }
  };

  const isTicketSoldOut = (ticket: TicketTier) => {
    return ticket.available_quantity <= 0;
  };

  const isLimitedAvailability = (ticket: TicketTier) => {
    return ticket.available_quantity <= 10 && ticket.available_quantity > 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-playfair font-semibold">Select Tickets</h3>
        {getTotalSelectedTickets() > 0 && (
          <Badge variant="secondary">
            {getTotalSelectedTickets()} ticket{getTotalSelectedTickets() !== 1 ? 's' : ''} selected
          </Badge>
        )}
      </div>
      
      {tickets.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No tickets available for this event.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const selectedQuantity = selection[ticket.id] || 0;
            const soldOut = isTicketSoldOut(ticket);
            const limited = isLimitedAvailability(ticket);

            return (
              <Card 
                key={ticket.id} 
                className={`transition-all duration-200 ${
                  soldOut ? 'opacity-60' : selectedQuantity > 0 ? 'ring-2 ring-accent' : 'hover:shadow-md'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold font-inter">{ticket.ticket_name}</h4>
                        <Badge variant={getTicketVariant(ticket.ticket_type)} className="text-xs">
                          {ticket.ticket_type}
                        </Badge>
                        {limited && !soldOut && (
                          <Badge variant="destructive" className="text-xs">
                            Only {ticket.available_quantity} left
                          </Badge>
                        )}
                        {soldOut && (
                          <Badge variant="destructive" className="text-xs">
                            Sold Out
                          </Badge>
                        )}
                      </div>
                      
                      {ticket.description && (
                        <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-accent font-playfair">
                            {ticket.currency}{ticket.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {ticket.available_quantity} available
                          </span>
                        </div>
                        
                        {!soldOut && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(ticket.id, selectedQuantity - 1)}
                              disabled={selectedQuantity === 0}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            
                            <span className="w-8 text-center font-semibold">
                              {selectedQuantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(ticket.id, selectedQuantity + 1)}
                              disabled={
                                selectedQuantity >= Math.min(ticket.available_quantity, maxPerPerson) ||
                                getTotalSelectedTickets() >= maxPerPerson
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {getTotalSelectedTickets() >= maxPerPerson && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">
                Maximum {maxPerPerson} tickets per person reached.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import DashboardLayout from '@/components/DashboardLayout';
import { CalendarDays, Clock, DollarSign, Plus, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const VenueAvailability = () => {
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState([
    { startTime: '09:00', endTime: '17:00', price: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [specialNotes, setSpecialNotes] = useState('');

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { startTime: '09:00', endTime: '17:00', price: 0 }]);
  };
  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: string, value: any) => {
    const updated = [...timeSlots];
    updated[index] = { ...updated[index], [field]: value };
    setTimeSlots(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Availability Updated",
        description: "Your venue availability has been successfully updated.",
      });
      navigate('/admin/venue');
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating availability.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Manage Venue Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <CalendarDays className="h-4 w-4" />
                  Select Available Dates
                </Label>
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => setSelectedDates(dates || [])}
                  className="rounded-md border"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4" />
                  Time Slots & Pricing
                </Label>
                <div className="space-y-3">
                  {timeSlots.map((slot, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                        className="w-32"
                      />
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <Input
                          type="number"
                          value={slot.price}
                          onChange={(e) => updateTimeSlot(index, 'price', parseFloat(e.target.value))}
                          placeholder="Price"
                          className="w-24"
                        />
                      </div>
                      {timeSlots.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeTimeSlot(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addTimeSlot}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Time Slot
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Special Notes or Restrictions</Label>
              <Textarea
                id="notes"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Add any special notes about availability, blackout dates, or restrictions..."
                rows={4}
              />
            </div>

            {selectedDates.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Selected Dates:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDates.map((date, index) => (
                    <Badge key={index} variant="secondary">
                      {format(date, 'MMM dd, yyyy')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => navigate('/admin/venue')}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save Availability"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VenueAvailability;
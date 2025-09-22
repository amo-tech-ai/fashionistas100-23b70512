import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { StandardCard, StandardCardContent, StandardCardHeader } from "@/components/ui/StandardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/clerk-react";
import { DashboardFooter } from "@/components/DashboardFooter";
import { fashionImages } from "@/lib/cloudinary";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiry_type: 'general' as 'general' | 'media' | 'event_inquiry' | 'partnership' | 'technical_support' | 'billing' | 'feedback'
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_forms')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          inquiry_type: formData.inquiry_type,
          user_id: user?.id || null,
        });

      if (error) throw error;

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiry_type: 'general'
      });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden mt-16 lg:mt-20">
        <img 
          src={fashionImages.backstage[1]} 
          alt="Contact us"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <Badge variant="secondary" className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30">
              We're Here to Help
            </Badge>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
              Get In Touch
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-white/90">
              Have questions about our events, want to showcase your designs, or interested in partnerships? 
              We'd love to hear from you.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-12">

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <StandardCard>
            <StandardCardHeader 
              title="Send us a message" 
              subtitle="Fill out the form below and we'll get back to you within 24 hours."
            />
            <StandardCardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="inquiryType">Inquiry Type</Label>
                  <Select value={formData.inquiry_type} onValueChange={(value) => handleInputChange('inquiry_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="event_inquiry">Event Inquiry</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="media">Media & Press</SelectItem>
                      <SelectItem value="technical_support">Technical Support</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input 
                    id="subject" 
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-32"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </StandardCardContent>
          </StandardCard>

          {/* Contact Info */}
          <div className="space-y-4 lg:space-y-6">
            <StandardCard>
              <StandardCardContent className="p-4 lg:p-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-brand mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-muted-foreground">hello@fashionistas.com</p>
                    <p className="text-muted-foreground">events@fashionistas.com</p>
                  </div>
                </div>
              </StandardCardContent>
            </StandardCard>

            <StandardCard>
              <StandardCardContent className="p-4 lg:p-6">
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-brand mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-muted-foreground">+1 (555) 987-6543</p>
                  </div>
                </div>
              </StandardCardContent>
            </StandardCard>

            <StandardCard>
              <StandardCardContent className="p-4 lg:p-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-brand mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Visit Us</h3>
                    <p className="text-muted-foreground">123 Fashion Street</p>
                    <p className="text-muted-foreground">New York, NY 10001</p>
                  </div>
                </div>
              </StandardCardContent>
            </StandardCard>

            <StandardCard>
              <StandardCardContent className="p-4 lg:p-6">
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-brand mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Office Hours</h3>
                    <p className="text-muted-foreground">Monday - Friday: 9AM - 6PM</p>
                    <p className="text-muted-foreground">Weekend: By appointment</p>
                  </div>
                </div>
              </StandardCardContent>
            </StandardCard>

            {/* Quick Contact Options */}
            <StandardCard className="bg-brand/5">
              <StandardCardContent className="p-4 lg:p-6">
                <h3 className="font-playfair font-bold text-lg mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => handleInputChange('inquiry_type', 'partnership')}
                  >
                    Partnership Inquiry
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => handleInputChange('inquiry_type', 'event_inquiry')}
                  >
                    Event Inquiry
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => handleInputChange('inquiry_type', 'media')}
                  >
                    Media & Press
                  </Button>
                </div>
              </StandardCardContent>
            </StandardCard>
          </div>
        </div>
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default Contact;
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-foreground mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our events, want to showcase your designs, or interested in sponsorship? 
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="font-playfair">Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What's this about?" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us more about your inquiry..."
                  className="min-h-32"
                />
              </div>
              <Button className="w-full">Send Message</Button>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-muted-foreground">hello@fashionistas.com</p>
                    <p className="text-muted-foreground">events@fashionistas.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-muted-foreground">+1 (555) 987-6543</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Visit Us</h3>
                    <p className="text-muted-foreground">123 Fashion Street</p>
                    <p className="text-muted-foreground">New York, NY 10001</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Office Hours</h3>
                    <p className="text-muted-foreground">Monday - Friday: 9AM - 6PM</p>
                    <p className="text-muted-foreground">Weekend: By appointment</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Options */}
            <Card className="bg-accent/5">
              <CardContent className="p-6">
                <h3 className="font-playfair font-bold text-lg mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Designer Application
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Sponsorship Inquiry
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Media & Press
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
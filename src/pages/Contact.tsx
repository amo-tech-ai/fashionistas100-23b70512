import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="pt-16 lg:pt-20 flex-1">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
                Get in Touch
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground mb-8">
                Ready to bring your fashion vision to life? Let's discuss your next project.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">24/7 Support</Badge>
                <Badge variant="secondary">Free Consultation</Badge>
                <Badge variant="secondary">Quick Response</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="text-sm font-medium mb-2 block">
                        First Name
                      </label>
                      <Input id="firstName" placeholder="Your first name" />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="text-sm font-medium mb-2 block">
                        Last Name
                      </label>
                      <Input id="lastName" placeholder="Your last name" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium mb-2 block">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm font-medium mb-2 block">
                      Phone (Optional)
                    </label>
                    <Input id="phone" type="tel" placeholder="+57 XXX XXX XXXX" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="text-sm font-medium mb-2 block">
                      Subject
                    </label>
                    <Input id="subject" placeholder="How can we help you?" />
                  </div>
                  <div>
                    <label htmlFor="message" className="text-sm font-medium mb-2 block">
                      Message
                    </label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your project or question..."
                      rows={6}
                    />
                  </div>
                  <Button className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">Contact Information</h2>
                  <p className="text-muted-foreground mb-8">
                    We're here to help with your fashion events, photography, video production, and more.
                  </p>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Mail className="w-6 h-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Email</h3>
                          <p className="text-muted-foreground">hello@fashionistas.co</p>
                          <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Phone className="w-6 h-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Phone</h3>
                          <p className="text-muted-foreground">+57 (1) 234-5678</p>
                          <p className="text-sm text-muted-foreground">Mon-Fri, 9am-6pm COT</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <MapPin className="w-6 h-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Office</h3>
                          <p className="text-muted-foreground">Bogotá, Colombia</p>
                          <p className="text-sm text-muted-foreground">Available for meetings by appointment</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Clock className="w-6 h-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Business Hours</h3>
                          <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                          <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM</p>
                          <p className="text-sm text-muted-foreground">Colombia Time (COT)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* WhatsApp CTA */}
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-green-800 mb-2">Need Immediate Help?</h3>
                    <p className="text-green-700 mb-4">Chat with us on WhatsApp for quick responses</p>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => window.open('https://wa.me/573123456789', '_blank')}
                    >
                      Chat on WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
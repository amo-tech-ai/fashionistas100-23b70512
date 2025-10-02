import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  LogIn, 
  Globe, 
  Zap, 
  LayoutDashboard, 
  BrainCircuit,
  TrendingUp,
  FileText,
  BarChart3,
  Phone
} from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <LogIn className="w-8 h-8" />,
      title: "Social Login",
      description: "Sign in instantly with Google, Apple, or Facebook — no long forms."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Auto Brand Import",
      description: "We automatically pull your website, logo, and brand details for you."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Event Page",
      description: "An event page is generated in seconds with your brand identity applied."
    },
    {
      icon: <LayoutDashboard className="w-8 h-8" />,
      title: "Event Planning Dashboard",
      description: "Manage venues, tickets, sponsors, and schedules — all in one dashboard."
    },
    {
      icon: <BrainCircuit className="w-8 h-8" />,
      title: "AI Assistance",
      description: "AI helps at every step: generate event descriptions, optimize ticket pricing, suggest schedules, and draft promotional content."
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Smart Suggestions",
      description: "Get AI-driven recommendations for ticket pricing, timelines, and reminders."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Content Generation",
      description: "Auto-generate descriptions, invites, emails, and social media posts."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Insights",
      description: "Track real-time sales, attendance, and guest engagement with AI summaries."
    }
  ];

  const faqs = [
    {
      question: "How does AI help with my event?",
      answer: "AI suggests pricing, generates content, and keeps you on track with smart reminders. You're always in control."
    },
    {
      question: "Can I edit the event page?",
      answer: "Yes. Every AI-generated page is editable. You can update text, images, tickets, and schedules anytime."
    },
    {
      question: "How does the brand auto-import work?",
      answer: "When you log in and enter your website, we automatically pull your logo, brand colors, and basic info to save you time."
    },
    {
      question: "What's included in the dashboard?",
      answer: "The dashboard includes event scheduling, ticket sales, sponsor management, attendee check-ins, and post-event analytics — all in one place."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
            The easiest way to create your fashion event.
          </h1>
          <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            Sign in, auto-import your brand, and let AI help you publish and manage your event in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg"
              className="bg-[#E85C2B] hover:bg-[#D14D1F] text-white"
            >
              <Link to="/sign-up">Get Started</Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-border-strong hover:bg-surface-2"
            >
              <Link to="/contact">Book a Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface-1">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              How it works
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="border-border-strong hover:border-[#E85C2B] transition-all duration-300 bg-background">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
                      <div className="text-[#E85C2B]">
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-text-muted">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Highlight Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Your Event, Powered by AI.
            </h2>
            <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
              From ticketing to marketing, AI helps you plan smarter and faster.
            </p>
            <Button 
              asChild 
              size="lg"
              className="bg-[#E85C2B] hover:bg-[#D14D1F] text-white"
            >
              <Link to="/dashboard">Explore the Dashboard</Link>
            </Button>
          </div>
          
          {/* Dashboard mockup placeholder */}
          <div className="bg-surface-2 rounded-lg border border-border-strong p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <LayoutDashboard className="w-20 h-20 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface-1">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-background border border-border-strong flex items-center justify-center mx-auto mb-4">
                  <div className="text-[#E85C2B]">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  {benefit.title}
                </h3>
                <p className="text-text-muted">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <Card className="border-border-strong bg-surface-1">
            <CardContent className="p-8">
              <Phone className="w-12 h-12 text-[#E85C2B] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-primary mb-3">
                Need expert guidance?
              </h2>
              <p className="text-text-muted mb-6">
                Our event specialists are here to help you succeed.
              </p>
              <Button 
                asChild 
                size="lg"
                className="bg-[#E85C2B] hover:bg-[#D14D1F] text-white"
              >
                <Link to="/contact">Book a Strategy Call</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface-1">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary text-center mb-12">
            Frequently asked questions
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background border border-border-strong rounded-lg px-6"
              >
                <AccordionTrigger className="text-left text-text-primary hover:text-[#E85C2B]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-text-muted">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
            Ready to create your fashion event?
          </h2>
          <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            Join hundreds of fashion professionals using AI to plan better events.
          </p>
          <Button 
            asChild 
            size="lg"
            className="bg-[#E85C2B] hover:bg-[#D14D1F] text-white"
          >
            <Link to="/sign-up">Get Started</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;

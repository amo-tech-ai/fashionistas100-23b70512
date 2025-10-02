import React from 'react';
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
  Sparkles, 
  LayoutDashboard, 
  MessageSquare,
  TrendingUp,
  FileText,
  BarChart3,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      icon: <LogIn className="w-8 h-8" />,
      title: "Social Login",
      description: "Sign in with Google, Apple, or Facebook."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Auto Brand Import",
      description: "We pull your website, logo, and key details automatically."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Instant Event Page",
      description: "An event page is instantly created using your brand details."
    },
    {
      icon: <LayoutDashboard className="w-8 h-8" />,
      title: "Event Planning Dashboard",
      description: "Add dates, venues, tickets, and sponsors — all in one dashboard."
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "AI Assistance",
      description: "AI helps streamline your planning: generate descriptions, suggest ticket pricing, optimize schedules, and create promo content."
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Smart Suggestions",
      description: "AI recommends pricing, reminders, and schedules."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Content Generation",
      description: "Instant event descriptions, invites, and social posts."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Insights",
      description: "Real-time analytics on sales, attendance, and guest engagement."
    }
  ];

  const faqs = [
    {
      question: "How does AI help with my event?",
      answer: "AI assists throughout the entire event planning process by generating compelling event descriptions, suggesting optimal ticket pricing based on market data, creating promotional content for social media, and providing real-time insights on attendee engagement and ticket sales."
    },
    {
      question: "Can I edit the event page?",
      answer: "Yes, absolutely! While we auto-generate your event page using your brand details, you have full control to customize every aspect - from text and images to layout and styling. Our intuitive editor makes it easy to make changes on the fly."
    },
    {
      question: "How does the brand auto-import work?",
      answer: "Our smart import system analyzes your website to extract your logo, brand colors, fonts, and key business information. This ensures your event page maintains consistent branding with your existing online presence. You can review and adjust all imported details before publishing."
    },
    {
      question: "What's included in the dashboard?",
      answer: "The dashboard is your central hub for event management. It includes ticket sales tracking, attendee management, venue coordination, sponsor management, financial reporting, marketing tools, and real-time analytics. Everything you need to run a successful fashion event is in one place."
    }
  ];

  return (
    <div className="min-h-screen bg-surface-2">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
            The easiest way to create your fashion event.
          </h1>
          <p className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            Log in, auto-import your brand, and let AI help you publish and manage your event in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sign-up">
              <Button size="lg" variant="action" className="w-full sm:w-auto min-h-[48px] px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto min-h-[48px] px-8">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              How it works
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <Card 
                key={index}
                className="bg-surface-1 border-border-strong hover:shadow-moderate transition-shadow duration-300"
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-action/10 flex items-center justify-center text-action">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-text-muted mb-2">
                        Step {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        {step.title}
                      </h3>
                      <p className="text-text-muted text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Highlight */}
      <section className="py-16 px-4 bg-surface-1">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Your Event, Powered by AI.
              </h2>
              <p className="text-lg text-text-muted mb-6">
                From ticketing to marketing, AI makes event planning smarter and faster.
              </p>
              <Link to="/sign-up">
                <Button variant="action" size="lg" className="min-h-[48px]">
                  Start Planning Now
                </Button>
              </Link>
            </div>
            <div className="bg-surface-2 rounded-2xl p-8 min-h-[400px] flex items-center justify-center border-2 border-border-strong">
              <div className="text-center space-y-4">
                <Calendar className="w-16 h-16 mx-auto text-action" />
                <p className="text-text-muted text-sm">Dashboard Preview</p>
                <p className="text-xs text-text-muted max-w-xs">
                  Manage events, tickets, sponsors, and analytics all in one beautiful interface
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 rounded-full bg-action/10 flex items-center justify-center text-action mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  {benefit.title}
                </h3>
                <p className="text-text-muted leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 px-4 bg-surface-1">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="bg-surface-2 border-border-strong">
            <CardContent className="p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
                Need expert guidance?
              </h2>
              <p className="text-text-muted mb-6 max-w-xl mx-auto">
                Our team is here to help you create unforgettable fashion events.
              </p>
              <Link to="/contact">
                <Button variant="action" size="lg" className="min-h-[48px] px-8">
                  Book a Strategy Call
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary text-center mb-12">
            Frequently asked questions
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-surface-1 border border-border-strong rounded-lg px-6"
              >
                <AccordionTrigger className="text-left text-text-primary font-semibold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-text-muted leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-action text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to create your event?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join hundreds of fashion professionals using FashionOS Event Wizard
          </p>
          <Link to="/sign-up">
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-action hover:bg-white/90 min-h-[48px] px-8"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;

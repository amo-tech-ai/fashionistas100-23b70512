import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Facebook, Twitter, Instagram, Linkedin, Youtube,
  Mail, Phone, MapPin, ArrowRight, ExternalLink
} from 'lucide-react';

export const DashboardFooter = () => {
  const currentYear = new Date().getFullYear();

  const dashboardLinks = [
    { path: '/dashboard', label: 'Main Dashboard' },
    { path: '/organizer-dashboard', label: 'Organizer Dashboard' },
    { path: '/sponsor-dashboard', label: 'Sponsor Dashboard' },
    { path: '/venue-dashboard', label: 'Venue Dashboard' },
  ];

  const platformLinks = [
    { path: '/events', label: 'Browse Events' },
    { path: '/designers', label: 'Designers' },
    { path: '/sponsors', label: 'Sponsors' },
    { path: '/about', label: 'About Us' },
  ];

  const resourceLinks = [
    { path: '/help', label: 'Help Center' },
    { path: '/docs', label: 'Documentation' },
    { path: '/contact', label: 'Contact Support' },
    { path: '/blog', label: 'Blog' },
  ];

  const legalLinks = [
    { path: '/privacy', label: 'Privacy Policy' },
    { path: '/terms', label: 'Terms of Service' },
    { path: '/cookies', label: 'Cookie Policy' },
  ];

  return (
    <footer className="bg-[#0B0F14] text-white border-t border-white/10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://fashionistas100.lovable.app/fashionistas-logo-main.png" 
                alt="Fashionistas Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="font-bold text-xl">Fashionistas</span>
            </div>
            <p className="text-white/70 text-sm mb-6">
              The premier platform for fashion event management in Colombia
            </p>
            <div className="flex gap-2">
              <Button asChild variant="ghost" size="icon" className="hover:bg-white/10 text-white/70 hover:text-white">
                <a href="https://www.facebook.com/fashionweeks" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon" className="hover:bg-white/10 text-white/70 hover:text-white">
                <a href="https://www.instagram.com/fashionistasme/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon" className="hover:bg-white/10 text-white/70 hover:text-white">
                <a href="https://youtube.com/@fashionistas195?si=CRew1XcJjWrmJOD4" target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon" className="hover:bg-white/10 text-white/70 hover:text-white">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Dashboards */}
          <div>
            <h3 className="font-semibold text-white mb-4">Dashboards</h3>
            <ul className="space-y-2">
              {dashboardLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="font-semibold text-white mb-2">Stay Updated</h3>
              <p className="text-white/70 text-sm">
                Get the latest updates on fashion events and platform features
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-brand"
              />
              <Button className="bg-gradient-brand hover:opacity-90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.path}>
                  <Link to={link.path} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-white/30">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="text-sm text-white/70">
              © {currentYear} Fashionistas. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
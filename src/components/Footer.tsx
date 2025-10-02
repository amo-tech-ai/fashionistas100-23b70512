import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Facebook, Instagram, Youtube, MessageCircle
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0B0F14] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="mb-4">
              <img 
                src="/fashionistas1.png" 
                alt="Fashionistas Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <p className="text-white/70 text-sm mb-3">
              Colombia's premier fashion event platform
            </p>
            <p className="text-[hsl(var(--breef-orange))] text-xs font-medium mb-6">
              🇨🇴 Proudly serving Colombia + Global Cities
            </p>
            
            {/* Social Media - Large Icons */}
            <div className="space-y-3">
              <p className="text-white text-sm font-medium">Follow Us</p>
              <div className="flex gap-3">
                <Button asChild variant="ghost" size="icon" className="hover:bg-white/10 text-white/70 hover:text-white h-12 w-12">
                  <a href="https://www.facebook.com/fashionweeks" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <Facebook className="h-6 w-6" />
                  </a>
                </Button>
                <Button asChild variant="ghost" size="icon" className="hover:bg-white/10 text-white/70 hover:text-white h-12 w-12">
                  <a href="https://www.instagram.com/fashionistasme/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram className="h-6 w-6" />
                  </a>
                </Button>
                <Button asChild variant="ghost" size="icon" className="hover:bg-white/10 text-white/70 hover:text-white h-12 w-12">
                  <a href="https://youtube.com/@fashionistas195?si=CRew1XcJjWrmJOD4" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <Youtube className="h-6 w-6" />
                  </a>
                </Button>
                <Button asChild variant="ghost" size="icon" className="hover:bg-white/10 text-white/70 hover:text-white h-12 w-12">
                  <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    <MessageCircle className="h-6 w-6" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Dashboards */}
          <div>
            <h3 className="font-semibold text-white mb-4">Dashboards</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-white/70 hover:text-white text-sm transition-colors">Dashboard Overview</Link></li>
              <li><Link to="/organizer-dashboard" className="text-white/70 hover:text-white text-sm transition-colors">Organizer Dashboard</Link></li>
              <li><Link to="/user-dashboard" className="text-white/70 hover:text-white text-sm transition-colors">User Dashboard</Link></li>
              <li><Link to="/sponsor-dashboard" className="text-white/70 hover:text-white text-sm transition-colors">Sponsor Dashboard</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="text-white/70 hover:text-white text-sm transition-colors">How It Works</Link></li>
              <li><Link to="/events" className="text-white/70 hover:text-white text-sm transition-colors">Browse Events</Link></li>
              <li><Link to="/create-event" className="text-white/70 hover:text-white text-sm transition-colors">Create Event</Link></li>
              <li><Link to="/designers" className="text-white/70 hover:text-white text-sm transition-colors">Designers</Link></li>
              <li><Link to="/services" className="text-white/70 hover:text-white text-sm transition-colors">Media Services</Link></li>
              <li><Link to="/services/fashion-photography" className="text-white/70 hover:text-white text-sm transition-colors">Fashion Photography</Link></li>
              <li><Link to="/services/video-production" className="text-white/70 hover:text-white text-sm transition-colors">Video Production</Link></li>
              <li><Link to="/tickets" className="text-white/70 hover:text-white text-sm transition-colors">Tickets</Link></li>
              <li><Link to="/sponsors" className="text-white/70 hover:text-white text-sm transition-colors">Become a Sponsor</Link></li>
              <li><Link to="/about" className="text-white/70 hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-white text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-white/70 hover:text-white text-sm transition-colors">Help Center</Link></li>
              <li><Link to="/docs" className="text-white/70 hover:text-white text-sm transition-colors">Documentation</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-white text-sm transition-colors">Contact Support</Link></li>
              <li><Link to="/blog" className="text-white/70 hover:text-white text-sm transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Partner Logos */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <p className="text-white/50 text-xs text-center mb-6 uppercase tracking-wider">
            Partner Brands
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/30">
            <span className="text-lg font-light">Vogue Colombia</span>
            <span className="text-lg font-light">Mercedes-Benz</span>
            <span className="text-lg font-light">Falabella</span>
            <span className="text-lg font-light">L'Oréal</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span className="text-white/30">•</span>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <span className="text-white/30">•</span>
              <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
            <div className="text-sm text-white/70">
              © 2025 Fashionistas. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/fashionistas-logo-main.png" 
                alt="Fashionistas" 
                className="h-8 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-xl font-bold">Fashionistas</span>';
                }}
              />
            </div>
            <p className="text-background/80 text-sm">
              Premier Fashion Event<br />Management Platform
            </p>
          </div>

          {/* Dashboards */}
          <div>
            <h4 className="font-semibold mb-3">Dashboards</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><Link to="/dashboard" className="hover:text-background">Dashboard Overview</Link></li>
              <li><Link to="/organizer-dashboard" className="hover:text-background">Organizer Dashboard</Link></li>
              <li><Link to="/user-dashboard" className="hover:text-background">User Dashboard</Link></li>
              <li><Link to="/sponsor-dashboard" className="hover:text-background">Sponsor Dashboard</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><Link to="/events" className="hover:text-background">Browse Events</Link></li>
              <li><Link to="/designers" className="hover:text-background">Designers</Link></li>
              <li><Link to="/tickets" className="hover:text-background">Tickets</Link></li>
              <li><Link to="/sponsors" className="hover:text-background">Become a Sponsor</Link></li>
              <li><Link to="/about" className="hover:text-background">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-background">Contact</Link></li>
            </ul>
          </div>

          {/* Resources & Contact */}
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-background/80 mb-4">
              <li><Link to="/help" className="hover:text-background">Help Center</Link></li>
              <li><Link to="/docs" className="hover:text-background">Documentation</Link></li>
              <li><Link to="/api" className="hover:text-background">API Reference</Link></li>
              <li><Link to="/blog" className="hover:text-background">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-background">Careers</Link></li>
              <li><Link to="/press" className="hover:text-background">Press Kit</Link></li>
            </ul>
            
            <h4 className="font-semibold mb-3 mt-6 text-background">Contact</h4>
            <div className="text-sm text-background/80">
              <p><a href="mailto:support@fashionos.com" className="hover:text-background">support@fashionos.com</a></p>
              <p><a href="tel:+12345678890" className="hover:text-background">+1 (234) 567-890</a></p>
              <p className="mt-2">
                123 Fashion Ave<br />
                New York, NY 10001
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-background/80">
              © 2025 Fashionistas. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-background/80">
              <Link to="/privacy" className="hover:text-background">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-background">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-background">Cookie Policy</Link>
              <Link to="/compliance" className="hover:text-background">Compliance</Link>
            </div>
          </div>
        </div>

        {/* Links Row */}
        <div className="mt-8 pt-8 border-t border-background/20">
          <div className="flex flex-wrap gap-4 text-xs text-background/60">
            <a href="https://github.com/amo-tech-ai/fashionistas100-23b70512" target="_blank" rel="noopener noreferrer" className="hover:text-background/80">
              Frontend Repository
            </a>
            <span>•</span>
            <a href="https://github.com/amo-tech-ai/fashion-platform-backend" target="_blank" rel="noopener noreferrer" className="hover:text-background/80">
              Backend Repository
            </a>
            <span>•</span>
            <a href="https://app.supabase.com/project/vuvfqjhkppmbdeqsflbn" target="_blank" rel="noopener noreferrer" className="hover:text-background/80">
              Supabase Dashboard
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
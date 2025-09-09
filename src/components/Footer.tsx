import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
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
            <p className="text-gray-400 text-sm">
              Premier Fashion Event<br />Management Platform
            </p>
          </div>

          {/* Dashboards */}
          <div>
            <h4 className="font-semibold mb-3">Dashboards</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/dashboard" className="hover:text-white">Dashboard Overview</Link></li>
              <li><Link to="/organizer-dashboard" className="hover:text-white">Organizer Dashboard</Link></li>
              <li><Link to="/user-dashboard" className="hover:text-white">User Dashboard</Link></li>
              <li><Link to="/sponsor-dashboard" className="hover:text-white">Sponsor Dashboard</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/events" className="hover:text-white">Browse Events</Link></li>
              <li><Link to="/designers" className="hover:text-white">Designers</Link></li>
              <li><Link to="/tickets" className="hover:text-white">Tickets</Link></li>
              <li><Link to="/sponsors" className="hover:text-white">Become a Sponsor</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Resources & Contact */}
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400 mb-4">
              <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link to="/docs" className="hover:text-white">Documentation</Link></li>
              <li><Link to="/api" className="hover:text-white">API Reference</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link to="/press" className="hover:text-white">Press Kit</Link></li>
            </ul>
            
            <h4 className="font-semibold mb-3 mt-6">Contact</h4>
            <div className="text-sm text-gray-400">
              <p><a href="mailto:support@fashionos.com" className="hover:text-white">support@fashionos.com</a></p>
              <p><a href="tel:+12345678890" className="hover:text-white">+1 (234) 567-890</a></p>
              <p className="mt-2">
                123 Fashion Ave<br />
                New York, NY 10001
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © 2025 Fashionistas. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-white">Cookie Policy</Link>
              <Link to="/compliance" className="hover:text-white">Compliance</Link>
            </div>
          </div>
        </div>

        {/* Links Row */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <a href="https://github.com/amo-tech-ai/fashionistas100-23b70512" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              Frontend Repository
            </a>
            <span>•</span>
            <a href="https://github.com/amo-tech-ai/fashion-platform-backend" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              Backend Repository
            </a>
            <span>•</span>
            <a href="https://app.supabase.com/project/vuvfqjhkppmbdeqsflbn" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              Supabase Dashboard
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
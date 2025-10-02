import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  useAuth, 
  useUser, 
  SignInButton, 
  SignUpButton, 
  UserButton, 
  SignedIn, 
  SignedOut,
  useClerk
} from "@clerk/clerk-react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use Clerk hooks with comprehensive error handling
  const clerk = useClerk();
  const auth = useAuth();
  const { user } = useUser();
  
  const [clerkError, setClerkError] = useState<string | null>(null);
  const [showDebug] = useState(true); // Always show debug for now
  
  // Safe destructuring with fallbacks
  const isLoaded = auth?.isLoaded ?? false;
  const isSignedIn = auth?.isSignedIn ?? false;
  
  // Comprehensive debug logging
  useEffect(() => {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      clerkLoaded: !!clerk,
      isLoaded,
      isSignedIn,
      hasUser: !!user,
      userId: user?.id,
      clerkKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 15),
      testKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY_TEST?.substring(0, 15),
      hostname: window.location.hostname
    };
    
    console.log('🔍 Navigation Auth State:', debugInfo);
    
    // Check for Clerk initialization errors
    if (!clerk) {
      const error = 'Clerk instance not available';
      console.error('❌ Clerk Error:', error);
      setClerkError(error);
    } else if (isLoaded && !isSignedIn && !user) {
      console.log('✅ Clerk loaded, user not signed in (expected)');
      setClerkError(null);
    } else if (isLoaded && isSignedIn && user) {
      console.log('✅ Clerk loaded, user signed in:', user.id);
      setClerkError(null);
    }
  }, [clerk, isLoaded, isSignedIn, user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { name: "Events", href: "/events" },
    { name: "Create Event", href: "/create-event" },
    { 
      name: "Services", 
      href: "/services",
      submenu: [
        { name: "All Services", href: "/services" },
        { name: "Fashion Photography", href: "/services/fashion-photography" },
        { name: "Video Production", href: "/services/video-production" },
        { name: "AI Services", href: "/services/ai-services" }
      ]
    },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Designers", href: "/designers" },
    { name: "Venues", href: "/venues" },
    { name: "Tickets", href: "/tickets" },
    { name: "Sponsors", href: "/sponsors" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Add Dashboard link only if signed in
  if (isSignedIn) {
    navigationItems.push({ name: "Dashboard", href: "/dashboard" });
  }

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/95 backdrop-blur-lg shadow-md" : "bg-white/80 backdrop-blur-sm"
    }`}>
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/fashionistas-logo-main.png" 
              alt="Fashionistas" 
              className="h-10 lg:h-12 transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                // Fallback to text if image fails
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl font-bold text-primary">Fashionistas</span>';
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              item.submenu ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                        location.pathname.startsWith(item.href)
                          ? "text-primary bg-primary/10"
                          : "text-gray-700 hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      {item.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {item.submenu.map((subItem) => (
                      <DropdownMenuItem key={subItem.name} asChild>
                        <Link to={subItem.href} className="w-full">
                          {subItem.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
            
            {/* Auth Buttons - Always visible with fallbacks */}
            <div className="ml-4 flex items-center space-x-2">
              {clerkError ? (
                // Show error state
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/sign-in'}
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => window.location.href = '/sign-up'}
                  >
                    Sign Up
                  </Button>
                </div>
              ) : !isLoaded ? (
                // Loading state
                <div className="flex items-center space-x-2">
                  <div className="h-9 w-20 bg-gray-200 animate-pulse rounded" />
                  <div className="h-9 w-20 bg-gray-200 animate-pulse rounded" />
                </div>
              ) : !isSignedIn ? (
                // Not signed in - show Clerk buttons
                <div className="flex items-center space-x-2">
                  <SignInButton mode="modal" fallbackRedirectUrl="/">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal" fallbackRedirectUrl="/">
                    <Button size="sm">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              ) : (
                // Signed in - show dashboard and user button
                <div className="flex items-center space-x-2">
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg block ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-gray-700 hover:text-primary hover:bg-primary/5"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="ml-4 mt-2 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Auth Buttons - Always visible */}
              <div className="pt-4 border-t flex flex-col space-y-2">
                {!isLoaded ? (
                  <div className="space-y-2">
                    <div className="h-9 bg-gray-200 animate-pulse rounded" />
                    <div className="h-9 bg-gray-200 animate-pulse rounded" />
                  </div>
                ) : !isSignedIn ? (
                  <>
                    <SignInButton mode="modal" fallbackRedirectUrl="/">
                      <Button variant="outline" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal" fallbackRedirectUrl="/">
                      <Button size="sm" className="w-full">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <div className="flex justify-center pt-2">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
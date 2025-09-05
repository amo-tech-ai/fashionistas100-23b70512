import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import { 
  useAuth, 
  useUser, 
  SignInButton, 
  UserButton,
  SignedIn,
  SignedOut 
} from "@clerk/clerk-react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Use Clerk hooks
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { name: "Events", href: "/events" },
    { name: "Designers", href: "/designers" },
    { name: "Tickets", href: "/tickets" },
    { name: "Sponsors", href: "/sponsors" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Dashboard", href: "/admin/leap" },
  ];

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
              src="/fashionistas-logo.png" 
              alt="Fashionistas" 
              className="h-10 lg:h-12 transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
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
            ))}
            
            {/* Auth Buttons */}
            <div className="ml-4">
              <SignedOut>
                <div className="flex items-center space-x-2">
                  <SignInButton mode="modal">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </SignInButton>
                  <Button size="sm">
                    Sign Up
                  </Button>
                </div>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <SignedOut>
                <div className="pt-4 space-y-2 border-t border-gray-100">
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full" size="sm">
                      Sign In
                    </Button>
                  </SignInButton>
                  <Button className="w-full" size="sm">
                    Sign Up
                  </Button>
                </div>
              </SignedOut>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Calendar, Users, Ticket, Building2, Mail, Info, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  const navigationItems = [
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Designers", href: "/designers", icon: Users },
    { name: "Tickets", href: "/tickets", icon: Ticket },
    { name: "Sponsors", href: "/sponsors", icon: Building2 },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white font-playfair font-bold text-lg">F</span>
            </div>
            <span className="font-playfair text-xl font-bold text-foreground">
              Fashionistas
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button variant="ghost" className="font-inter">
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-primary text-white">
                              {user.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={signOut}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <Button variant="outline" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                )}
              </>
            )}
            <Button variant="hero" className="font-inter" asChild>
              <Link to="/tickets">Get Tickets</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent/10 transition-smooth"
                >
                  <item.icon className="w-5 h-5 text-accent" />
                  <span className="font-inter text-foreground">{item.name}</span>
                </Link>
              ))}
              <div className="px-4 pt-4">
                <Button variant="hero" className="w-full font-inter">
                  Get Tickets
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
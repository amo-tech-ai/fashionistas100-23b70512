import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, signOut } = useAuth();
  const location = useLocation();

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
  ];

  const isActive = (href: string) => location.pathname === href;  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/95 backdrop-blur-lg shadow-md" : "bg-white/80 backdrop-blur-sm"
    }`}>
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/f-logo.png" 
              alt="Fashionistas" 
              className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 object-contain transition-transform group-hover:scale-110"
            />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button
                  variant="ghost"
                  className={`font-inter text-sm font-medium px-4 py-2 transition-colors ${
                    isActive(item.href)
                      ? "text-black bg-gray-100"
                      : "text-gray-700 hover:text-black hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-black text-white font-medium">
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
                ) : (
                  <Button 
                    variant="ghost" 
                    asChild
                    className="font-inter text-sm font-medium text-gray-700 hover:text-black"
                  >
                    <Link to="/auth">Sign In</Link>
                  </Button>
                )}
              </>
            )}
            <Button 
              className="bg-black text-white hover:bg-gray-900 font-inter text-sm font-medium px-5 py-2.5" 
              asChild
            >
              <Link to="/tickets">Get Tickets</Link>
            </Button>
          </div>          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-16 lg:top-20 bg-white border-t transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full pointer-events-none"
        }`}
        style={{ maxHeight: "calc(100vh - 4rem)" }}
      >
        <div className="container mx-auto px-4 py-4 overflow-y-auto">
          <div className="flex flex-col space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-inter text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-gray-100 text-black"
                    : "text-gray-700 hover:bg-gray-50 hover:text-black"
                }`}
              >
                {item.name}
              </Link>
            ))}            {/* Mobile Auth Section */}
            <div className="border-t pt-4 mt-4">
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-3 rounded-lg font-inter text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black"
                      >
                        <User className="mr-3 h-5 w-5" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-3 rounded-lg font-inter text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black"
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-4 py-3 rounded-lg font-inter text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black"
                    >
                      Sign In
                    </Link>
                  )}
                  <Link
                    to="/tickets"
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-4 block"
                  >
                    <Button className="w-full bg-black text-white hover:bg-gray-900 font-inter font-medium py-3">
                      Get Tickets
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
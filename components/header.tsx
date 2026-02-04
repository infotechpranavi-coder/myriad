'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isRestaurantMenuOpen, setIsRestaurantMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/rooms', label: 'Rooms' },
    { href: '/banquet', label: 'Banquet Hall' },
    { href: '/blog', label: 'Blog' },
  ];

  const restaurantOptions = [
    { name: 'Urban Dhaba', href: '/restaurants#urban-dhaba' },
    { name: 'Coastal Sea Food', href: '/restaurants#coastal-seafood' },
    { name: 'Winking Owl', href: '/restaurants#winking-owl' },
  ];

  return (
    <header className={`sticky top-0 z-50 bg-background border-b border-border transition-smooth ${hasScrolled ? 'shadow-md' : ''}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-serif font-bold text-primary hover:opacity-80 transition-smooth">
            The Myriad
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-foreground font-medium group"
                style={{
                  animation: `slideInDown 0.5s ease-in-out ${0.1 * (index + 1)}s both`,
                }}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-smooth" />
              </Link>
            ))}
            
            {/* Restaurants Dropdown */}
            <DropdownMenu onOpenChange={setIsRestaurantMenuOpen}>
              <DropdownMenuTrigger
                className="relative text-foreground font-medium group flex items-center gap-1 outline-none"
                style={{
                  animation: `slideInDown 0.5s ease-in-out ${0.1 * (navItems.length + 1)}s both`,
                }}
              >
                Restaurants
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${isRestaurantMenuOpen ? 'rotate-180' : ''}`} 
                />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-smooth" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[200px]">
                {restaurantOptions.map((restaurant) => (
                  <DropdownMenuItem key={restaurant.href} asChild>
                    <Link
                      href={restaurant.href}
                      className="cursor-pointer"
                    >
                      {restaurant.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link
                    href="/restaurants"
                    className="cursor-pointer font-semibold text-primary"
                  >
                    View All →
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Booking Button and Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:inline-block bg-primary text-primary-foreground px-6 py-2 rounded font-medium transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95">
              Book Now
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fade-up">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-foreground hover:bg-muted rounded transition-smooth"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  animation: `fadeUp 0.3s ease-in-out ${0.05 * (index + 1)}s both`,
                }}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Restaurants Dropdown */}
            <div className="px-4">
              <button
                onClick={() => setIsRestaurantMenuOpen(!isRestaurantMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-foreground hover:bg-muted rounded transition-smooth"
              >
                Restaurants
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${isRestaurantMenuOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              {isRestaurantMenuOpen && (
                <div className="ml-4 mt-2 space-y-1 animate-fade-up">
                  {restaurantOptions.map((restaurant) => (
                    <Link
                      key={restaurant.href}
                      href={restaurant.href}
                      className="block px-4 py-2 text-foreground/80 hover:bg-muted rounded transition-smooth text-sm"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsRestaurantMenuOpen(false);
                      }}
                    >
                      {restaurant.name}
                    </Link>
                  ))}
                  <Link
                    href="/restaurants"
                    className="block px-4 py-2 text-primary font-semibold hover:bg-muted rounded transition-smooth text-sm"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsRestaurantMenuOpen(false);
                    }}
                  >
                    View All →
                  </Link>
                </div>
              )}
            </div>
            
            <button className="w-full mt-4 bg-primary text-primary-foreground px-6 py-2 rounded font-medium transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95">
              Book Now
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

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
    { href: '/restaurants', label: 'Restaurants' },
    { href: '/blog', label: 'Blog' },
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
            <button className="w-full mt-4 bg-primary text-primary-foreground px-6 py-2 rounded font-medium transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95">
              Book Now
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

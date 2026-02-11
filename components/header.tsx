'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    { name: 'Winking Owl', href: '/restaurants#winking-owl' },
    { name: 'Coastal Sea Food', href: '/restaurants#coastal-seafood' },
   
  ];

  return (
    <header className={`sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b-2 border-primary/20 transition-all duration-300 ${hasScrolled ? 'shadow-lg shadow-primary/5' : 'shadow-sm'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 md:h-20 py-2">
          {/* Logos */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-300">
            <Image
              src="/The Myriad Hotel.png"
              alt="The Myriad Hotel"
              width={200}
              height={70}
              className="h-12 md:h-14 w-auto object-contain"
              priority
            />
            <Image
              src="/Aditya Hospitality.png"
              alt="Aditya Hospitality"
              width={290}
              height={90}
              className="h-14 md:h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-foreground/90 font-serif text-sm uppercase tracking-wider group transition-all duration-300"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300" />
              </Link>
            ))}
            
            {/* Restaurants Dropdown */}
            <DropdownMenu onOpenChange={setIsRestaurantMenuOpen}>
              <DropdownMenuTrigger
                className="relative px-4 py-2 text-foreground/90 font-serif text-sm uppercase tracking-wider group flex items-center gap-1 outline-none transition-all duration-300"
              >
                <span className="relative z-10">Restaurants</span>
                <ChevronDown 
                  size={14} 
                  className={`relative z-10 transition-transform duration-300 ${isRestaurantMenuOpen ? 'rotate-180' : ''}`} 
                />
                <span className="absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[220px] mt-2 border-2 border-primary/20 shadow-xl bg-background/95 backdrop-blur-sm">
                {restaurantOptions.map((restaurant) => (
                  <DropdownMenuItem key={restaurant.href} asChild>
                    <Link
                      href={restaurant.href}
                      className="cursor-pointer font-serif text-sm py-2.5 px-4 hover:bg-primary/5 transition-colors duration-200"
                    >
                      {restaurant.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <div className="border-t border-primary/10 my-1" />
                <DropdownMenuItem asChild>
                  <Link
                    href="/restaurants"
                    className="cursor-pointer font-serif font-semibold text-primary py-2.5 px-4 hover:bg-primary/5 transition-colors duration-200"
                  >
                    View All →
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Call Now Button and Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <a 
              href="tel:9619618000"
              className="hidden sm:inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 font-serif text-sm uppercase tracking-wider border-2 border-primary shadow-md hover:shadow-lg hover:bg-primary/95 transition-all duration-300"
            >
              <span>Call Now :</span>
              <span className="font-mono font-semibold text-base">961 961 8000</span>
            </a>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground/90 hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 pt-4 space-y-1 border-t border-primary/10 animate-fade-up">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 text-foreground/90 font-serif text-sm uppercase tracking-wider hover:bg-primary/5 hover:text-primary transition-all duration-200 border-l-2 border-transparent hover:border-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Restaurants Dropdown */}
            <div className="px-4">
              <button
                onClick={() => setIsRestaurantMenuOpen(!isRestaurantMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-foreground/90 font-serif text-sm uppercase tracking-wider hover:bg-primary/5 hover:text-primary transition-all duration-200 border-l-2 border-transparent hover:border-primary"
              >
                Restaurants
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-300 ${isRestaurantMenuOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              {isRestaurantMenuOpen && (
                <div className="ml-6 mt-2 space-y-1 border-l-2 border-primary/20 pl-4">
                  {restaurantOptions.map((restaurant) => (
                    <Link
                      key={restaurant.href}
                      href={restaurant.href}
                      className="block px-4 py-2 text-foreground/70 hover:text-primary hover:bg-primary/5 rounded transition-all duration-200 text-sm font-serif"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsRestaurantMenuOpen(false);
                      }}
                    >
                      {restaurant.name}
                    </Link>
                  ))}
                  <div className="border-t border-primary/10 my-2" />
                  <Link
                    href="/restaurants"
                    className="block px-4 py-2 text-primary font-serif font-semibold hover:bg-primary/5 rounded transition-all duration-200 text-sm"
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
            
            <div className="pt-4 border-t border-primary/10 mt-4">
              <a 
                href="tel:9619618000"
                className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-8 py-3 font-serif text-sm uppercase tracking-wider border-2 border-primary shadow-md hover:shadow-lg transition-all duration-300"
              >
                <span>Call Now :</span>
                <span className="font-mono font-semibold text-base">961 961 8000</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

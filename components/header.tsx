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
import { Room } from '@/lib/models/room';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isRestaurantMenuOpen, setIsRestaurantMenuOpen] = useState(false);
  const [isRoomsMenuOpen, setIsRoomsMenuOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await fetch('/api/rooms');
        if (response.ok) {
          const data = await response.json();
          // Define the desired order sequence
          const roomOrder = [
            'Deluxe Room',
            'Deluxe Twin',
            'Super Deluxe',
            'Executive Room',
            'Executive Suite',
            'Presidential Suite'
          ];
          
          // Sort rooms based on the defined order
          const sortedRooms = [...data].sort((a, b) => {
            const roomNameA = (a.name || a.title || '').trim();
            const roomNameB = (b.name || b.title || '').trim();
            
            const indexA = roomOrder.findIndex(order => 
              roomNameA.toLowerCase() === order.toLowerCase()
            );
            const indexB = roomOrder.findIndex(order => 
              roomNameB.toLowerCase() === order.toLowerCase()
            );
            
            // If both are in the order list, sort by their position
            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB;
            }
            // If only A is in the order list, A comes first
            if (indexA !== -1) return -1;
            // If only B is in the order list, B comes first
            if (indexB !== -1) return 1;
            // If neither is in the order list, maintain original order
            return 0;
          });
          
          setRooms(sortedRooms);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    }
    fetchRooms();
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/banquet', label: 'Banquet Hall' },
  ];

  const restaurantOptions = [
    { name: 'Urban Dhaba', href: '/restaurants/urban-dhaba' },
    { name: 'Winking Owl', href: '/restaurants/winking-owl' },
    { name: 'Coastal Sea Food', href: '/restaurants/coastal-seafood' },
   
  ];

  return (
    <header className={`sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b-2 border-primary/20 transition-all duration-300 ${hasScrolled ? 'shadow-lg shadow-primary/5' : 'shadow-sm'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center md:justify-between items-center min-h-18 md:min-h-20 py-2 relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-300 md:-ml-12">
            <div className="p-2">
              <Image
                src="/Rose Day ka plan tha.png"
                alt="The Myriad Hotel"
                width={200}
                height={70}
                className="h-16 md:h-20 w-auto object-contain"
                priority
              />
            </div>
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
            
            {/* Rooms Dropdown */}
            {rooms.length > 0 && (
              <DropdownMenu onOpenChange={setIsRoomsMenuOpen}>
                <DropdownMenuTrigger
                  className="relative px-4 py-2 text-foreground/90 font-serif text-sm uppercase tracking-wider group flex items-center gap-1 outline-none transition-all duration-300"
                >
                  <span className="relative z-10">Rooms</span>
                  <ChevronDown 
                    size={14} 
                    className={`relative z-10 transition-transform duration-300 ${isRoomsMenuOpen ? 'rotate-180' : ''}`} 
                  />
                  <span className="absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[220px] mt-2 border-2 border-primary/20 shadow-xl bg-background/95 backdrop-blur-sm">
                  {rooms.map((room) => (
                    <DropdownMenuItem key={room.id || room._id} asChild>
                      <Link
                        href={`/rooms/${room.id || room._id}`}
                        className="cursor-pointer font-serif text-sm py-2.5 px-4 hover:bg-primary/5 transition-colors duration-200"
                      >
                        {room.name || room.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
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
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Testimonial Link */}
            <Link
              href="/blog"
              className="relative px-4 py-2 text-foreground/90 font-serif text-sm uppercase tracking-wider group transition-all duration-300"
            >
              <span className="relative z-10">Testimonial</span>
              <span className="absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300" />
            </Link>
          </div>

          {/* Call Now Button and Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <a 
              href="tel:9619618000"
              className="hidden sm:inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 font-serif text-sm uppercase tracking-wider border-2 border-primary shadow-md hover:shadow-lg hover:bg-primary/95 transition-all duration-300"
            >
              <span>Call Now :</span>
              <span className="font-mono font-semibold text-base">961 961 8000</span>
            </a>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="absolute right-0 md:relative md:right-auto md:hidden p-2 text-foreground/90 hover:text-foreground transition-colors"
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
            
            {/* Mobile Rooms Dropdown */}
            {rooms.length > 0 && (
              <div className="px-4">
                <button
                  onClick={() => setIsRoomsMenuOpen(!isRoomsMenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-foreground/90 font-serif text-sm uppercase tracking-wider hover:bg-primary/5 hover:text-primary transition-all duration-200 border-l-2 border-transparent hover:border-primary"
                >
                  Rooms
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-300 ${isRoomsMenuOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                {isRoomsMenuOpen && (
                  <div className="ml-6 mt-2 space-y-1 border-l-2 border-primary/20 pl-4">
                    {rooms.map((room) => (
                      <Link
                        key={room.id || room._id}
                        href={`/rooms/${room.id || room._id}`}
                        className="block px-4 py-2 text-foreground/70 hover:text-primary hover:bg-primary/5 rounded transition-all duration-200 text-sm font-serif"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsRoomsMenuOpen(false);
                        }}
                      >
                        {room.name || room.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            
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
                </div>
              )}
            </div>
            
            {/* Mobile Testimonial Link */}
            <Link
              href="/blog"
              className="block px-4 py-3 text-foreground/90 font-serif text-sm uppercase tracking-wider hover:bg-primary/5 hover:text-primary transition-all duration-200 border-l-2 border-transparent hover:border-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonial
            </Link>
            
            <div className="pt-4 border-t border-primary/10 mt-4">
              <a 
                href="tel:9619618000"
                className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-8 py-3 font-serif text-sm uppercase tracking-wider border-2 border-primary shadow-md hover:shadow-lg transition-all duration-300"
              >
                <span>Call Now :</span>
                <span className="font-mono font-semibold text-base">961 961 8000</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

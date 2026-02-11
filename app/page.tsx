'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Star, MapPin, Wifi, Coffee, Dumbbell } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';
import { Banner } from '@/lib/models/banner';

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    try {
      const response = await fetch('/api/banners');
      if (response.ok) {
        const data = await response.json();
        // Filter only active banners for home page
        const activeBanners = data.filter(
          (banner: Banner) => banner.isActive && (banner.page === 'home' || !banner.page)
        );
        setBanners(activeBanners);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  }

  // Default banner if none exist
  const defaultBanner = {
    title: 'The Myriad Hotel',
    subtitle: 'Experience Timeless Luxury',
    image: '/hero.jpg',
    link: '/rooms',
    buttonText: 'Reserve Your Stay',
  };

  const displayBanners = banners.length > 0 ? banners : [defaultBanner];

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {loading ? (
          <div className="relative w-full h-full">
            <Image
              src="/hero.jpg"
              alt="The Myriad Hotel Lobby"
              fill
              className="object-cover brightness-75"
              priority
              quality={95}
              sizes="100vw"
            />
            <div className="relative z-10 text-center text-white px-4">
              <h1 className="text-6xl md:text-7xl font-serif font-bold mb-4 text-balance animate-fade-up">
                The Myriad Hotel
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light animate-fade-up animate-delay-200">
                Experience Timeless Luxury
              </p>
              <Link href="/rooms" className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded text-lg font-medium transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95 animate-fade-up animate-delay-300">
                Reserve Your Stay
              </Link>
            </div>
          </div>
        ) : displayBanners.length > 1 ? (
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full h-full"
          >
            <CarouselContent className="h-full ml-0">
              {displayBanners.map((banner, index) => (
                <CarouselItem key={index} className="relative h-screen w-full pl-0">
                  <div className="relative h-screen w-full">
                    <Image
                      src={banner.image || '/hero.jpg'}
                      alt={banner.title || 'The Myriad Hotel'}
                      fill
                      className="object-cover brightness-75"
                      priority={index === 0}
                      quality={95}
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
                      <div>
                        <h1 className="text-6xl md:text-7xl font-serif font-bold mb-4 text-balance animate-fade-up">
                          {banner.title || 'The Myriad Hotel'}
                        </h1>
                        {banner.subtitle && (
                          <p className="text-xl md:text-2xl mb-8 font-light animate-fade-up animate-delay-200">
                            {banner.subtitle}
                          </p>
                        )}
                        {(banner.link || banner.buttonText) && (
                          <Link
                            href={banner.link || '/rooms'}
                            className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded text-lg font-medium transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95 animate-fade-up animate-delay-300"
                          >
                            {banner.buttonText || 'Reserve Your Stay'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
            <CarouselNext className="right-4 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
          </Carousel>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={displayBanners[0]?.image || '/hero.jpg'}
              alt={displayBanners[0]?.title || 'The Myriad Hotel'}
              fill
              className="object-cover brightness-75"
              priority
              quality={95}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
              <div>
                <h1 className="text-6xl md:text-7xl font-serif font-bold mb-4 text-balance animate-fade-up">
                  {displayBanners[0]?.title || 'The Myriad Hotel'}
                </h1>
                {displayBanners[0]?.subtitle && (
                  <p className="text-xl md:text-2xl mb-8 font-light animate-fade-up animate-delay-200">
                    {displayBanners[0].subtitle}
                  </p>
                )}
                {(displayBanners[0]?.link || displayBanners[0]?.buttonText) && (
                  <Link
                    href={displayBanners[0].link || '/rooms'}
                    className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded text-lg font-medium transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95 animate-fade-up animate-delay-300"
                  >
                    {displayBanners[0].buttonText || 'Reserve Your Stay'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      

      {/* Featured Rooms */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimationWrapper animation="fadeUp">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-12 text-center text-balance">
              Our Signature Rooms
            </h2>
          </ScrollAnimationWrapper>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Deluxe Suite', price: '$299', image: '/rooms/deluxe.png' },
              { name: 'Premium Suite', price: '$449', image: '/rooms/executive.png' },
              { name: 'Royal Suite', price: '$699', image: '/rooms/superior.png' },
            ].map((room, index) => (
              <ScrollAnimationWrapper key={room.name} animation="scaleIn" delay={index * 100}>
                <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-smooth hover:-translate-y-2">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={room.image || "/placeholder.svg"}
                      alt={room.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      quality={90}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-serif font-bold text-primary mb-2">{room.name}</h3>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="fill-accent text-accent" />
                      ))}
                    </div>
                    <ul className="space-y-2 mb-6 text-foreground/70">
                      <li className="flex items-center gap-2">
                        <Wifi size={16} /> High-speed WiFi
                      </li>
                      <li className="flex items-center gap-2">
                        <Coffee size={16} /> Premium Toiletries
                      </li>
                      <li className="flex items-center gap-2">
                        <Dumbbell size={16} /> City View Balcony
                      </li>
                    </ul>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">{room.price}</span>
                      <Link
                        href="/rooms"
                        className="bg-primary text-primary-foreground px-6 py-2 rounded transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/rooms"
              className="text-primary hover:text-accent font-medium text-lg transition-colors"
            >
              View All Rooms →
            </Link>
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimationWrapper animation="fadeUp">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-12 text-center text-balance">
              Fine Dining Experiences
            </h2>
          </ScrollAnimationWrapper>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Urban Dhaba', 
                cuisine: 'Contemporary Indian', 
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&fit=crop' 
              },
              { 
                name: 'Coastal Sea Food', 
                cuisine: 'Fresh Seafood', 
                image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80&fit=crop' 
              },
              { 
                name: 'Winking Owl – The Lounge Bar', 
                cuisine: 'Craft Cocktails & Tapas', 
                image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80&fit=crop' 
              },
            ].map((restaurant, index) => (
              <ScrollAnimationWrapper key={restaurant.name} animation="fadeUp" delay={index * 100}>
                <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-smooth hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <Image
                      src={restaurant.image || "/placeholder.jpg"}
                      alt={`${restaurant.name} - ${restaurant.cuisine}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      quality={95}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-serif font-bold text-primary mb-1">{restaurant.name}</h3>
                    <p className="text-foreground/70 mb-4">{restaurant.cuisine}</p>
                    <p className="text-foreground/80 mb-6 text-sm">
                      Experience culinary excellence with our award-winning chefs and carefully curated menus.
                    </p>
                    <Link
                      href="/restaurants"
                      className="text-primary hover:text-accent font-medium transition-colors"
                    >
                      Explore Menu →
                    </Link>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Banquet Hall */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimationWrapper animation="slideInRight" delay={200}>
              <div className="relative h-96 rounded-lg overflow-hidden shadow-lg order-2 md:order-1">
                <Image
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=90&fit=crop"
                  alt="Luxury Banquet Hall - Elegant event space for weddings, conferences, and celebrations"
                  fill
                  className="object-cover hover:scale-105 transition-smooth duration-500"
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="slideInLeft" delay={100}>
              <div className="order-1 md:order-2">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 text-balance">
                  Host Your Event
                </h2>
                <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                  The Myriad Hotel features a stunning banquet hall designed for weddings, conferences, and celebrations. With capacity for up to 500 guests and state-of-the-art facilities.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Professional event planning', 'Gourmet catering', 'Modern AV facilities', 'Flexible layouts'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-foreground/80">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/banquet"
                  className="bg-primary text-primary-foreground px-8 py-3 rounded font-medium transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95 inline-block"
                >
                  Inquiry Details
                </Link>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimationWrapper animation="fadeUp">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-12 text-center text-balance">
              Guest Testimonials
            </h2>
          </ScrollAnimationWrapper>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Mitchell', role: 'Wedding Guest', quote: 'Our wedding at The Myriad was absolutely magical. Every detail was perfect.' },
              { name: 'James Chen', role: 'Business Traveler', quote: 'The service and attention to detail are unmatched. I always stay here.' },
              { name: 'Emma Wilson', role: 'Food Critic', quote: 'The restaurants are world-class. The dining experience is exceptional.' },
            ].map((testimonial, index) => (
              <ScrollAnimationWrapper key={testimonial.name} animation="fadeUp" delay={index * 100}>
                <div className="bg-card p-8 rounded-lg border border-border transition-smooth hover:shadow-lg hover:-translate-y-2">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-foreground/80 mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-foreground/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <ScrollAnimationWrapper className="max-w-4xl mx-auto text-center" animation="fadeUp">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-balance">
            Ready to Experience Luxury?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Book your unforgettable stay at The Myriad Hotel today
          </p>
          <button className="bg-primary-foreground text-primary px-8 py-4 rounded text-lg font-medium transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95">
            Book Your Stay Now
          </button>
        </ScrollAnimationWrapper>
      </section>

    </main>
  );
}

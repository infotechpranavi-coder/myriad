'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, MapPin } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';
import { Restaurant } from '@/lib/models/restaurant';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const response = await fetch('/api/restaurants');
        if (response.ok) {
          const data = await response.json();
          setRestaurants(data);
        } else {
          console.error('Failed to fetch restaurants');
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading restaurants...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background">
      {/* Header */}
      <section className="py-16 px-4 bg-muted/30">
        <ScrollAnimationWrapper animation="fadeUp" className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-4 text-balance">
            Fine Dining & Restaurants
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl">
            Indulge in world-class cuisine at our three distinctive restaurants. Each offers a unique culinary journey.
          </p>
        </ScrollAnimationWrapper>
      </section>

      {/* Restaurants */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-16">
            {restaurants.map((restaurant, index) => (
              <ScrollAnimationWrapper key={restaurant.id} animation="fadeUp" delay={index * 100}>
                <div 
                  id={restaurant.slug}
                  className="rounded-lg overflow-hidden shadow-lg border border-border transition-smooth hover:shadow-2xl hover:-translate-y-2 scroll-mt-20"
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative h-96 md:h-auto">
                      <Image
                        src={restaurant.image || "/placeholder.svg"}
                        alt={`${restaurant.name} - ${restaurant.cuisine}`}
                        fill
                        className="object-cover"
                        quality={95}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index === 0}
                      />
                    </div>

                    {/* Content */}
                    <div className="bg-card p-8">
                      {restaurant.slug === 'urban-dhaba' && (
                        <div className="mb-6 flex justify-center">
                          <Image
                            src="/Urban Dhaba.png"
                            alt="Urban Dhaba Logo"
                            width={200}
                            height={80}
                            className="h-16 w-auto object-contain"
                          />
                        </div>
                      )}
                      {restaurant.slug === 'winking-owl' && (
                        <div className="mb-6 flex justify-center">
                          <Image
                            src="/Winkingg Owl.png"
                            alt="Winkingg Owl Logo"
                            width={200}
                            height={80}
                            className="h-16 w-auto object-contain"
                          />
                        </div>
                      )}
                      {restaurant.slug === 'coastal-seafood' && (
                        <div className="mb-6 flex justify-center">
                          <Image
                            src="/Coastal Sea Food.png"
                            alt="Coastal Sea Food Logo"
                            width={200}
                            height={80}
                            className="h-16 w-auto object-contain"
                          />
                        </div>
                      )}
                      <h2 className="text-3xl font-serif font-bold text-primary mb-1">
                        {restaurant.name}
                      </h2>
                      <p className="text-accent font-semibold mb-4">{restaurant.cuisine}</p>
                      <p className="text-foreground/80 text-lg mb-6 leading-relaxed">
                        {restaurant.description}
                      </p>

                      {/* Info */}
                      <div className="space-y-3 mb-6 py-6 border-y border-border">
                        <div className="flex items-center gap-3 text-foreground/70">
                          <Clock size={20} className="text-primary" />
                          <div>
                            <p className="text-sm text-foreground/60">Opening Hours</p>
                            <p className="font-semibold text-foreground">{restaurant.openingHours}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-foreground/70">
                          <Users size={20} className="text-primary" />
                          <div>
                            <p className="text-sm text-foreground/60">Capacity</p>
                            <p className="font-semibold text-foreground">{restaurant.capacity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-foreground/70">
                          <MapPin size={20} className="text-primary" />
                          <div>
                            <p className="text-sm text-foreground/60">Location</p>
                            <p className="font-semibold text-foreground">{restaurant.address}</p>
                          </div>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="mb-6">
                        <h3 className="font-semibold text-foreground mb-3">Highlights</h3>
                        <ul className="grid grid-cols-2 gap-2">
                          {restaurant.highlights.map((highlight) => (
                            <li key={highlight} className="flex items-start gap-2 text-foreground/70">
                              <span className="text-primary mt-1">✓</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Button */}
                      <Link
                        href={`/restaurants/${restaurant.slug}`}
                        className="block w-full bg-primary text-primary-foreground px-8 py-3 rounded font-medium hover:opacity-90 transition-opacity text-center"
                      >
                        Book a Table
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Dining Philosophy */}
      <section className="py-20 px-4 bg-muted/30">
        <ScrollAnimationWrapper className="max-w-4xl mx-auto text-center" animation="fadeUp">
          <h2 className="text-4xl font-serif font-bold text-primary mb-6 text-balance">
            Our Dining Philosophy
          </h2>
          <p className="text-lg text-foreground/80 leading-relaxed mb-6">
            We believe that exceptional dining is more than just food. It's about creating memorable experiences through impeccable service, ambiance, and culinary artistry. Our chefs source only the finest ingredients and prepare each dish with meticulous attention to detail.
          </p>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Whether you're celebrating a special occasion or simply enjoying an evening with loved ones, our restaurants provide the perfect setting for an unforgettable culinary journey.
          </p>
        </ScrollAnimationWrapper>
      </section>

      {/* Special Events */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimationWrapper animation="fadeUp">
            <h2 className="text-4xl font-serif font-bold text-primary mb-12 text-center text-balance">
              Private Dining & Events
            </h2>
          </ScrollAnimationWrapper>
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollAnimationWrapper animation="slideInLeft" delay={100}>
              <div className="bg-card p-8 rounded-lg border border-border transition-smooth hover:shadow-lg hover:-translate-y-2">
                <h3 className="text-2xl font-serif font-bold text-primary mb-4">
                  Corporate Events
                </h3>
                <ul className="space-y-3 text-foreground/80 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span> Customized menus
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span> Full AV setup
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span> Professional staff
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span> Flexible timing
                  </li>
                </ul>
                <button className="text-primary hover:text-accent font-medium transition-colors">
                  Inquire Now →
                </button>
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="slideInRight" delay={100}>
              <div className="bg-card p-8 rounded-lg border border-border transition-smooth hover:shadow-lg hover:-translate-y-2">
                <h3 className="text-2xl font-serif font-bold text-primary mb-4">
                  Special Occasions
                </h3>
                <ul className="space-y-3 text-foreground/80 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span> Intimate dinners
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span> Anniversary celebrations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span> Milestone parties
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span> Personalized service
                  </li>
                </ul>
                <button className="text-primary hover:text-accent font-medium transition-colors">
                  Plan Your Event →
                </button>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <ScrollAnimationWrapper className="max-w-4xl mx-auto text-center" animation="fadeUp">
          <h2 className="text-4xl font-serif font-bold mb-6 text-balance">
            Ready to Dine With Us?
          </h2>
          <button className="bg-primary-foreground text-primary px-8 py-4 rounded text-lg font-medium transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95">
            Reserve a Table
          </button>
        </ScrollAnimationWrapper>
      </section>
    </main>
  );
}

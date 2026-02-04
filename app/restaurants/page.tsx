'use client';

import Image from 'next/image';
import { Clock, Users, MapPin } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';

const restaurants = [
  {
    id: 1,
    name: 'Urban Dhaba',
    cuisine: 'Contemporary Indian',
    image: '/hero.jpg',
    description: 'Experience authentic Indian flavors elevated to fine dining standards. Our signature dishes blend traditional recipes with modern culinary techniques.',
    openingHours: '11:30 AM - 11:00 PM',
    capacity: 'Up to 60 guests',
    address: 'Ground Floor, The Myriad Hotel',
    highlights: [
      'Award-winning chef',
      'Tandoori specialties',
      'Curated wine selection',
      'Private dining available',
    ],
  },
  {
    id: 2,
    name: 'Coastal Sea Food',
    cuisine: 'Fresh Seafood',
    image: '/hero.jpg',
    description: 'Dive into our exquisite seafood collection sourced daily from premium suppliers. Immerse yourself in the flavors of the ocean.',
    openingHours: '12:00 PM - 11:30 PM',
    capacity: 'Up to 80 guests',
    address: '2nd Floor, The Myriad Hotel',
    highlights: [
      'Fresh daily catch',
      'Chef\'s tasting menu',
      'Beachfront ambiance',
      'Sommelier-curated pairs',
    ],
  },
  {
    id: 3,
    name: 'Winking Owl – The Lounge Bar',
    cuisine: 'Craft Cocktails & Tapas',
    image: '/hero.jpg',
    description: 'A sophisticated lounge bar featuring signature cocktails crafted by award-winning mixologists. Perfect for evening entertainment.',
    openingHours: '5:00 PM - 2:00 AM',
    capacity: 'Up to 100 guests',
    address: '3rd Floor, The Myriad Hotel',
    highlights: [
      'Craft cocktails',
      'Live music evenings',
      'Small plates menu',
      'Rooftop terrace',
    ],
  },
];

export default function RestaurantsPage() {
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
                <div className="rounded-lg overflow-hidden shadow-lg border border-border transition-smooth hover:shadow-2xl hover:-translate-y-2">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative h-96">
                      <Image
                        src={restaurant.image || "/placeholder.svg"}
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="bg-card p-8">
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
                      <button className="w-full bg-primary text-primary-foreground px-8 py-3 rounded font-medium hover:opacity-90 transition-opacity">
                        Book a Table
                      </button>
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

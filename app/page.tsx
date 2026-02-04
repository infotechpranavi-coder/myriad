'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Wifi, Coffee, Dumbbell } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';

export default function Home() {
  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
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
          <button className="bg-primary text-primary-foreground px-8 py-4 rounded text-lg font-medium transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95 animate-fade-up animate-delay-300">
            Reserve Your Stay
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimationWrapper animation="slideInLeft">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 text-balance">
                Welcome to The Myriad Hotel
              </h2>
              <p className="text-lg text-foreground/80 mb-4 leading-relaxed">
                Nestled in the heart of the city, The Myriad Hotel represents the pinnacle of luxury hospitality. Our commitment to excellence is reflected in every aspect of your stay.
              </p>
              <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                From our meticulously designed suites to our world-class dining establishments, every detail has been crafted to provide an unforgettable experience.
              </p>
              <Link
                href="#contact"
                className="text-primary hover:text-accent font-medium text-lg transition-colors"
              >
                Learn More →
              </Link>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="slideInRight" delay={200}>
              <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/hero.jpg"
                  alt="Hotel Interior"
                  fill
                  className="object-cover hover:scale-105 transition-smooth duration-500"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
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

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8 animate-fade-up animate-delay-200">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">The Myriad</h3>
              <p className="text-background/70 text-sm">Experience timeless luxury at the heart of the city.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/rooms" className="text-background/70 hover:text-background">Rooms</Link></li>
                <li><Link href="/restaurants" className="text-background/70 hover:text-background">Restaurants</Link></li>
                <li><Link href="/banquet" className="text-background/70 hover:text-background">Banquet Hall</Link></li>
                <li><Link href="/blog" className="text-background/70 hover:text-background">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-background/70 hover:text-background">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-background/70 hover:text-background">Terms & Conditions</Link></li>
                <li><Link href="/contact" className="text-background/70 hover:text-background">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-background/70 hover:text-background">Facebook</a>
                <a href="#" className="text-background/70 hover:text-background">Instagram</a>
                <a href="#" className="text-background/70 hover:text-background">Twitter</a>
              </div>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-sm text-background/70">
            <p>{'©'} 2024 The Myriad Hotel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

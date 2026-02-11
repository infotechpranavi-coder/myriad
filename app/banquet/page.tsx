'use client';

import Image from 'next/image';
import { Users, Layout, Lightbulb, Wifi, Volume2 } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';
import { useState, useEffect } from 'react';
import { BanquetGalleryImage } from '@/lib/models/banquet-gallery';

export default function BanquetPage() {
  const [galleryImages, setGalleryImages] = useState<BanquetGalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  async function fetchGalleryImages() {
    try {
      setLoadingGallery(true);
      const response = await fetch('/api/banquet-gallery');
      if (response.ok) {
        const data = await response.json();
        // Filter only active images
        const activeImages = data.filter((img: BanquetGalleryImage) => img.isActive);
        setGalleryImages(activeImages);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoadingGallery(false);
    }
  }

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-muted/30">
        <ScrollAnimationWrapper animation="fadeUp" className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-4 text-balance">
            Banquet Hall & Event Spaces
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl">
            Host your most important events in our stunning banquet hall. From weddings to conferences, we create unforgettable moments.
          </p>
        </ScrollAnimationWrapper>
      </section>

      {/* Main Banquet Hall */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimationWrapper animation="slideInLeft" delay={100}>
              <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/hero.jpg"
                  alt="Banquet Hall"
                  fill
                  className="object-cover hover:scale-105 transition-smooth duration-500"
                />
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="slideInRight" delay={200}>
              <div>
                <h2 className="text-4xl font-serif font-bold text-primary mb-6 text-balance">
                  The Grand Ballroom
                </h2>
                <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                  The Grand Ballroom is our flagship event space, designed to accommodate up to 500 guests. With soaring ceilings, elegant chandeliers, and state-of-the-art facilities, it's the perfect venue for weddings, conferences, gala dinners, and celebrations.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-muted/50 p-4 rounded">
                    <p className="text-foreground/60 text-sm mb-1">Capacity</p>
                    <p className="text-2xl font-bold text-primary">Up to 500</p>
                    <p className="text-foreground/60 text-xs">Guests</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded">
                    <p className="text-foreground/60 text-sm mb-1">Space</p>
                    <p className="text-2xl font-bold text-primary">8,500</p>
                    <p className="text-foreground/60 text-xs">Sq. Feet</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded">
                    <p className="text-foreground/60 text-sm mb-1">Ceiling Height</p>
                    <p className="text-2xl font-bold text-primary">28</p>
                    <p className="text-foreground/60 text-xs">Feet</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded">
                    <p className="text-foreground/60 text-sm mb-1">Flexibility</p>
                    <p className="text-2xl font-bold text-primary">100%</p>
                    <p className="text-foreground/60 text-xs">Customizable</p>
                  </div>
                </div>

                <button className="bg-primary text-primary-foreground px-8 py-3 rounded font-medium hover:opacity-90 transition-opacity">
                  Request Proposal
                </button>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimationWrapper animation="fadeUp">
            <h2 className="text-4xl font-serif font-bold text-primary mb-12 text-center text-balance">
              Premium Facilities
            </h2>
          </ScrollAnimationWrapper>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lightbulb className="text-primary" size={32} />,
                name: 'Professional Lighting',
                desc: 'State-of-the-art lighting systems for any ambiance',
              },
              {
                icon: <Volume2 className="text-primary" size={32} />,
                name: 'Sound System',
                desc: 'Crystal-clear audio with professional sound engineering',
              },
              {
                icon: <Wifi className="text-primary" size={32} />,
                name: 'High-Speed WiFi',
                desc: 'Reliable connectivity for hybrid and virtual events',
              },
              {
                icon: <Layout className="text-primary" size={32} />,
                name: 'Flexible Layouts',
                desc: 'Multiple configuration options for any event type',
              },
              {
                icon: <Users className="text-primary" size={32} />,
                name: 'Break-Out Spaces',
                desc: 'Dedicated areas for networking and breakout sessions',
              },
              {
                icon: <div className="text-primary text-3xl">📺</div>,
                name: 'AV Equipment',
                desc: 'Large screens, projectors, and live streaming capability',
              },
            ].map((facility, idx) => (
              <ScrollAnimationWrapper key={idx} animation="scaleIn" delay={idx * 50}>
                <div className="bg-card p-6 rounded-lg border border-border text-center transition-smooth hover:shadow-lg hover:-translate-y-2">
                  <div className="flex justify-center mb-4">{facility.icon}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{facility.name}</h3>
                  <p className="text-foreground/70">{facility.desc}</p>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimationWrapper animation="fadeUp">
            <h2 className="text-4xl font-serif font-bold text-primary mb-12 text-center text-balance">
              Perfect For Every Occasion
            </h2>
          </ScrollAnimationWrapper>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Weddings',
                items: ['Ceremonies & receptions', 'Customizable décor', 'In-house catering', 'Professional coordination'],
              },
              {
                title: 'Corporate Events',
                items: ['Conferences & seminars', 'Product launches', 'Team building events', 'Executive galas'],
              },
              {
                title: 'Private Celebrations',
                items: ['Birthday parties', 'Anniversary dinners', 'Milestone celebrations', 'Intimate gatherings'],
              },
              {
                title: 'Large Gatherings',
                items: ['Trade shows', 'Exhibitions', 'Festivals', 'Community events'],
              },
            ].map((eventType, idx) => (
              <ScrollAnimationWrapper key={idx} animation="fadeUp" delay={idx * 100}>
                <div className="bg-card p-8 rounded-lg border border-border transition-smooth hover:shadow-lg hover:-translate-y-2">
                  <h3 className="text-2xl font-serif font-bold text-primary mb-4">
                    {eventType.title}
                  </h3>
                  <ul className="space-y-3">
                    {eventType.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-foreground/80">
                        <span className="text-primary mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Services & Support */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimationWrapper animation="fadeUp">
            <h2 className="text-4xl font-serif font-bold text-primary mb-12 text-center text-balance">
              Complete Event Solutions
            </h2>
          </ScrollAnimationWrapper>
          <div className="grid md:grid-cols-2 gap-12">
            <ScrollAnimationWrapper animation="slideInLeft" delay={100}>
              <div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-6">
                  Catering Services
                </h3>
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  Our award-winning culinary team can create bespoke menus tailored to your event. From elegant cocktail receptions to multi-course dinners, we deliver exceptional cuisine with impeccable service.
                </p>
                <ul className="space-y-3">
                  {[
                    'Customized menus',
                    'Dietary accommodations',
                    'Bar service management',
                    'Professional waitstaff',
                  ].map((service) => (
                    <li key={service} className="flex items-center gap-2 text-foreground/80">
                      <span className="text-primary">•</span> {service}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="slideInRight" delay={200}>
              <div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-6">
                  Event Planning & Coordination
                </h3>
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  Our experienced event planners will handle every detail of your event, from initial concept to execution. We ensure flawless coordination and exceed expectations.
                </p>
                <ul className="space-y-3">
                  {[
                    'Dedicated event manager',
                    'Floor planning assistance',
                    'Vendor coordination',
                    'Day-of execution',
                  ].map((service) => (
                    <li key={service} className="flex items-center gap-2 text-foreground/80">
                      <span className="text-primary">•</span> {service}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="py-20 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <ScrollAnimationWrapper animation="fadeUp">
              <h2 className="text-4xl font-serif font-bold text-primary mb-12 text-center text-balance">
                Gallery
              </h2>
            </ScrollAnimationWrapper>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <ScrollAnimationWrapper key={image._id} animation="scaleIn" delay={index * 100}>
                  <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
                    <Image
                      src={image.image}
                      alt={image.title || 'Banquet gallery image'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized={!image.image.includes('res.cloudinary.com')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        {image.title && (
                          <h3 className="text-xl font-serif font-bold mb-2">{image.title}</h3>
                        )}
                        {image.description && (
                          <p className="text-sm text-white/90 line-clamp-2">{image.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <ScrollAnimationWrapper className="max-w-4xl mx-auto text-center" animation="fadeUp">
          <h2 className="text-4xl font-serif font-bold mb-6 text-balance">
            Let Us Host Your Next Event
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Contact our events team to discuss your requirements
          </p>
          <button className="bg-primary-foreground text-primary px-8 py-4 rounded text-lg font-medium transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95">
            Get in Touch
          </button>
        </ScrollAnimationWrapper>
      </section>
    </main>
  );
}

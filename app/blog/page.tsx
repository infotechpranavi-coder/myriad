'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';
import { Testimonial } from '@/lib/models/testimonial';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';

export default function BlogPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    try {
      setLoading(true);
      const response = await fetch('/api/testimonials');
      if (response.ok) {
        const data = await response.json();
        // Filter only active testimonials and sort by order
        const activeTestimonials = data
          .filter((t: Testimonial) => t.isActive)
          .sort((a: Testimonial, b: Testimonial) => (a.order || 0) - (b.order || 0));
        setTestimonials(activeTestimonials);
      } else {
        console.error('Failed to fetch testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="bg-background">
      {/* Header */}
      <section className="py-16 px-4 bg-muted/30">
        <ScrollAnimationWrapper animation="fadeUp" className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-4 text-balance">
            Guest Testimonials
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl">
            Discover what our guests have to say about their experiences at The Myriad Hotel.
          </p>
        </ScrollAnimationWrapper>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimationWrapper animation="fadeUp">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-12 text-center text-balance">
              What Our Guests Say
            </h2>
          </ScrollAnimationWrapper>
          {testimonials.length > 0 ? (
            <Carousel
              plugins={[plugin.current]}
              className="w-full"
              opts={{
                align: 'start',
                loop: true,
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial._id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="bg-card p-8 rounded-lg border border-border transition-smooth hover:shadow-lg hover:-translate-y-2 h-full">
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-foreground/80 mb-6 italic">"{testimonial.quote}"</p>
                      <div className="flex items-center gap-3">
                        {testimonial.image && (
                          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-foreground/60 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
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
          )}
        </div>
      </section>

    </main>
  );
}

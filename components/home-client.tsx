'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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
import { Room } from '@/lib/models/room';
import { Restaurant } from '@/lib/models/restaurant';
import { Testimonial } from '@/lib/models/testimonial';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface HomeClientProps {
  banners: Banner[];
  rooms: Room[];
  restaurants: Restaurant[];
  testimonials: Testimonial[];
}

export default function HomeClient({ banners, rooms, restaurants, testimonials }: HomeClientProps) {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryFormData, setInquiryFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guestCount: '',
    message: '',
  });
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Inquiry submitted:', inquiryFormData);
    // You can add API call here to save the inquiry
    alert('Thank you for your inquiry! We will contact you soon.');
    setInquiryModalOpen(false);
    // Reset form
    setInquiryFormData({
      name: '',
      email: '',
      phone: '',
      eventType: '',
      eventDate: '',
      guestCount: '',
      message: '',
    });
  };

  // Filter only active banners for home page
  const activeBanners = banners.filter(
    (banner: Banner) => banner.isActive && (banner.page === 'home' || !banner.page)
  );

  // Default banner if none exist
  const defaultBanner = {
    title: 'The Myriad Hotel',
    subtitle: 'Experience Timeless Luxury',
    image: '/hero.jpg',
    images: ['/hero.jpg'],
    link: '/rooms',
    buttonText: 'Reserve Your Stay',
  };

  const displayBanners = activeBanners.length > 0 ? activeBanners : [defaultBanner];

  // Flatten all images from banners into a single array for the slider
  const allSliderImages = displayBanners.flatMap((banner) => {
    if (banner.images && banner.images.length > 0) {
      return banner.images.map((img, index) => ({
        image: img,
        banner: banner,
        slideIndex: index,
      }));
    } else if (banner.image) {
      return [{
        image: banner.image,
        banner: banner,
        slideIndex: 0,
      }];
    }
    return [];
  });

  // Filter and sort testimonials
  const activeTestimonials = testimonials
    .filter((t: Testimonial) => t.isActive)
    .sort((a: Testimonial, b: Testimonial) => (a.order || 0) - (b.order || 0));

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="relative h-[75vh] flex items-center justify-center overflow-hidden">
        {allSliderImages.length > 1 ? (
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full h-full"
          >
            <CarouselContent className="h-full ml-0">
              {allSliderImages.map((slide, index) => (
                <CarouselItem key={`${(slide.banner as any)._id || index}-${slide.slideIndex}`} className="relative h-[75vh] w-full pl-0">
                  <div className="relative h-[75vh] w-full">
                    <Image
                      src={slide.image || '/hero.jpg'}
                      alt={slide.banner.title || 'The Myriad Hotel'}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      quality={95}
                      sizes="100vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
            <CarouselNext className="right-4 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
          </Carousel>
        ) : allSliderImages.length === 1 ? (
          <div className="relative w-full h-full">
            <Image
              src={allSliderImages[0].image || '/hero.jpg'}
              alt={allSliderImages[0].banner.title || 'The Myriad Hotel'}
              fill
              className="object-cover"
              priority
              quality={95}
              sizes="100vw"
            />
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src="/hero.jpg"
              alt="The Myriad Hotel"
              fill
              className="object-cover"
              priority
              quality={95}
              sizes="100vw"
            />
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
          {rooms.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No rooms available at the moment.</p>
            </div>
          ) : (
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              plugins={[plugin.current]}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {rooms.map((room, index) => {
                  // Get room images - check gallery first, then images (matching room detail page)
                  const roomImages = room.gallery || room.images || [];
                  const roomImage = roomImages.length > 0 ? roomImages[0] : null;
                  
                  return (
                  <CarouselItem key={room.id || room._id || index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <ScrollAnimationWrapper animation="scaleIn" delay={index * 100}>
                      <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-smooth hover:-translate-y-2 h-full">
                        <div className="relative h-64 overflow-hidden bg-muted">
                          {roomImage ? (
                            <Image
                              src={roomImage}
                              alt={room.name || room.title || 'Room image'}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                              quality={90}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder.svg";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                              <span>No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-serif font-bold text-primary mb-2">{room.name || room.title}</h3>
                          {room.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                              <MapPin size={14} />
                              {room.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} className="fill-accent text-accent" />
                            ))}
                          </div>
                          <ul className="space-y-2 mb-6 text-foreground/70">
                            {room.amenities && room.amenities.slice(0, 3).map((amenity, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <Wifi size={16} /> {amenity}
                              </li>
                            ))}
                            {(!room.amenities || room.amenities.length === 0) && (
                              <>
                                <li className="flex items-center gap-2">
                                  <Wifi size={16} /> High-speed WiFi
                                </li>
                                <li className="flex items-center gap-2">
                                  <Coffee size={16} /> Premium Toiletries
                                </li>
                                <li className="flex items-center gap-2">
                                  <Dumbbell size={16} /> City View Balcony
                                </li>
                              </>
                            )}
                          </ul>
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-primary">
                              ₹{(room.price || room.priceSummary?.basePrice || 0).toLocaleString()}
                            </span>
                            <Link
                              href={`/rooms/${room.id || room._id}`}
                              className="bg-primary text-primary-foreground px-6 py-2 rounded transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </ScrollAnimationWrapper>
                  </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="left-0 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
              <CarouselNext className="right-0 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
            </Carousel>
          )}
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
            {restaurants.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                <p>No restaurants available at the moment.</p>
              </div>
            ) : (
              restaurants.slice(0, 3).map((restaurant, index) => (
                <ScrollAnimationWrapper key={restaurant.id || restaurant._id || index} animation="fadeUp" delay={index * 100}>
                  <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-smooth hover:-translate-y-2 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden bg-muted shrink-0">
                      <Image
                        src={restaurant.image || (restaurant.gallery && restaurant.gallery.length > 0 ? restaurant.gallery[0] : "/placeholder.jpg")}
                        alt={`${restaurant.name} - ${restaurant.cuisine}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        quality={95}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-2xl font-serif font-bold text-primary mb-1">{restaurant.name}</h3>
                      <p className="text-foreground/70 mb-4">{restaurant.cuisine}</p>
                      <p className="text-foreground/80 mb-6 text-sm flex-1">
                        {restaurant.description || restaurant.about || 'Experience culinary excellence with our award-winning chefs and carefully curated menus.'}
                      </p>
                      <Link
                        href={`/restaurants/${restaurant.slug || restaurant.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded font-medium hover:opacity-90 transition-opacity text-center text-sm w-full mt-auto"
                      >
                        Book a Table
                      </Link>
                    </div>
                  </div>
                </ScrollAnimationWrapper>
              ))
            )}
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
                  src="/WhatsApp Image 2026-02-25 at 1.02.17 PM.jpeg"
                  alt="Luxury Banquet Hall - Elegant event space for weddings, conferences, and celebrations"
                  fill
                  className="object-cover hover:scale-105 transition-smooth duration-500"
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="slideInLeft" delay={100}>
              <div className="order-1 md:order-2 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 text-balance">
                  Host Your Event
                </h2>
                <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                  The Myriad Hotel features a stunning banquet hall designed for weddings, conferences, and celebrations. With capacity for up to 500 guests and state-of-the-art facilities.
                </p>
                <ul className="space-y-3 mb-8 flex flex-col items-center md:items-start">
                  {['Professional event planning', 'Gourmet catering', 'Modern AV facilities', 'Flexible layouts'].map((item) => (
                    <li key={item} className="flex items-center gap-2 md:gap-3 text-foreground/80 justify-center md:justify-start">
                      <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-center md:justify-start">
                  <button
                    onClick={() => setInquiryModalOpen(true)}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded font-medium transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95 inline-block"
                  >
                    Inquiry Details
                  </button>
                </div>
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
          {activeTestimonials.length > 0 ? (
            <Carousel
              plugins={[plugin.current]}
              className="w-full"
              opts={{
                align: 'start',
                loop: true,
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {activeTestimonials.map((testimonial) => (
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
                          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-foreground/60 text-sm">{testimonial.role || 'Guest'}</p>
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
            <div className="text-center py-12 text-muted-foreground">
              <p>No testimonials available yet. Check back soon for guest reviews!</p>
            </div>
          )}
        </div>
      </section>

      {/* Inquiry Modal */}
      <Dialog open={inquiryModalOpen} onOpenChange={setInquiryModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-primary">Event Inquiry</DialogTitle>
            <DialogDescription>
              Fill out the form below to inquire about hosting your event at The Myriad Hotel.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInquirySubmit} className="space-y-4 mt-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="inquiry-name" className="text-foreground font-medium">
                Full Name *
              </Label>
              <Input
                id="inquiry-name"
                type="text"
                placeholder="Enter your full name"
                value={inquiryFormData.name}
                onChange={(e) => setInquiryFormData({ ...inquiryFormData, name: e.target.value })}
                required
                className="w-full"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="inquiry-email" className="text-foreground font-medium">
                Email Address
              </Label>
              <Input
                id="inquiry-email"
                type="email"
                placeholder="Enter your email address (optional)"
                value={inquiryFormData.email}
                onChange={(e) => setInquiryFormData({ ...inquiryFormData, email: e.target.value })}
                className="w-full"
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="inquiry-phone" className="text-foreground font-medium">
                Phone Number *
              </Label>
              <Input
                id="inquiry-phone"
                type="tel"
                placeholder="Enter your phone number"
                value={inquiryFormData.phone}
                onChange={(e) => setInquiryFormData({ ...inquiryFormData, phone: e.target.value })}
                required
                className="w-full"
              />
            </div>

            {/* Event Type Field */}
            <div className="space-y-2">
              <Label htmlFor="inquiry-event-type" className="text-foreground font-medium">
                Event Type *
              </Label>
              <Input
                id="inquiry-event-type"
                type="text"
                placeholder="e.g., Wedding, Conference, Birthday, etc."
                value={inquiryFormData.eventType}
                onChange={(e) => setInquiryFormData({ ...inquiryFormData, eventType: e.target.value })}
                required
                className="w-full"
              />
            </div>

            {/* Event Date and Guest Count */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inquiry-event-date" className="text-foreground font-medium">
                  Event Date *
                </Label>
                <Input
                  id="inquiry-event-date"
                  type="date"
                  value={inquiryFormData.eventDate}
                  onChange={(e) => setInquiryFormData({ ...inquiryFormData, eventDate: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inquiry-guest-count" className="text-foreground font-medium">
                  Expected Guests *
                </Label>
                <Input
                  id="inquiry-guest-count"
                  type="number"
                  placeholder="Number of guests"
                  value={inquiryFormData.guestCount}
                  onChange={(e) => setInquiryFormData({ ...inquiryFormData, guestCount: e.target.value })}
                  required
                  min="1"
                  className="w-full"
                />
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <Label htmlFor="inquiry-message" className="text-foreground font-medium">
                Additional Details
              </Label>
              <Textarea
                id="inquiry-message"
                placeholder="Tell us more about your event requirements..."
                value={inquiryFormData.message}
                onChange={(e) => setInquiryFormData({ ...inquiryFormData, message: e.target.value })}
                rows={4}
                className="w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setInquiryModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
              >
                Submit Inquiry
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </main>
  );
}

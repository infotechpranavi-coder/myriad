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
import { Room } from '@/lib/models/room';
import { Restaurant } from '@/lib/models/restaurant';
import { Testimonial } from '@/lib/models/testimonial';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchBanners();
    fetchRooms();
    fetchRestaurants();
    fetchTestimonials();
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

  async function fetchRooms() {
    try {
      const response = await fetch('/api/rooms');
      if (response.ok) {
        const data = await response.json();
        // Fetch all rooms for the carousel
        setRooms(data);
      } else {
        console.error('Failed to fetch rooms');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  }

  async function fetchRestaurants() {
    try {
      const response = await fetch('/api/restaurants');
      if (response.ok) {
        const data = await response.json();
        // Limit to first 3 restaurants for the section
        setRestaurants(data.slice(0, 3));
      } else {
        console.error('Failed to fetch restaurants');
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  }

  async function fetchTestimonials() {
    try {
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
    }
  }

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

  // Default banner if none exist
  const defaultBanner = {
    title: 'The Myriad Hotel',
    subtitle: 'Experience Timeless Luxury',
    image: '/hero.jpg',
    images: ['/hero.jpg'],
    link: '/rooms',
    buttonText: 'Reserve Your Stay',
  };

  const displayBanners = banners.length > 0 ? banners : [defaultBanner];

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
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent" />
            <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
              <div className="min-h-[200px] flex flex-col justify-center w-full">
                <h1 className="text-6xl md:text-7xl font-serif font-bold mb-4 text-balance">
                  The Myriad Hotel
                </h1>
                <p className="text-xl md:text-2xl mb-10 font-light">
                  Experience Timeless Luxury
                </p>
                <Link href="/rooms" className="inline-block bg-primary text-primary-foreground px-3 py-2 rounded text-base font-medium mx-auto">
                  Reserve Your Stay
                </Link>
              </div>
            </div>
          </div>
        ) : allSliderImages.length > 1 ? (
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
                <CarouselItem key={`${(slide.banner as any)._id || index}-${slide.slideIndex}`} className="relative h-screen w-full pl-0">
                  <div className="relative h-screen w-full">
                    <Image
                      src={slide.image || '/hero.jpg'}
                      alt={slide.banner.title || 'The Myriad Hotel'}
                      fill
                      className="object-cover brightness-75"
                      priority={index === 0}
                      quality={95}
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
                      <div className="min-h-[200px] flex flex-col justify-center w-full">
                        <h1 className="text-6xl md:text-7xl font-serif font-bold mb-4 text-balance">
                          {slide.banner.title || 'The Myriad Hotel'}
                        </h1>
                        {slide.banner.subtitle && (
                          <p className="text-xl md:text-2xl mb-10 font-light">
                            {slide.banner.subtitle}
                          </p>
                        )}
                        {(slide.banner.link || slide.banner.buttonText) && (
                          <Link
                            href={slide.banner.link || '/rooms'}
                            className="inline-block bg-primary text-primary-foreground px-3 py-2 rounded text-base font-medium mx-auto"
                          >
                            {slide.banner.buttonText || 'Reserve Your Stay'}
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
        ) : allSliderImages.length === 1 ? (
          <div className="relative w-full h-full">
            <Image
              src={allSliderImages[0].image || '/hero.jpg'}
              alt={allSliderImages[0].banner.title || 'The Myriad Hotel'}
              fill
              className="object-cover brightness-75"
              priority
              quality={95}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent" />
            <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
              <div className="min-h-[200px] flex flex-col justify-center w-full">
                <h1 className="text-6xl md:text-7xl font-serif font-bold mb-4 text-balance">
                  {allSliderImages[0].banner.title || 'The Myriad Hotel'}
                </h1>
                {allSliderImages[0].banner.subtitle && (
                  <p className="text-xl md:text-2xl mb-10 font-light">
                    {allSliderImages[0].banner.subtitle}
                  </p>
                )}
                {(allSliderImages[0].banner.link || allSliderImages[0].banner.buttonText) && (
                  <Link
                    href={allSliderImages[0].banner.link || '/rooms'}
                    className="inline-block bg-primary text-primary-foreground px-3 py-2 rounded text-base font-medium mx-auto"
                  >
                    {allSliderImages[0].banner.buttonText || 'Reserve Your Stay'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src="/hero.jpg"
              alt="The Myriad Hotel"
              fill
              className="object-cover brightness-75"
              priority
              quality={95}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent" />
            <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
            <div className="flex flex-col items-center text-center space-y-6 w-full">
  <h1 className="text-6xl md:text-7xl font-serif font-bold text-balance">
    The Myriad Hotel
  </h1>

  <p className="text-xl md:text-2xl font-light">
    Experience Timeless Luxury
  </p>

  <Link
    href="/rooms"
                    className="mt-4 inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md text-base font-medium mx-auto"
  >
    Reserve Your Stay
  </Link>
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
                {rooms.map((room, index) => (
                  <CarouselItem key={room.id || room._id || index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <ScrollAnimationWrapper animation="scaleIn" delay={index * 100}>
                      <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-smooth hover:-translate-y-2 h-full">
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={room.images && room.images.length > 0 ? room.images[0] : (room.gallery && room.gallery.length > 0 ? room.gallery[0] : "/placeholder.svg")}
                            alt={room.name || room.title || 'Room image'}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            quality={90}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
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
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
              <CarouselNext className="right-0 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
            </Carousel>
          )}
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
            {restaurants.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                <p>No restaurants available at the moment.</p>
              </div>
            ) : (
              restaurants.map((restaurant, index) => (
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
                <button
                  onClick={() => setInquiryModalOpen(true)}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded font-medium transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95 inline-block"
                >
                  Inquiry Details
                </button>
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
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-foreground/60 text-sm">{testimonial.role}</p>
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

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';
import { Restaurant } from '@/lib/models/restaurant';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

// Image Slider Component
function RestaurantImageSlider({ 
  images, 
  restaurantName, 
  priority = false 
}: { 
  images: string[]; 
  restaurantName: string;
  priority?: boolean;
}) {
  const autoplayPlugin = useRef(
    Autoplay({ 
      delay: 3000, 
      stopOnInteraction: false,
      stopOnMouseEnter: false,
      stopOnFocusIn: false,
    })
  );

  if (images.length > 1) {
    return (
      <div className="relative w-full h-full">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
            skipSnaps: false,
          }}
          plugins={[autoplayPlugin.current]}
          className="w-full h-full"
        >
          <CarouselContent className="h-full ml-0">
            {images.map((img, imgIndex) => (
              <CarouselItem key={imgIndex} className="relative h-64 md:h-[400px] pl-0 basis-full">
                <div className="relative w-full h-full">
                  <Image
                    src={img}
                    alt={`${restaurantName} - Image ${imgIndex + 1}`}
                    fill
                    className="object-contain bg-muted/10"
                    quality={95}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={priority && imgIndex === 0}
                    unoptimized={img.startsWith('data:')}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 opacity-70 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white z-20" />
          <CarouselNext className="right-2 opacity-70 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white z-20" />
        </Carousel>
        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1.5 rounded-md text-xs font-medium z-10 backdrop-blur-sm">
          {images.length} Images
        </div>
        {/* Image indicators */}
        <div className="absolute bottom-2 right-2 flex gap-1.5 z-10">
          {images.map((_, imgIndex) => (
            <div
              key={imgIndex}
              className="w-1.5 h-1.5 rounded-full bg-white/60 backdrop-blur-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  // Single image fallback
  const singleImage = images[0] || "/placeholder.svg";
  return (
    <div className="relative h-64 md:h-[400px] w-full bg-muted/20">
      <Image
        src={singleImage}
        alt={restaurantName}
        fill
        className="object-contain bg-muted/10"
        quality={95}
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={priority}
        unoptimized={singleImage.startsWith('data:')}
      />
    </div>
  );
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const response = await fetch('/api/restaurants');
        if (response.ok) {
          const data = await response.json();
          
          // Debug: Log restaurant data to check gallery images
          console.log('Restaurants fetched:', data.map((r: Restaurant) => ({
            name: r.name,
            image: r.image,
            gallery: r.gallery,
            galleryLength: r.gallery?.length || 0
          })));
          
          // Define the desired order
          const order = ['urban-dhaba', 'winking-owl', 'coastal-seafood'];
          
          // Sort restaurants based on the desired order
          const sortedRestaurants = data.sort((a: Restaurant, b: Restaurant) => {
            const indexA = order.indexOf(a.slug);
            const indexB = order.indexOf(b.slug);
            
            // If both are in the order array, sort by their index
            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB;
            }
            // If only A is in the order, it comes first
            if (indexA !== -1) return -1;
            // If only B is in the order, it comes first
            if (indexB !== -1) return 1;
            // If neither is in the order, maintain original order
            return 0;
          });
          
          setRestaurants(sortedRestaurants);
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
      <section className="py-12 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-10">
            {restaurants.map((restaurant, index) => (
              <ScrollAnimationWrapper key={restaurant.id} animation="fadeUp" delay={index * 100}>
                <div 
                  id={restaurant.slug}
                  className="rounded-lg overflow-hidden shadow-lg border border-border transition-smooth hover:shadow-2xl hover:-translate-y-2 scroll-mt-20"
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image Slider */}
                    <div className="relative h-64 md:h-[400px] w-full group overflow-hidden bg-muted/20">
                      {(() => {
                        // Create images array: include main image and gallery images
                        const images: string[] = [];
                        
                        // Add gallery images first (if they exist)
                        if (restaurant.gallery && Array.isArray(restaurant.gallery) && restaurant.gallery.length > 0) {
                          // Filter out empty/null values and add all gallery images
                          restaurant.gallery.forEach((img) => {
                            if (img && img.trim() && !images.includes(img)) {
                              images.push(img);
                            }
                          });
                        }
                        
                        // Add main image if it exists and isn't already in the array
                        if (restaurant.image && restaurant.image.trim() && !images.includes(restaurant.image)) {
                          // If we have gallery images, add main image at the beginning
                          if (images.length > 0) {
                            images.unshift(restaurant.image);
                          } else {
                            images.push(restaurant.image);
                          }
                        }
                        
                        // Debug log
                        console.log(`Restaurant: ${restaurant.name}, Images count: ${images.length}`, images);
                        
                        return (
                          <RestaurantImageSlider
                            images={images}
                            restaurantName={restaurant.name}
                            priority={index === 0}
                          />
                        );
                      })()}
                    </div>

                    {/* Content */}
                    <div className="bg-card p-6">
                      {restaurant.slug === 'urban-dhaba' && (
                        <div className="mb-4 flex justify-center">
                          <Image
                            src="/Urban Dhaba.png"
                            alt="Urban Dhaba Logo"
                            width={300}
                            height={120}
                            className="h-20 md:h-24 w-auto object-contain"
                          />
                        </div>
                      )}
                      {restaurant.slug === 'winking-owl' && (
                        <div className="mb-4 flex justify-center">
                          <Image
                            src="/Winkingg Owl.png"
                            alt="Winkingg Owl Logo"
                            width={300}
                            height={120}
                            className="h-20 md:h-24 w-auto object-contain"
                          />
                        </div>
                      )}
                      {restaurant.slug === 'coastal-seafood' && (
                        <div className="mb-4 flex justify-center">
                          <Image
                            src="/Coastal Sea Food.png"
                            alt="Coastal Sea Food Logo"
                            width={300}
                            height={120}
                            className="h-20 md:h-24 w-auto object-contain"
                          />
                        </div>
                      )}
                      <h2 className="text-2xl font-serif font-bold text-primary mb-1">
                        {restaurant.name}
                      </h2>
                      <p className="text-accent font-semibold mb-3 text-sm">{restaurant.cuisine}</p>

                      {/* Info */}
                      <div className="space-y-2 mb-4 py-4 border-y border-border">
                        <div className="flex items-center gap-2 text-foreground/70">
                          <Clock size={18} className="text-primary" />
                          <div>
                            <p className="text-xs text-foreground/60">Opening Hours</p>
                            <p className="font-semibold text-foreground text-sm">{restaurant.openingHours}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-foreground/70">
                          <Users size={18} className="text-primary" />
                          <div>
                            <p className="text-xs text-foreground/60">Capacity</p>
                            <p className="font-semibold text-foreground text-sm">{restaurant.capacity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-foreground/70">
                          <MapPin size={18} className="text-primary" />
                          <div>
                            <p className="text-xs text-foreground/60">Location</p>
                            <p className="font-semibold text-foreground text-sm">{restaurant.address}</p>
                          </div>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3">
                        <Link
                          href={`/restaurants/${restaurant.slug}`}
                          className="flex-1 bg-primary text-primary-foreground px-6 py-2.5 rounded font-medium hover:opacity-90 transition-opacity text-center text-sm"
                        >
                          Book a Table
                        </Link>
                        <Link
                          href={`/restaurants/${restaurant.slug}#menu`}
                          className="flex-1 bg-transparent border-2 border-primary text-primary px-6 py-2.5 rounded font-medium hover:bg-primary/10 transition-colors text-center text-sm"
                        >
                          Explore Menu
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
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

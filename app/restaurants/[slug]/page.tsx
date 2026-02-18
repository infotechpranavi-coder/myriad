'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Clock, Users, MapPin, ChevronLeft, Star, X, ChevronRight, CheckCircle, Instagram } from 'lucide-react';
import { Restaurant } from '@/lib/models/restaurant';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';
import { useToast } from '@/hooks/use-toast';

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const response = await fetch(`/api/restaurants/${params.slug}`);
        if (response.ok) {
          const data = await response.json();
          setRestaurant(data);
        } else {
          console.error('Failed to fetch restaurant');
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      } finally {
        setLoading(false);
      }
    }
    if (params.slug) {
      fetchRestaurant();
    }
  }, [params.slug]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    specialRequests: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
    restaurantName: string;
    date: string;
    time: string;
    guests: string;
  } | null>(null);
  const { toast } = useToast();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedMenuImageIndex, setSelectedMenuImageIndex] = useState<number | null>(null);

  // Autoplay plugin for carousel
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  // Get all menu images from menu.main array
  const getMenuImages = () => {
    if (!restaurant || !restaurant.menu) return [];
    
    const allMenuImages: string[] = [];
    
    // Check if menu.main exists and has items
    if (restaurant.menu.main && Array.isArray(restaurant.menu.main)) {
      restaurant.menu.main.forEach((item: any) => {
        if (item.images && Array.isArray(item.images)) {
          item.images.forEach((img: string) => {
            if (img && img.trim() && !allMenuImages.includes(img)) {
              allMenuImages.push(img);
            }
          });
        }
      });
    }
    
    return allMenuImages;
  };

  const menuImages = getMenuImages();

  // Gallery images - use restaurant gallery if available, otherwise use main image
  const getGalleryImages = () => {
    if (!restaurant) return [];
    
    // If restaurant has a gallery array with images, use it
    if (restaurant.gallery && Array.isArray(restaurant.gallery) && restaurant.gallery.length > 0) {
      // Filter out empty/null values and include main image if not already in gallery
      const galleryImages = [...restaurant.gallery].filter(img => img && img.trim());
      if (restaurant.image && !galleryImages.includes(restaurant.image)) {
        galleryImages.unshift(restaurant.image);
      }
      return galleryImages;
    }
    
    // Fallback: use main image
    return restaurant.image ? [restaurant.image] : [];
  };

  const galleryImages = getGalleryImages();

  // Get manager contact number based on restaurant
  const getManagerNumber = () => {
    if (!restaurant) return null;
    const restaurantName = restaurant.name.toLowerCase();
    const slug = restaurant.slug?.toLowerCase();
    
    // Urban Dhaba Manager: 91527 13732
    if (restaurantName.includes('urban dhaba') || slug === 'urban-dhaba') {
      return '91527 13732';
    }
    // Coastal Sea Food Manager: 91527 13732
    if (restaurantName.includes('coastal') || slug === 'coastal-seafood') {
      return '91527 13732';
    }
    // Winkingg Owl Manager: 88799 29560
    if (restaurantName.includes('winking') || slug === 'winking-owl') {
      return '88799 29560';
    }
    return null;
  };

  // Get Instagram URL and handle based on restaurant
  const getInstagramInfo = () => {
    if (!restaurant) return null;
    const restaurantName = restaurant.name.toLowerCase();
    const slug = restaurant.slug?.toLowerCase();
    
    // Urban Dhaba: https://www.instagram.com/urbandhabba/
    if (restaurantName.includes('urban dhaba') || slug === 'urban-dhaba') {
      return { url: 'https://www.instagram.com/urbandhabba/', handle: '@urbandhabba' };
    }
    // Coastal Sea Food: https://www.instagram.com/coastalseafood_restaurant/
    if (restaurantName.includes('coastal') || slug === 'coastal-seafood') {
      return { url: 'https://www.instagram.com/coastalseafood_restaurant/', handle: '@coastalseafood_restaurant' };
    }
    // Winkingg Owl: https://www.instagram.com/winkinggowl/?hl=en
    if (restaurantName.includes('winking') || slug === 'winking-owl') {
      return { url: 'https://www.instagram.com/winkinggowl/?hl=en', handle: '@winkinggowl' };
    }
    return null;
  };

  const managerNumber = getManagerNumber();
  const instagramInfo = getInstagramInfo();

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading restaurant...</p>
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Restaurant Not Found</h1>
          <Link href="/restaurants" className="text-primary hover:underline">
            ← Back to Restaurants
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/restaurant-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId: restaurant.id.toString(),
          restaurantName: restaurant.name,
          restaurantSlug: restaurant.slug,
          name: formData.name,
          email: formData.email && formData.email.trim() ? formData.email.trim() : undefined,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          guests: formData.guests,
          specialRequests: formData.specialRequests || undefined,
        }),
      });

      if (response.ok) {
        // Store booking details before resetting form
        setBookingDetails({
          restaurantName: restaurant.name,
          date: formData.date,
          time: formData.time,
          guests: formData.guests,
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          guests: '2',
          specialRequests: '',
        });
        // Show confirmation modal
        setShowConfirmation(true);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to submit booking request',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit booking request',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - Logo Only */}
      <div className="relative h-[40vh] min-h-[300px] w-full bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          {restaurant.slug === 'urban-dhaba' ? (
            <div>
              <Image
                src="/Urban Dhaba.png"
                alt="Urban Dhaba Logo"
                width={500}
                height={200}
                className="h-32 md:h-40 w-auto object-contain mx-auto mb-4"
                priority
              />
            </div>
          ) : restaurant.slug === 'winking-owl' ? (
            <div>
              <Image
                src="/Winkingg Owl.png"
                alt="Winkingg Owl Logo"
                width={500}
                height={200}
                className="h-32 md:h-40 w-auto object-contain mx-auto mb-4"
                priority
              />
            </div>
          ) : restaurant.slug === 'coastal-seafood' ? (
            <div>
              <Image
                src="/Coastal Sea Food.png"
                alt="Coastal Sea Food Logo"
                width={500}
                height={200}
                className="h-32 md:h-40 w-auto object-contain mx-auto mb-4"
                priority
              />
            </div>
          ) : (
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">{restaurant.name}</h1>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* About */}
            <section className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">About</h2>
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                {restaurant.description}
              </p>

              {managerNumber && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-foreground/60 text-sm mb-1">
                    {restaurant.name} Manager Contact Number
                  </p>
                  <a 
                    href={`tel:${managerNumber.replace(/\s/g, '')}`}
                    className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity font-mono"
                  >
                    {managerNumber}
                  </a>
                </div>
              )}

              {instagramInfo && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-foreground/60 text-sm mb-2">
                    Follow us on Instagram
                  </p>
                  <a 
                    href={instagramInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity font-semibold"
                  >
                    <Instagram size={20} />
                    <span>{instagramInfo.handle}</span>
                  </a>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-6 pt-6 border-t">
                <div className="flex items-start gap-3">
                  <Clock size={24} className="text-primary mt-1" />
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Opening Hours</p>
                    <p className="font-semibold text-foreground">{restaurant.openingHours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users size={24} className="text-primary mt-1" />
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Capacity</p>
                    <p className="font-semibold text-foreground">{restaurant.capacity}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={24} className="text-primary mt-1" />
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Location</p>
                    <p className="font-semibold text-foreground">{restaurant.address}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Highlights */}
            <section className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">Highlights</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {restaurant.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-2">
                    <Star size={16} className="text-primary fill-primary" />
                    <span className="text-foreground/80">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Menu */}
            <section id="menu" className="bg-card rounded-lg border p-6 scroll-mt-24">
              <h2 className="text-2xl font-serif font-bold text-primary mb-6">Menu Highlights</h2>
              
              {/* Menu Images Carousel */}
              {menuImages.length > 0 ? (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Menu</h3>
                  <Carousel
                    opts={{
                      align: 'start',
                      loop: true,
                    }}
                    plugins={[plugin.current]}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {menuImages.map((imageUrl: string, index: number) => (
                        <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                          <div 
                            className="relative aspect-video rounded-lg overflow-hidden border border-border group cursor-pointer"
                            onClick={() => setSelectedMenuImageIndex(index)}
                          >
                            {imageUrl.startsWith('http') || imageUrl.startsWith('/') ? (
                              imageUrl.startsWith('/') ? (
                                <Image
                                  src={imageUrl}
                                  alt={`Menu item ${index + 1}`}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <img
                                  src={imageUrl}
                                  alt={`Menu item ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              )
                            ) : null}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
                    <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
                  </Carousel>
                </div>
              ) : null}

              {/* Legacy Menu Items (if they have name/price) */}
              {restaurant.menu && Object.entries(restaurant.menu).some(([category, items]) => {
                const itemsArray = items as any[];
                return itemsArray.some((item: any) => item.name || item.price);
              }) && (
                <>
                  {Object.entries(restaurant.menu).map(([category, items]) => {
                    const itemsArray = items as any[];
                    const hasNameOrPrice = itemsArray.some((item: any) => item.name || item.price);
                    
                    if (!hasNameOrPrice) return null;
                    
                    return (
                      <div key={category} className="mb-8 last:mb-0">
                        <h3 className="text-xl font-semibold text-foreground mb-4 capitalize">
                          {category}
                        </h3>
                        <div className="space-y-4">
                          {itemsArray.map((item: any, index: number) => {
                            if (!item.name && !item.price) return null;
                            
                            return (
                              <div key={index} className="flex justify-between items-start gap-4 pb-4 border-b last:border-0">
                                <div className="flex-1">
                                  {item.name && (
                                    <h4 className="font-semibold text-foreground mb-1">{item.name}</h4>
                                  )}
                                  {item.description && (
                                    <p className="text-sm text-foreground/70">{item.description}</p>
                                  )}
                                </div>
                                {item.price && (
                                  <span className="font-semibold text-primary whitespace-nowrap">
                                    {item.price}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </section>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-serif font-bold text-primary mb-6">Book a Table</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email Address (Optional)
                  </label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com (optional)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    placeholder="+91 1234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Time *
                    </label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Number of Guests *
                  </label>
                  <Select
                    value={formData.guests}
                    onValueChange={(value) => setFormData({ ...formData, guests: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Special Requests
                  </label>
                  <textarea
                    className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm"
                    placeholder="Any dietary restrictions or special requests..."
                    value={formData.specialRequests}
                    onChange={(e) =>
                      setFormData({ ...formData, specialRequests: e.target.value })
                    }
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Booking Request'}
                </Button>

                <p className="text-xs text-foreground/60 text-center">
                  We'll confirm your reservation within 24 hours
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="bg-muted/30 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8 text-center">
              Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer border-2 border-transparent hover:border-primary transition-all duration-300"
                >
                  <Image
                    src={img}
                    alt={`${restaurant.name} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    unoptimized={!img.includes('res.cloudinary.com')}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Image Preview Modal */}
      <Dialog
        open={selectedImageIndex !== null}
        onOpenChange={(open) => !open && setSelectedImageIndex(null)}
      >
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">
            {selectedImageIndex !== null
              ? `${restaurant.name} - Image ${selectedImageIndex + 1} of ${galleryImages.length}`
              : 'Image Preview'}
          </DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <DialogClose className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full p-2 transition-colors">
              <X size={24} />
            </DialogClose>

            {/* Previous Button */}
            {selectedImageIndex !== null && selectedImageIndex > 0 && (
              <button
                onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
                className="absolute left-4 z-50 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            {/* Image */}
            {selectedImageIndex !== null && (
              <div className="relative w-full h-full flex items-center justify-center p-8">
                <Image
                  src={galleryImages[selectedImageIndex]}
                  alt={`${restaurant.name} - Image ${selectedImageIndex + 1}`}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain"
                  priority
                />
              </div>
            )}

            {/* Next Button */}
            {selectedImageIndex !== null &&
              selectedImageIndex < galleryImages.length - 1 && (
                <button
                  onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
                  className="absolute right-4 z-50 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={32} />
                </button>
              )}

            {/* Image Counter */}
            {selectedImageIndex !== null && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {selectedImageIndex + 1} / {galleryImages.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Menu Image Preview Modal */}
      <Dialog
        open={selectedMenuImageIndex !== null}
        onOpenChange={(open) => !open && setSelectedMenuImageIndex(null)}
      >
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">
            {selectedMenuImageIndex !== null
              ? `${restaurant?.name || 'Restaurant'} - Menu Image ${selectedMenuImageIndex + 1} of ${menuImages.length}`
              : 'Menu Image Preview'}
          </DialogTitle>
          {selectedMenuImageIndex !== null && menuImages[selectedMenuImageIndex] && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <DialogClose className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full p-2 transition-colors">
                <X size={24} />
              </DialogClose>

              {/* Previous Button */}
              {selectedMenuImageIndex > 0 && (
                <button
                  onClick={() => setSelectedMenuImageIndex(selectedMenuImageIndex - 1)}
                  className="absolute left-4 z-50 text-white hover:bg-white/20 rounded-full p-3 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={32} />
                </button>
              )}

              {/* Next Button */}
              {selectedMenuImageIndex < menuImages.length - 1 && (
                <button
                  onClick={() => setSelectedMenuImageIndex(selectedMenuImageIndex + 1)}
                  className="absolute right-4 z-50 text-white hover:bg-white/20 rounded-full p-3 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={32} />
                </button>
              )}

              {/* Image */}
              <div className="relative w-full h-full flex items-center justify-center p-8">
                {menuImages[selectedMenuImageIndex].startsWith('http') || menuImages[selectedMenuImageIndex].startsWith('/') ? (
                  menuImages[selectedMenuImageIndex].startsWith('/') ? (
                    <Image
                      src={menuImages[selectedMenuImageIndex]}
                      alt={`Menu image ${selectedMenuImageIndex + 1}`}
                      width={1200}
                      height={800}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <img
                      src={menuImages[selectedMenuImageIndex]}
                      alt={`Menu image ${selectedMenuImageIndex + 1}`}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )
                ) : null}
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {selectedMenuImageIndex + 1} / {menuImages.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <DialogTitle className="text-2xl font-serif">Table Booking Confirmed!</DialogTitle>
              <DialogDescription className="text-base">
                Your table booking request has been submitted successfully. You are now eligible for a 10% discount. We will contact you shortly to confirm your reservation.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {bookingDetails && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Restaurant:</span>
                  <span className="text-sm font-semibold">{bookingDetails.restaurantName}</span>
                </div>
                {bookingDetails.date && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date:</span>
                    <span className="text-sm font-semibold">
                      {new Date(bookingDetails.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {bookingDetails.time && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Time:</span>
                    <span className="text-sm font-semibold">{bookingDetails.time}</span>
                  </div>
                )}
                {bookingDetails.guests && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Guests:</span>
                    <span className="text-sm font-semibold">{bookingDetails.guests} {bookingDetails.guests === '1' ? 'Guest' : 'Guests'}</span>
                  </div>
                )}
              </div>
            )}
            <Button
              onClick={() => setShowConfirmation(false)}
              className="w-full"
              size="lg"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Clock, Users, MapPin, ChevronLeft, Star } from 'lucide-react';
import { restaurants } from '@/lib/restaurant-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const restaurant = restaurants.find((r) => r.slug === params.slug);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    specialRequests: '',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert('Table booking request submitted! We will contact you shortly.');
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="max-w-7xl mx-auto flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => router.push('/restaurants')}
            className="p-2 rounded-full hover:bg-muted"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{restaurant.name}</h1>
            <p className="text-xs text-muted-foreground">{restaurant.cuisine}</p>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          className="object-cover"
          quality={95}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">{restaurant.name}</h1>
          <p className="text-xl">{restaurant.cuisine}</p>
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
            <section className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-serif font-bold text-primary mb-6">Menu Highlights</h2>
              {Object.entries(restaurant.menu).map(([category, items]) => (
                <div key={category} className="mb-8 last:mb-0">
                  <h3 className="text-xl font-semibold text-foreground mb-4 capitalize">
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-start gap-4 pb-4 border-b last:border-0">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{item.name}</h4>
                          <p className="text-sm text-foreground/70">{item.description}</p>
                        </div>
                        <span className="font-semibold text-primary whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
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

                <Button type="submit" className="w-full" size="lg">
                  Submit Booking Request
                </Button>

                <p className="text-xs text-foreground/60 text-center">
                  We'll confirm your reservation within 24 hours
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

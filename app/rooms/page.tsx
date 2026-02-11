'use client';

import Image from 'next/image';
import { Star, Wifi, Coffee, Tv, Wind, Sofa, Shield, CheckCircle2, MapPin, Clock, CreditCard, Zap, Waves, Car } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';
import { Room } from '@/lib/models/room';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const amenityIcons = {
  'Double Bed': <Sofa size={20} />,
  'King Bed': <Sofa size={20} />,
  'Grand King Bed': <Sofa size={20} />,
  'High-speed WiFi': <Wifi size={20} />,
  'Smart TV': <Tv size={20} />,
  'Air Conditioning': <Wind size={20} />,
  'Safe': <Shield size={20} />,
  'Mini Bar': <Coffee size={20} />,
  'Marble Bathroom': <Waves size={20} />,
  'Work Desk': <Zap size={20} />,
  'Jacuzzi': <Waves size={20} />,
};

import { RoomHero } from '@/components/RoomHero';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await fetch('/api/rooms');
        if (response.ok) {
          const data = await response.json();
          setRooms(data);
        } else {
          console.error('Failed to fetch rooms');
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  const generalAmenities = [
    { name: 'Free WiFi', icon: <Wifi size={24} /> },
    { name: '24/7 Security', icon: <Shield size={24} /> },
    { name: 'Valet Car Parking', icon: <Car size={24} /> },
    { name: 'Room Service', icon: <Coffee size={24} /> },
    { name: 'Laundry Service', icon: <Waves size={24} /> },
    { name: 'Parking', icon: <MapPin size={24} /> },
  ];

  if (loading) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading rooms...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background">
      {/* Hero Slider */}
      <RoomHero />

      {/* Rooms Sections */}
      <section className="bg-background">
        {rooms.map((room, index) => (
          <div key={room.id} id={`room-${room.id}`} className={`${index % 2 === 1 ? 'bg-muted/10' : ''} py-28 px-4`}>
            <div className="max-w-7xl mx-auto">
              <ScrollAnimationWrapper animation="fadeUp">
                <div className={`grid md:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Image */}
                  <div className={`relative h-[550px] group rounded-sm overflow-hidden shadow-2xl ${index % 2 === 1 ? 'md:order-last' : 'md:order-first'}`}>
                    {room.images && room.images.length > 0 && (
                      <Image
                        src={room.images[0]}
                        alt={room.name || room.title || 'Room image'}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  {/* Content */}
                  <div className={`flex flex-col space-y-10 ${index % 2 === 1 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div>
                      <h2 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6 leading-tight tracking-tight">
                        {room.name || room.title}
                      </h2>
                      <p className="text-lg text-foreground/60 leading-relaxed font-light mb-2">
                        {room.description || room.about}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-foreground/40 text-[10px] uppercase tracking-[0.3em] mb-8 font-bold">In-Room Amenities</h3>
                      <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                        {room.amenities.map((amenity) => (
                          <div key={amenity} className="flex items-center gap-4 text-foreground/80 group">
                            <span className="text-primary/40 group-hover:text-primary transition-colors duration-300">
                              {amenityIcons[amenity as keyof typeof amenityIcons] || <CheckCircle2 size={18} />}
                            </span>
                            <span className="text-sm font-medium tracking-wide">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-10 border-t border-border mt-6">
                      <div>
                        <p className="text-foreground/40 text-[10px] uppercase tracking-[0.3em] mb-2 font-bold">Starting from</p>
                        <div className="flex items-baseline gap-3">
                          {room.oldPrice && (
                            <span className="text-lg text-foreground/30 line-through decoration-1">₹{room.oldPrice.toLocaleString()}</span>
                          )}
                          <p className="text-5xl font-serif font-bold text-primary italic">
                            ₹{(room.price || room.priceSummary?.basePrice || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/rooms/${room.id}`}
                        className="bg-primary text-primary-foreground px-12 py-5 rounded-none text-sm font-bold hover:bg-primary/95 transition-all duration-500 shadow-[0_10px_30px_-10px_rgba(var(--primary),0.3)] hover:-translate-y-1 uppercase tracking-[0.2em] inline-block"
                      >
                        Select Room
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            </div>
          </div>
        ))}
      </section>

      {/* Property Amenities Section */}
      <section className="py-28 px-4 bg-muted/10 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimationWrapper animation="fadeUp" className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">Property Amenities</h2>
            <div className="w-24 h-1 bg-primary/20 mx-auto" />
          </ScrollAnimationWrapper>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12">
            {generalAmenities.map((amenity, index) => (
              <ScrollAnimationWrapper key={amenity.name} animation="scaleIn" delay={index * 100}>
                <div className="group text-center">
                  <div className="w-20 h-20 mx-auto bg-background rounded-full flex items-center justify-center text-primary/40 group-hover:text-primary group-hover:scale-110 transition-all duration-500 shadow-sm border border-border/50 mb-6">
                    {amenity.icon}
                  </div>
                  <h3 className="text-sm font-bold text-foreground/70 uppercase tracking-widest">{amenity.name}</h3>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Policies & Location Section */}
      <section className="py-28 px-4 bg-background overflow-hidden relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
          {/* Policies */}
          <ScrollAnimationWrapper animation="fadeUp">
            <div className="space-y-10">
              <div className="flex items-center gap-4 text-primary mb-2">
                <Shield className="text-primary/30" size={32} />
                <h2 className="text-4xl font-serif font-bold tracking-tight">Property Policies</h2>
              </div>

              <div className="grid gap-8">
                <div className="flex gap-4 p-6 bg-muted/20 border-l-2 border-primary">
                  <Clock className="text-primary shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-foreground mb-1 uppercase tracking-wider text-xs">Standard Times</h3>
                    <p className="text-foreground/70 text-sm leading-relaxed underline decoration-primary/20 underline-offset-4">Check-in: 12:00 PM | Check-out: 11:00 AM</p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 bg-muted/20 border-l-2 border-primary">
                  <CreditCard className="text-primary shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-foreground mb-1 uppercase tracking-wider text-xs">Payment Information</h3>
                    <p className="text-foreground/70 text-sm leading-relaxed">Major credit/debit cards accepted. UPI & Bank Transfers available at the property.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 bg-muted/20 border-l-2 border-primary">
                  <Shield className="text-primary shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-foreground mb-1 uppercase tracking-wider text-xs">Identification</h3>
                    <p className="text-foreground/70 text-sm leading-relaxed">Government-issued ID (Aadhar, Driving License, Passport) is required for all guests during check-in.</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimationWrapper>

          {/* Location / Area */}
          <ScrollAnimationWrapper animation="fadeUp" delay={200}>
            <div className="h-full flex flex-col justify-center">
              <div className="flex items-center gap-4 text-primary mb-8">
                <MapPin className="text-primary/30" size={32} />
                <h2 className="text-3xl font-serif font-bold tracking-tight italic">Elite Location</h2>
              </div>
              <p className="text-xl text-foreground/50 font-light leading-relaxed mb-10">
                Situated in the heart of Thane's business district, our location offers seamless connectivity to Mumbai's major hubs, premium shopping centers, and tranquil leisure spots.
              </p>
              <div className="relative h-64 w-full bg-muted/40 rounded-sm border border-border group overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center group-hover:scale-110 transition-transform duration-700">
                    <MapPin className="text-primary mx-auto mb-3" size={40} />
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary/60">View on Map</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150" />
        <ScrollAnimationWrapper className="max-w-4xl mx-auto text-center relative z-10" animation="fadeUp">
          <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 tracking-tight">
            Reserve Your Experience
          </h2>
          <p className="text-xl mb-12 font-light tracking-wide text-primary-foreground/80">Experience the hallmark of business luxury at Thane's most refined address.</p>
          <Link
            href="/rooms/1"
            className="bg-primary-foreground text-primary px-16 py-6 rounded-none text-sm font-bold hover:bg-white transition-all duration-500 shadow-2xl hover:-translate-y-2 uppercase tracking-[0.3em] inline-block"
          >
            Start Your Stay
          </Link>
        </ScrollAnimationWrapper>
      </section>
    </main>
  );
}

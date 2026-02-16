'use client';

import Image from 'next/image';
import { Users, Layout, Lightbulb, Wifi, Volume2, X } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';
import { useState, useEffect } from 'react';
import { BanquetGalleryImage } from '@/lib/models/banquet-gallery';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function BanquetPage() {
  const [galleryImages, setGalleryImages] = useState<BanquetGalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [proposalFormData, setProposalFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    alternateContactNumber: '',
    eventType: '',
    eventTypeOther: '',
    eventDate: '',
    eventTiming: '',
    foodPreference: '',
    foodPreferenceOther: '',
    alcoholRequired: 'No',
    expectedGuests: '',
    roomsRequired: 'No',
    numberOfRooms: '',
    additionalRequirements: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (proposalModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [proposalModalOpen]);

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

                <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-foreground/60 text-sm mb-1">Banquet Manager Contact Number</p>
                  <a 
                    href="tel:8828821296" 
                    className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity font-mono"
                  >
                    88288 21296
                  </a>
                </div>

                <button 
                  onClick={() => setProposalModalOpen(true)}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded font-medium hover:opacity-90 transition-opacity"
                >
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
          <p className="text-lg mb-6 opacity-90">
            Contact our events team to discuss your requirements
          </p>
          <div className="mb-8 p-4 bg-primary-foreground/10 rounded-lg border border-primary-foreground/20 inline-block">
            <p className="text-sm mb-1 opacity-80">Banquet Manager Contact Number</p>
            <a 
              href="tel:8828821296" 
              className="text-2xl font-bold hover:opacity-80 transition-opacity font-mono"
            >
              88288 21296
            </a>
          </div>
          <button 
            onClick={() => setProposalModalOpen(true)}
            className="bg-primary-foreground text-primary px-8 py-4 rounded text-lg font-medium transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95"
          >
            Get in Touch
          </button>
        </ScrollAnimationWrapper>
      </section>

      {/* Proposal Request Modal */}
      <Dialog open={proposalModalOpen} onOpenChange={setProposalModalOpen} modal={true}>
        <DialogContent 
          className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 gap-0 [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            setProposalModalOpen(false);
          }}
        >
          <div className="px-6 pt-6 pb-4 border-b flex-shrink-0 relative">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-primary">🏛️ Banquet Booking Form</DialogTitle>
              <DialogDescription>
                Fill out the form below to request a customized proposal for your event.
              </DialogDescription>
            </DialogHeader>
            <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>

          <div 
            className="flex-1 overflow-y-auto overscroll-contain px-6 py-4" 
            style={{ 
              maxHeight: 'calc(90vh - 140px)',
              WebkitOverflowScrolling: 'touch'
            }}
            onWheel={(e) => {
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
            }}
          >
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              try {
                const response = await fetch('/api/proposals', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    firstName: proposalFormData.firstName,
                    lastName: proposalFormData.lastName,
                    mobileNumber: proposalFormData.mobileNumber,
                    alternateContactNumber: proposalFormData.alternateContactNumber || undefined,
                    eventType: proposalFormData.eventType,
                    eventTypeOther: proposalFormData.eventType === 'Other' ? proposalFormData.eventTypeOther : undefined,
                    eventDate: proposalFormData.eventDate || undefined,
                    eventTiming: proposalFormData.eventTiming || undefined,
                    foodPreference: proposalFormData.foodPreference,
                    foodPreferenceOther: proposalFormData.foodPreference === 'Other' ? proposalFormData.foodPreferenceOther : undefined,
                    alcoholRequired: proposalFormData.alcoholRequired,
                    expectedGuests: proposalFormData.expectedGuests || undefined,
                    roomsRequired: proposalFormData.roomsRequired,
                    numberOfRooms: proposalFormData.roomsRequired === 'Yes' ? proposalFormData.numberOfRooms : undefined,
                    additionalRequirements: proposalFormData.additionalRequirements || undefined,
                  }),
                });

                if (response.ok) {
                  toast({
                    title: 'Success',
                    description: 'Your proposal request has been submitted successfully. We will contact you shortly.',
                  });
                  setProposalModalOpen(false);
                  setProposalFormData({
                    firstName: '',
                    lastName: '',
                    mobileNumber: '',
                    alternateContactNumber: '',
                    eventType: '',
                    eventTypeOther: '',
                    eventDate: '',
                    eventTiming: '',
                    foodPreference: '',
                    foodPreferenceOther: '',
                    alcoholRequired: 'No',
                    expectedGuests: '',
                    roomsRequired: 'No',
                    numberOfRooms: '',
                    additionalRequirements: '',
                  });
                } else {
                  const error = await response.json();
                  toast({
                    title: 'Error',
                    description: error.error || 'Failed to submit proposal request',
                    variant: 'destructive',
                  });
                }
              } catch (error) {
                console.error('Error submitting proposal:', error);
                toast({
                  title: 'Error',
                  description: 'Failed to submit proposal request',
                  variant: 'destructive',
                });
              } finally {
                setSubmitting(false);
              }
            }}
            className="space-y-6 mt-4"
          >
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proposal-first-name" className="text-foreground font-medium">
                    First Name *
                  </Label>
                  <Input
                    id="proposal-first-name"
                    type="text"
                    placeholder="Enter first name"
                    value={proposalFormData.firstName}
                    onChange={(e) => setProposalFormData({ ...proposalFormData, firstName: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proposal-last-name" className="text-foreground font-medium">
                    Last Name *
                  </Label>
                  <Input
                    id="proposal-last-name"
                    type="text"
                    placeholder="Enter last name"
                    value={proposalFormData.lastName}
                    onChange={(e) => setProposalFormData({ ...proposalFormData, lastName: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proposal-mobile" className="text-foreground font-medium">
                    Mobile Number *
                  </Label>
                  <Input
                    id="proposal-mobile"
                    type="tel"
                    placeholder="Enter mobile number"
                    value={proposalFormData.mobileNumber}
                    onChange={(e) => setProposalFormData({ ...proposalFormData, mobileNumber: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proposal-alternate" className="text-foreground font-medium">
                    Alternate Contact Number
                  </Label>
                  <Input
                    id="proposal-alternate"
                    type="tel"
                    placeholder="Enter alternate number (optional)"
                    value={proposalFormData.alternateContactNumber}
                    onChange={(e) => setProposalFormData({ ...proposalFormData, alternateContactNumber: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Event Details</h3>
              <div className="space-y-2">
                <Label htmlFor="proposal-event-type" className="text-foreground font-medium">
                  Type of Function *
                </Label>
                <Select
                  value={proposalFormData.eventType}
                  onValueChange={(value) => setProposalFormData({ ...proposalFormData, eventType: value, eventTypeOther: '' })}
                  required
                >
                  <SelectTrigger id="proposal-event-type">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Birthday">Birthday</SelectItem>
                    <SelectItem value="Wedding">Wedding</SelectItem>
                    <SelectItem value="Engagement">Engagement</SelectItem>
                    <SelectItem value="Corporate Event">Corporate Event</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {proposalFormData.eventType === 'Other' && (
                  <Input
                    type="text"
                    placeholder="Please specify"
                    value={proposalFormData.eventTypeOther}
                    onChange={(e) => setProposalFormData({ ...proposalFormData, eventTypeOther: e.target.value })}
                    className="w-full mt-2"
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proposal-date" className="text-foreground font-medium">
                    Event Date
                  </Label>
                  <Input
                    id="proposal-date"
                    type="date"
                    value={proposalFormData.eventDate}
                    onChange={(e) => setProposalFormData({ ...proposalFormData, eventDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proposal-timing" className="text-foreground font-medium">
                    Event Timing
                  </Label>
                  <Input
                    id="proposal-timing"
                    type="time"
                    value={proposalFormData.eventTiming}
                    onChange={(e) => setProposalFormData({ ...proposalFormData, eventTiming: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Catering Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Catering Preferences</h3>
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Food Preference *</Label>
                <Select
                  value={proposalFormData.foodPreference}
                  onValueChange={(value) => setProposalFormData({ ...proposalFormData, foodPreference: value, foodPreferenceOther: '' })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select food preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pure Veg">Pure Veg</SelectItem>
                    <SelectItem value="Veg & Non-Veg">Veg & Non-Veg</SelectItem>
                    <SelectItem value="Jain Food">Jain Food</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {proposalFormData.foodPreference === 'Other' && (
                  <Input
                    type="text"
                    placeholder="Please specify"
                    value={proposalFormData.foodPreferenceOther}
                    onChange={(e) => setProposalFormData({ ...proposalFormData, foodPreferenceOther: e.target.value })}
                    className="w-full mt-2"
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Alcohol Required *</Label>
                <Select
                  value={proposalFormData.alcoholRequired}
                  onValueChange={(value: 'Yes' | 'No') => setProposalFormData({ ...proposalFormData, alcoholRequired: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Guest & Accommodation Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Guest & Accommodation Details</h3>
              <div className="space-y-2">
                <Label htmlFor="proposal-guests" className="text-foreground font-medium">
                  Expected Number of Guests (Capacity)
                </Label>
                <Input
                  id="proposal-guests"
                  type="number"
                  placeholder="Enter number of guests"
                  value={proposalFormData.expectedGuests}
                  onChange={(e) => setProposalFormData({ ...proposalFormData, expectedGuests: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Rooms Required *</Label>
                <Select
                  value={proposalFormData.roomsRequired}
                  onValueChange={(value: 'Yes' | 'No') => setProposalFormData({ ...proposalFormData, roomsRequired: value, numberOfRooms: value === 'No' ? '' : proposalFormData.numberOfRooms })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                {proposalFormData.roomsRequired === 'Yes' && (
                  <Input
                    type="number"
                    placeholder="Number of rooms"
                    value={proposalFormData.numberOfRooms}
                    onChange={(e) => setProposalFormData({ ...proposalFormData, numberOfRooms: e.target.value })}
                    className="w-full mt-2"
                  />
                )}
              </div>
            </div>

            {/* Additional Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Additional Requirements / Special Notes</h3>
              <Textarea
                placeholder="Enter any additional requirements or special notes..."
                value={proposalFormData.additionalRequirements}
                onChange={(e) => setProposalFormData({ ...proposalFormData, additionalRequirements: e.target.value })}
                rows={4}
                className="w-full"
              />
            </div>

            <div className="flex gap-3 pt-4 pb-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setProposalModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

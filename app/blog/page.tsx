'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, Loader2, Send, CheckCircle2, X } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';
import { Testimonial } from '@/lib/models/testimonial';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';

export default function BlogPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const { toast } = useToast();
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: '',
    rating: 5,
    email: '',
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    try {
      setLoading(true);
      const response = await fetch('/api/testimonials');
      if (response.ok) {
        const data = await response.json();
        // Store all testimonials
        setAllTestimonials(data);
        // Filter active testimonials and sort by order for carousel
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

  async function handleSubmitTestimonial(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.name || !formData.quote) {
      toast({
        title: 'Validation Error',
        description: 'Name and testimonial are required',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role || 'Guest',
          quote: formData.quote,
          rating: formData.rating,
          isActive: false, // User-submitted testimonials need admin approval
        }),
      });

      if (response.ok) {
        // Reset form
        setFormData({
          name: '',
          role: '',
          quote: '',
          rating: 5,
          email: '',
        });
        // Open thank you modal
        setShowThankYouModal(true);
        // Refresh testimonials
        fetchTestimonials();
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to submit testimonial',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit testimonial. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
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
          {allTestimonials.length > 0 ? (
            <Carousel
              plugins={[plugin.current]}
              className="w-full"
              opts={{
                align: 'start',
                loop: allTestimonials.length > 3,
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {allTestimonials
                  .sort((a, b) => {
                    // Sort by active first, then by order/date
                    if (a.isActive !== b.isActive) {
                      return a.isActive ? -1 : 1;
                    }
                    return (a.order || 0) - (b.order || 0);
                  })
                  .map((testimonial) => (
                  <CarouselItem key={testimonial._id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className={`bg-card p-8 rounded-lg border transition-smooth hover:shadow-lg hover:-translate-y-2 h-full ${
                        !testimonial.isActive
                          ? 'border-yellow-500/50 opacity-90'
                          : 'border-border'
                      }`}>
                        {!testimonial.isActive && (
                          <div className="mb-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                              Pending Review
                            </span>
                          </div>
                        )}
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                testimonial.isActive
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-yellow-300 text-yellow-300'
                              }`}
                            />
                        ))}
                      </div>
                      <p className="text-foreground/80 mb-6 italic">"{testimonial.quote}"</p>
                      <div className="flex items-center gap-3">
                        {testimonial.image && (
                            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
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
              <p>No testimonials available yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </section>

      {/* Submit Testimonial Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <ScrollAnimationWrapper animation="fadeUp">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4 text-center text-balance">
              Share Your Experience
            </h2>
            <p className="text-xl text-foreground/70 mb-12 text-center max-w-2xl mx-auto">
              We'd love to hear about your stay at The Myriad Hotel. Share your feedback and help others discover the exceptional service we provide.
            </p>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper animation="fadeUp" delay={100}>
            <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
              <form onSubmit={handleSubmitTestimonial} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role / Title</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g., Business Traveler, Wedding Guest"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quote">Your Testimonial *</Label>
                  <Textarea
                    id="quote"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    placeholder="Tell us about your experience..."
                    rows={6}
                    required
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Select
                    value={formData.rating.toString()}
                    onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {[...Array(rating)].map((_, i) => (
                            <Star key={i} size={16} className="inline fill-yellow-400 text-yellow-400" />
                          ))}
                          {' '}
                          {rating} {rating === 1 ? 'Star' : 'Stars'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                  <p className="text-sm text-foreground/60">
                    Your email will not be published. We may contact you to verify your testimonial.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting}
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Testimonial
                    </>
                  )}
                </Button>

                <p className="text-sm text-foreground/60 text-center">
                  * All testimonials are subject to review before being published.
                </p>
              </form>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Thank You Modal */}
      <Dialog open={showThankYouModal} onOpenChange={setShowThankYouModal} modal={true}>
        <DialogContent 
          className="sm:max-w-[500px] p-0 gap-0 [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="px-6 pt-8 pb-6 text-center relative">
            <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            
            {/* Animated Checkmark */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping opacity-75"></div>
                </div>
                <div className="relative animate-in zoom-in-50 fade-in duration-500">
                  <CheckCircle2 className="w-20 h-20 text-green-500" />
                </div>
              </div>
            </div>

            <DialogHeader className="space-y-3">
              <DialogTitle className="text-3xl font-serif font-bold text-primary animate-in fade-in slide-in-from-bottom-4 duration-500">
                Thank You for Your Review!
              </DialogTitle>
              <DialogDescription className="text-base text-foreground/70 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                Your testimonial has been successfully submitted and will be reviewed by our team. 
                Once approved, it will be displayed on our website.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Button
                onClick={() => setShowThankYouModal(false)}
                className="w-full"
                size="lg"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </main>
  );
}

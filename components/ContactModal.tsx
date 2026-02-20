'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X, MapPin, Phone, Mail, Clock } from 'lucide-react';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="px-6 pt-6 pb-4 border-b shrink-0 relative">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif font-bold text-primary">
              Contact Details
            </DialogTitle>
            <DialogDescription className="text-foreground/70 mt-2">
              Get in touch with The Myriad Hotel
            </DialogDescription>
          </DialogHeader>
          <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>

        <div 
          className="flex-1 overflow-y-auto overscroll-contain px-6 py-6" 
          style={{ 
            maxHeight: 'calc(90vh - 100px)',
            WebkitOverflowScrolling: 'touch'
          }}
          onWheel={(e) => {
            e.stopPropagation();
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="space-y-6 text-foreground/80">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Address</h3>
                <p className="text-foreground/80">
                  The Myriad Hotel, Opp. Indian Oil Petrol Pump, Mira Bhayander Road, Mira Road (E)
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Phone className="w-5 h-5 text-primary shrink-0" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                <div className="space-y-1">
                  <a href="tel:9619618000" className="text-foreground/80 hover:text-primary transition-colors block">
                    961 961 8000
                  </a>
                  <a href="tel:8879929746" className="text-foreground/80 hover:text-primary transition-colors block">
                    887 992 9746
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Mail className="w-5 h-5 text-primary shrink-0" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                <a href="mailto:Support@myriad.net.in" className="text-foreground/80 hover:text-primary transition-colors">
                  Support@myriad.net.in
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Clock className="w-5 h-5 text-primary shrink-0" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Hours</h3>
                <p className="text-foreground/80">
                  24 x 7 Every Day
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8">
              <h3 className="font-semibold text-foreground mb-4">Visit Us</h3>
              <div className="w-full h-96 rounded-lg overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps?q=The+Myriad+Hotel,+Opp.+Indian+Oil+Petrol+Pump,+Mira+Bhayander+Road,+Mira+Road+(E),+Mumbai,+Maharashtra&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  title="The Myriad Hotel Location"
                />
              </div>
              <p className="text-sm text-foreground/60 mt-2">
                The Myriad Hotel, Opp. Indian Oil Petrol Pump, Mira Bhayander Road, Mira Road (E)
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

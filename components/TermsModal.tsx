'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsModal({ open, onOpenChange }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="px-6 pt-6 pb-4 border-b shrink-0 relative">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif font-bold text-primary">
              Terms & Conditions – The Myriad Hotel
            </DialogTitle>
            <DialogDescription className="text-foreground/70 mt-2">
              Last Updated: March 2026
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
          <div className="space-y-8 text-foreground/80">
            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing the website or using any services provided by The Myriad Hotel, including room reservations, banquet bookings, restaurant dining, events, or related services, you agree to comply with and be legally bound by these Terms & Conditions. If you do not agree, please discontinue use of our website and services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                2. Scope of Services
              </h2>
              <p>These Terms & Conditions apply to all services offered by The Myriad Hotel, including but not limited to:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Hotel Room Reservations</li>
                <li>Banquet Hall & Event Bookings</li>
                <li>Restaurant & Dining Services</li>
                <li>Corporate Events & Social Gatherings</li>
                <li>Promotional Packages & Offers</li>
                <li>Online booking and inquiry services</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                3. Booking & Reservation Policy
              </h2>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Reservations must be made through the official website, hotel reception, or authorized booking partners.</li>
                <li>A valid payment method is required to confirm bookings.</li>
                <li>Booking confirmation is subject to availability and payment verification.</li>
                <li>Guests are responsible for providing accurate personal and booking details.</li>
                <li>The hotel reserves the right to refuse or cancel bookings in cases of suspected fraud, policy violations, or misrepresentation.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                4. Check-in & Check-out Policy
              </h2>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Standard check-in and check-out timings are subject to hotel policy.</li>
                <li>Early check-in or late check-out is subject to availability and may incur additional charges.</li>
                <li>Valid government-issued photo identification is mandatory at check-in.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                5. Cancellation & Refund Policy
              </h2>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Cancellation policies vary depending on room type, banquet package, restaurant reservation, or promotional offer.</li>
                <li>Certain promotional bookings may be non-refundable.</li>
                <li>Refund timelines (if applicable) depend on payment method and banking processes.</li>
                <li>No-shows may be charged as per the booking policy.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                6. Banquet & Event Terms
              </h2>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Advance payment may be required to secure banquet or event bookings.</li>
                <li>Final guest count must be confirmed within the timeline specified by hotel management.</li>
                <li>Outside food, beverages, décor, or vendors may be restricted unless approved by management.</li>
                <li>The hotel is not responsible for loss or damage to personal belongings during events.</li>
                <li>Damage to hotel property during events will be charged to the organizer.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                7. Restaurant & Dining Policy
              </h2>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Table reservations are subject to availability.</li>
                <li>The hotel reserves the right to refuse service in case of inappropriate behavior or violation of house rules.</li>
                <li>Outside food and beverages are not permitted unless approved by management.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                8. Payment & Pricing
              </h2>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>All prices are subject to applicable taxes and government charges.</li>
                <li>The Myriad Hotel reserves the right to revise pricing without prior notice.</li>
                <li>Any additional services consumed during stay or events will be charged accordingly.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                9. Guest Conduct
              </h2>
              <p>Guests are expected to behave respectfully toward hotel staff, property, and other guests. The hotel reserves the right to remove guests or cancel services without refund in cases of:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Illegal activities</li>
                <li>Property damage</li>
                <li>Disturbance to other guests</li>
                <li>Violation of hotel rules</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                10. Website Use License
              </h2>
              <p>All content on this website is the property of The Myriad Hotel. Users may not:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Copy or modify website content</li>
                <li>Use material for commercial purposes</li>
                <li>Reverse engineer website systems</li>
                <li>Reproduce or redistribute content without permission</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                11. Disclaimer
              </h2>
              <p>
                All information on this website is provided on an "as is" basis. The Myriad Hotel makes no warranties regarding accuracy, completeness, or uninterrupted availability of the website or services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                12. Limitation of Liability
              </h2>
              <p>The Myriad Hotel shall not be liable for any indirect, incidental, or consequential loss or damage arising from:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Website usage or interruptions</li>
                <li>Booking errors or technical issues</li>
                <li>Loss of personal belongings</li>
                <li>Third-party service failures</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                13. External Links
              </h2>
              <p>
                Our website may include links to third-party websites. The Myriad Hotel is not responsible for the content or policies of external sites.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                14. Modifications to Terms
              </h2>
              <p>
                The Myriad Hotel reserves the right to update or modify these Terms & Conditions at any time. Continued use of the website or services constitutes acceptance of the revised terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                15. Governing Law
              </h2>
              <p>
                These Terms & Conditions shall be governed by and interpreted in accordance with the laws applicable in the jurisdiction where The Myriad Hotel operates. Any disputes will be subject to local court jurisdiction.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                16. Contact Information
              </h2>
              <div className="mt-4 bg-muted/30 p-4 rounded">
                <p><strong>The Myriad Hotel</strong></p>
                <p>Opp. Indian Oil Petrol Pump, Mira Bhayander Road, Mira Road (E)</p>
                <p>📧 Email: <a href="mailto:Support@myriad.net.in" className="text-primary hover:underline">Support@myriad.net.in</a></p>
                <p>📞 Phone: <a href="tel:9619618000" className="text-primary hover:underline">961 961 8000</a></p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

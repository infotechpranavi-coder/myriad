'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface PrivacyPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyPolicyModal({ open, onOpenChange }: PrivacyPolicyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="px-6 pt-6 pb-4 border-b shrink-0 relative">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif font-bold text-primary">
              Privacy Policy – The Myriad Hotel
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
                1. Introduction
              </h2>
              <p>
                Welcome to The Myriad Hotel.
              </p>
              <p>
                We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your information when you visit our website, make reservations, book banquet services, dine at our restaurants, or use any of our hotel services.
              </p>
              <p>
                By accessing or using our website, you agree to the practices described in this Privacy Policy.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                2. Scope of This Policy
              </h2>
              <p>This Privacy Policy applies to all services offered by The Myriad Hotel, including:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Hotel Room Reservations</li>
                <li>Banquet Hall & Event Bookings</li>
                <li>Restaurant & Dining Services</li>
                <li>Special Events & Promotions</li>
                <li>Website inquiries and customer support</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                3. Information We Collect
              </h2>
              <p>We may collect the following information:</p>
              
              <h3 className="text-xl font-semibold text-primary mt-4 mb-2">A. Personal Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Phone Number</li>
                <li>Address</li>
                <li>Payment & billing details</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary mt-4 mb-2">B. Reservation & Booking Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Room booking details (check-in/check-out dates)</li>
                <li>Banquet or event booking details</li>
                <li>Restaurant table reservations</li>
                <li>Guest preferences and special requests</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary mt-4 mb-2">C. Communication Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Inquiry forms submitted via website</li>
                <li>Feedback, reviews, and messages</li>
                <li>Customer service communications</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary mt-4 mb-2">D. Technical & Website Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address</li>
                <li>Browser and device details</li>
                <li>Website usage data</li>
                <li>Cookies and analytics information</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                4. How We Use Your Information
              </h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Process hotel, banquet, and restaurant bookings</li>
                <li>Confirm reservations and send booking updates</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Improve our services and website experience</li>
                <li>Manage payments and transactions</li>
                <li>Send promotional offers (where permitted)</li>
                <li>Ensure safety, fraud prevention, and legal compliance</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                5. Sharing of Information
              </h2>
              <p>
                We do not sell your personal data. We may share information only in the following situations:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Service Providers:</strong> With trusted partners such as payment gateways, booking platforms, IT support, and service vendors required to operate our business.</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights.</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or ownership transfer involving The Myriad Hotel.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                6. Cookies & Analytics
              </h2>
              <p>Our website may use cookies and tracking technologies to:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Improve website performance</li>
                <li>Remember user preferences</li>
                <li>Analyze website traffic and trends</li>
                <li>Enhance user experience</li>
              </ul>
              <p className="mt-4">
                Users may disable cookies through browser settings if preferred.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                7. Data Security
              </h2>
              <p>
                We use reasonable administrative, technical, and physical safeguards to protect your personal data. While we take strong precautions, no online system is fully secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                8. Data Retention
              </h2>
              <p>We retain personal information only for as long as necessary to:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Complete bookings and transactions</li>
                <li>Fulfill legal and accounting obligations</li>
                <li>Resolve disputes and enforce agreements</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                9. Your Rights
              </h2>
              <p>Depending on applicable laws, you may have the right to:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate details</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent for marketing communications</li>
              </ul>
              <p className="mt-4">
                To request any changes, please contact us.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                10. GDPR Compliance (EU Visitors)
              </h2>
              <p>
                For users located in the European Union, we comply with GDPR regulations. You may request access, correction, or deletion of your data by contacting us at:
              </p>
              <p className="mt-2">
                📧 <a href="mailto:Support@myriad.net.in" className="text-primary hover:underline">Support@myriad.net.in</a>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                11. Children's Privacy
              </h2>
              <p>
                Our website and services are not intended for children under the age of 13. We do not knowingly collect personal information from children.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                12. California Privacy Rights
              </h2>
              <p>
                California residents may request information regarding data-sharing practices under applicable laws by contacting us.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                13. Changes to This Policy
              </h2>
              <p>
                The Myriad Hotel reserves the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated revision date. Continued use of our website indicates acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                14. Contact Us
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

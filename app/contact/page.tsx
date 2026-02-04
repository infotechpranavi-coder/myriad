'use client';

import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="bg-background">
      {/* Header */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-serif font-bold text-primary mb-4 text-balance">
            Get In Touch
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl">
            Have questions or need assistance? We're here to help. Contact us through any of these channels.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-8">
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-foreground font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-medium mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-3 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Room Reservation</option>
                    <option>Restaurant Booking</option>
                    <option>Event Inquiry</option>
                    <option>General Question</option>
                    <option>Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="block text-foreground font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Your message here..."
                    rows={5}
                    className="w-full px-4 py-3 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground px-8 py-3 rounded font-medium hover:opacity-90 transition-opacity"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Details */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-8">
                Contact Details
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary">
                      <MapPin className="text-primary-foreground" size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Address
                    </h3>
                    <p className="text-foreground/70">
                      123 Luxury Avenue<br />
                      Downtown District<br />
                      City, State 12345
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary">
                      <Phone className="text-primary-foreground" size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Phone
                    </h3>
                    <p className="text-foreground/70">
                      Main: +1 (555) 123-4567<br />
                      Reservations: +1 (555) 123-4568<br />
                      Events: +1 (555) 123-4569
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary">
                      <Mail className="text-primary-foreground" size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Email
                    </h3>
                    <p className="text-foreground/70">
                      General: info@themyriad.com<br />
                      Reservations: book@themyriad.com<br />
                      Events: events@themyriad.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary">
                      <Clock className="text-primary-foreground" size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Hours
                    </h3>
                    <p className="text-foreground/70">
                      Monday - Friday: 7:00 AM - 10:00 PM<br />
                      Saturday - Sunday: 8:00 AM - 11:00 PM<br />
                      24/7 Emergency Line Available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
            Visit Us
          </h2>
          <div className="bg-foreground/10 rounded-lg overflow-hidden h-96 flex items-center justify-center border border-border">
            <div className="text-center">
              <MapPin size={48} className="text-primary mx-auto mb-4" />
              <p className="text-foreground/70 text-lg">
                Interactive map coming soon<br />
                <span className="text-sm">Embedded Google Maps</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-primary mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'What is your cancellation policy?',
                a: 'Cancellations made 48 hours prior to check-in receive a full refund. Cancellations within 48 hours are subject to one night\'s charge.',
              },
              {
                q: 'Do you offer airport transfer service?',
                a: 'Yes, we offer complimentary airport transfer for guests staying 3 or more nights. Extended stay packages available.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, debit cards, and digital payment methods. Direct bank transfers available for group bookings.',
              },
              {
                q: 'Are pets allowed at The Myriad Hotel?',
                a: 'Select rooms are pet-friendly with an additional charge of $50 per night. Please inform us during booking.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-primary mb-3">{item.q}</h3>
                <p className="text-foreground/70">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-6 text-balance">
            Still Have Questions?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Our team is available 24/7 to assist you
          </p>
          <button className="bg-primary-foreground text-primary px-8 py-4 rounded text-lg font-medium hover:opacity-90 transition-opacity">
            Call Now
          </button>
        </div>
      </section>
    </main>
  );
}

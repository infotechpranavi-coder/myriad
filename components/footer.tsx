import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-foreground to-foreground/95 text-background border-t border-background/10">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="font-serif text-3xl font-bold bg-gradient-to-r from-background to-background/80 bg-clip-text text-transparent">
              The Myriad
            </h3>
            <p className="text-background/70 text-sm leading-relaxed">
              Experience timeless luxury at the heart of the city. Where elegance meets comfort.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                <p className="text-background/70 text-sm">
                  The Myriad Hotel, Opp. Indian Oil Petrol Pump, Mira Bhayander Road, Mira Road (E)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="tel:9619618000" className="text-background/70 hover:text-background text-sm transition-colors">
                  961 961 8000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:info@myriadhotel.com" className="text-background/70 hover:text-background text-sm transition-colors">
                  info@myriadhotel.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-background">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/rooms" 
                  className="text-background/70 hover:text-background text-sm flex items-center gap-2 group transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span className="group-hover:translate-x-2 transition-transform">Rooms</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/restaurants" 
                  className="text-background/70 hover:text-background text-sm flex items-center gap-2 group transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span className="group-hover:translate-x-2 transition-transform">Restaurants</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/banquet" 
                  className="text-background/70 hover:text-background text-sm flex items-center gap-2 group transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span className="group-hover:translate-x-2 transition-transform">Banquet Hall</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-background/70 hover:text-background text-sm flex items-center gap-2 group transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span className="group-hover:translate-x-2 transition-transform">Blog</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-background">Legal & Support</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-background/70 hover:text-background text-sm flex items-center gap-2 group transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span className="group-hover:translate-x-2 transition-transform">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-background/70 hover:text-background text-sm flex items-center gap-2 group transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span className="group-hover:translate-x-2 transition-transform">Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-background/70 hover:text-background text-sm flex items-center gap-2 group transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span className="group-hover:translate-x-2 transition-transform">Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-background">Connect With Us</h4>
            <p className="text-background/70 text-sm mb-6">
              Follow us on social media for the latest updates and exclusive offers.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary/20 flex items-center justify-center text-background/70 hover:text-background transition-all duration-300 hover:scale-110 hover:rotate-3"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary/20 flex items-center justify-center text-background/70 hover:text-background transition-all duration-300 hover:scale-110 hover:rotate-3"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary/20 flex items-center justify-center text-background/70 hover:text-background transition-all duration-300 hover:scale-110 hover:rotate-3"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm text-center md:text-left">
              {'©'} {new Date().getFullYear()} The Myriad Hotel. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-background/60 hover:text-background transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-background/60 hover:text-background transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-background/60 hover:text-background transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

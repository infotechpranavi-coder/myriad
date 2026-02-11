'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';
import { Banner } from '@/lib/models/banner';

export default function AboutPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    try {
      const response = await fetch('/api/banners');
      if (response.ok) {
        const data = await response.json();
        // Filter only active banners for about page
        const activeBanners = data.filter(
          (banner: Banner) => banner.isActive && banner.page === 'about'
        );
        setBanners(activeBanners);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  }

  // Default banner if none exist
  const defaultBanner = {
    title: 'About The Myriad Hotel',
    subtitle: 'Experience Timeless Luxury',
    image: '/hero.jpg',
    link: '/rooms',
    buttonText: 'Explore Our Rooms',
  };

  const displayBanners = banners.length > 0 ? banners : [defaultBanner];

  return (
    <main className="bg-background">
      {/* Hero Section with Banners */}
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
        {displayBanners.length > 1 ? (
          <Carousel
            plugins={[plugin.current]}
            className="w-full h-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="h-full">
              {displayBanners.map((banner, index) => (
                <CarouselItem key={index} className="h-full">
                  <div className="relative w-full h-full">
                    <Image
                      src={banner.image || '/hero.jpg'}
                      alt={banner.title || 'About The Myriad Hotel'}
                      fill
                      className="object-cover brightness-75"
                      priority={index === 0}
                      quality={95}
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
                      <div>
                        <h1 className="text-6xl md:text-7xl font-serif font-bold mb-4 text-balance animate-fade-up">
                          {banner.title || 'About The Myriad Hotel'}
                        </h1>
                        {banner.subtitle && (
                          <p className="text-xl md:text-2xl mb-8 font-light animate-fade-up animate-delay-200">
                            {banner.subtitle}
                          </p>
                        )}
                        {(banner.link || banner.buttonText) && (
                          <Link
                            href={banner.link || '/rooms'}
                            className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded text-lg font-medium transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95 animate-fade-up animate-delay-300"
                          >
                            {banner.buttonText || 'Explore Our Rooms'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
            <CarouselNext className="right-4 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
          </Carousel>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={displayBanners[0]?.image || '/hero.jpg'}
              alt={displayBanners[0]?.title || 'About The Myriad Hotel'}
              fill
              className="object-cover brightness-75"
              priority
              quality={95}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
              <div>
                <h1 className="text-6xl md:text-7xl font-serif font-bold mb-4 text-balance animate-fade-up">
                  {displayBanners[0]?.title || 'About The Myriad Hotel'}
                </h1>
                {displayBanners[0]?.subtitle && (
                  <p className="text-xl md:text-2xl mb-8 font-light animate-fade-up animate-delay-200">
                    {displayBanners[0].subtitle}
                  </p>
                )}
                {(displayBanners[0]?.link || displayBanners[0]?.buttonText) && (
                  <Link
                    href={displayBanners[0].link || '/rooms'}
                    className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded text-lg font-medium transition-smooth hover:shadow-lg hover:-translate-y-1 active:scale-95 animate-fade-up animate-delay-300"
                  >
                    {displayBanners[0].buttonText || 'Explore Our Rooms'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* About Content Section - You can add more content here */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimationWrapper animation="fadeUp">
            <h2 className="text-4xl font-serif font-bold text-primary mb-8 text-center">
              Our Story
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed text-center max-w-3xl mx-auto">
              Welcome to The Myriad Hotel, where luxury meets comfort and every moment is crafted to perfection.
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </main>
  );
}

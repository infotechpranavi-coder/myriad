'use client';

import React from 'react';
import Image from 'next/image';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { MapPin } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';
import Autoplay from 'embla-carousel-autoplay';

const heroSlides = [
    {
        id: 1,
        image: '/rooms/superior.png',
        title: 'Exquisite Luxury',
        subtitle: 'Superior Suite',
        description: 'Experience unparalleled elegance with panoramic city vistas and bespoke service.',
    },
    {
        id: 2,
        image: '/rooms/executive.png',
        title: 'Refined Business',
        subtitle: 'Executive Comfort',
        description: 'Designed for the modern professional, blending productivity with sophisticated comfort.',
    },
    {
        id: 3,
        image: '/rooms/deluxe.png',
        title: 'Modern Serenity',
        subtitle: 'Deluxe Living',
        description: 'A perfect sanctuary of peace and modern design for your urban getaway.',
    },
];

export function RoomHero() {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: false })
    );

    return (
        <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
            <Carousel
                opts={{
                    align: 'start',
                    loop: true,
                }}
                plugins={[plugin.current]}
                className="w-full h-full"
            >
                <CarouselContent className="h-full ml-0">
                    {heroSlides.map((slide) => (
                        <CarouselItem key={slide.id} className="relative h-full w-full pl-0">
                            <div className="relative h-[80vh] min-h-[600px] w-full">
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover brightness-[0.7]"
                                    priority={slide.id === 1}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                                <div className="absolute inset-0 flex items-center">
                                    <div className="max-w-7xl mx-auto px-4 w-full">
                                        <ScrollAnimationWrapper animation="fadeUp" className="max-w-2xl">
                                            <div className="flex items-center gap-2 text-primary-foreground/80 font-medium mb-4 tracking-widest uppercase text-xs md:text-sm">
                                                <MapPin size={16} className="text-primary" />
                                                <span>Thane, Mumbai</span>
                                            </div>
                                            <h2 className="text-lg md:text-xl font-serif italic text-primary mb-2">
                                                {slide.subtitle}
                                            </h2>
                                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight tracking-tight">
                                                {slide.title}
                                            </h1>
                                            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed font-light">
                                                {slide.description}
                                            </p>
                                        </ScrollAnimationWrapper>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="hidden md:block">
                    <CarouselPrevious className="left-8 bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white size-12" />
                    <CarouselNext className="right-8 bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white size-12" />
                </div>
            </Carousel>

            {/* Aesthetic Overlay Element */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent z-10" />
        </section>
    );
}

'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import {
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Star,
    MapPin,
    Wifi,
    Coffee,
    Tv,
    Wind,
    Sofa,
    Shield,
    CheckCircle2,
    Clock,
    CreditCard,
    Waves,
    Zap,
    Info,
    User,
    Calendar as CalendarIcon,
    X,
} from 'lucide-react';

import { roomTypes } from '@/lib/room-data';
import { PricingSidebar } from '@/components/PricingSidebar';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const amenityIcons: Record<string, React.ReactNode> = {
    'Double Bed': <Sofa size={18} />,
    'King Bed': <Sofa size={18} />,
    'High-speed WiFi': <Wifi size={18} />,
    'Smart TV': <Tv size={18} />,
    'Air Conditioning': <Wind size={18} />,
    Safe: <Shield size={18} />,
    'Mini Bar': <Coffee size={18} />,
    Jacuzzi: <Waves size={18} />,
    'Work Desk': <Zap size={18} />,
};

export default function RoomDetailPage() {
    const params = useParams();
    const router = useRouter();
    const room = roomTypes.find((r) => r.id === params.id);

    // Date state - default to tomorrow and day after
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const [dateRange, setDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: tomorrow,
        to: dayAfter,
    });

    // Image preview state
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    if (!room) return null;

    const taxes = Math.round(room.price * 0.12);

    // Calculate number of nights
    const nights = dateRange.from && dateRange.to
        ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
        : 1;

    return (
        <main className="min-h-screen bg-muted/20">
            {/* Top Header */}
            <div className="sticky top-0 z-50 bg-background border-b">
                <div className="max-w-7xl mx-auto flex items-center gap-4 px-4 py-4">
                    <button
                        onClick={() => router.push('/rooms')}
                        className="p-2 rounded-full hover:bg-muted"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex-1">
                        <h1 className="text-lg font-bold">The Myriad Business Hotel</h1>
                        <p className="text-xs text-muted-foreground">
                            Thane, Mumbai · 3 Star Hotel
                        </p>
                    </div>

                    <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(3)].map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Calendar Date Picker Section */}
            <div className="bg-background border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !dateRange.from && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange.from ? (
                                            format(dateRange.from, 'EEE, d MMM yyyy')
                                        ) : (
                                            <span>Check-in</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateRange.from}
                                        onSelect={(date) => {
                                            if (date) {
                                                setDateRange((prev) => {
                                                    const newFrom = date;
                                                    const newTo = prev.to && newFrom.getTime() >= prev.to.getTime() 
                                                        ? undefined 
                                                        : prev.to;
                                                    return {
                                                        from: newFrom,
                                                        to: newTo,
                                                    };
                                                });
                                            }
                                        }}
                                        disabled={(date) => {
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            return date < today;
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !dateRange.to && 'text-muted-foreground'
                                        )}
                                        disabled={!dateRange.from}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange.to ? (
                                            format(dateRange.to, 'EEE, d MMM yyyy')
                                        ) : (
                                            <span>Check-out</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateRange.to}
                                        onSelect={(date) => {
                                            if (date && dateRange.from) {
                                                setDateRange((prev) => ({
                                                    ...prev,
                                                    to: date.getTime() > prev.from!.getTime() ? date : undefined,
                                                }));
                                            }
                                        }}
                                        disabled={(date) => {
                                            if (!dateRange.from) return true;
                                            const checkInDate = new Date(dateRange.from);
                                            checkInDate.setHours(0, 0, 0, 0);
                                            const selectedDate = new Date(date);
                                            selectedDate.setHours(0, 0, 0, 0);
                                            return selectedDate.getTime() <= checkInDate.getTime();
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="text-sm text-muted-foreground">
                            {nights} {nights === 1 ? 'Night' : 'Nights'}
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN TWO COLUMN LAYOUT */}
            <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-[1fr_380px] gap-6">
                {/* LEFT COLUMN */}
                <div className="space-y-6">
                    {/* PROPERTY INFO */}
                    <div className="bg-background rounded-lg border p-6">
                        <div className="flex gap-4">
                            <Image
                                src={room.images[0]}
                                alt={room.name}
                                width={120}
                                height={120}
                                className="rounded-md object-cover"
                            />

                            <div className="flex-1">
                                <h2 className="font-bold text-lg">{room.name}</h2>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin size={14} />
                                    Thane, Mumbai
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                                        3.9/5
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        1207 Ratings
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6 border-t pt-4">
                            <div>
                                <p className="text-xs text-muted-foreground">Check-in</p>
                                <p className="font-semibold">
                                    {dateRange.from
                                        ? format(dateRange.from, 'EEE, d MMM yyyy')
                                        : 'Select date'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Check-out</p>
                                <p className="font-semibold">
                                    {dateRange.to
                                        ? format(dateRange.to, 'EEE, d MMM yyyy')
                                        : 'Select date'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Guests</p>
                                <p className="font-semibold">
                                    2 Adults · {nights} {nights === 1 ? 'Night' : 'Nights'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ROOM CARD */}
                    <div className="bg-background border rounded-lg p-6">
                        <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded mb-2">
                            Great Choice!
                        </span>

                        <h3 className="font-bold mb-2">Room</h3>

                        <div className="border rounded-md p-4 flex justify-between">
                            <div>
                                <p className="font-semibold">1 x {room.name}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <User size={14} /> 2 Adults
                                </p>
                                <p className="text-sm mt-1">Room Only</p>
                                <p className="text-sm text-green-600">
                                    Free Cancellation before 27 Feb 11:59 AM
                                </p>
                            </div>

                            <div className="text-right text-sm">
                                <p className="flex items-center gap-1 justify-end text-green-600">
                                    <CheckCircle2 size={14} /> Free Cancellation
                                </p>
                                <p>Book @ ₹0 available</p>
                            </div>
                        </div>
                    </div>

                    {/* IMAGE GALLERY */}
                    <Carousel>
                        <CarouselContent>
                            {room.images.map((img, i) => (
                                <CarouselItem key={i}>
                                    <Image
                                        src={img}
                                        alt={room.name}
                                        width={900}
                                        height={500}
                                        className="rounded-lg object-cover"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>

                    {/* GALLERY SECTION */}
                    <div className="bg-background border rounded-lg p-6">
                        <h3 className="font-bold mb-4">Gallery</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {room.images.map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedImageIndex(i)}
                                    className="relative aspect-video overflow-hidden rounded-lg group cursor-pointer"
                                >
                                    <Image
                                        src={img}
                                        alt={`${room.name} - Image ${i + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* IMAGE PREVIEW MODAL */}
                    <Dialog
                        open={selectedImageIndex !== null}
                        onOpenChange={(open) => !open && setSelectedImageIndex(null)}
                    >
                        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none">
                            <DialogTitle className="sr-only">
                                {selectedImageIndex !== null
                                    ? `${room.name} - Image ${selectedImageIndex + 1} of ${room.images.length}`
                                    : 'Image Preview'}
                            </DialogTitle>
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Close Button */}
                                <DialogClose className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full p-2 transition-colors">
                                    <X size={24} />
                                </DialogClose>

                                {/* Previous Button */}
                                {selectedImageIndex !== null && selectedImageIndex > 0 && (
                                    <button
                                        onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
                                        className="absolute left-4 z-50 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft size={32} />
                                    </button>
                                )}

                                {/* Image */}
                                {selectedImageIndex !== null && (
                                    <div className="relative w-full h-full flex items-center justify-center p-8">
                                        <Image
                                            src={room.images[selectedImageIndex]}
                                            alt={`${room.name} - Image ${selectedImageIndex + 1}`}
                                            width={1200}
                                            height={800}
                                            className="max-w-full max-h-full object-contain"
                                            priority
                                        />
                                    </div>
                                )}

                                {/* Next Button */}
                                {selectedImageIndex !== null &&
                                    selectedImageIndex < room.images.length - 1 && (
                                        <button
                                            onClick={() =>
                                                setSelectedImageIndex(selectedImageIndex + 1)
                                            }
                                            className="absolute right-4 z-50 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight size={32} />
                                        </button>
                                    )}

                                {/* Image Counter */}
                                {selectedImageIndex !== null && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                                        {selectedImageIndex + 1} / {room.images.length}
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* DESCRIPTION + AMENITIES */}
                    <div className="bg-background border rounded-lg p-6">
                        <h3 className="font-bold mb-3">About the Room</h3>
                        <p className="text-muted-foreground mb-6">{room.description}</p>

                        <h4 className="font-bold mb-3">Amenities</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {room.amenities.map((a) => (
                                <div key={a} className="flex items-center gap-2 text-sm">
                                    {amenityIcons[a] || <CheckCircle2 size={16} />}
                                    {a}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* GUEST DETAILS */}
                    <div className="bg-background border rounded-lg p-6">
                        <h3 className="font-bold mb-4">Guest Details</h3>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <Select defaultValue="Mr">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Mr">Mr</SelectItem>
                                    <SelectItem value="Ms">Ms</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input placeholder="First Name" />
                            <Input placeholder="Last Name" />
                        </div>

                        <Input placeholder="Email Address" className="mb-4" />
                        <Input placeholder="Mobile Number" />
                    </div>
                </div>

                {/* RIGHT COLUMN – STICKY PRICE SUMMARY */}
                <div className="sticky top-24 h-fit">
                    <PricingSidebar
                        roomName={room.name}
                        price={room.price}
                        taxes={taxes}
                    />
                </div>
            </div>
        </main>
    );
}
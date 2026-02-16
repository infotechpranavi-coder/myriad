'use client';

import React, { useState, useEffect } from 'react';
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
    CheckCircle,
} from 'lucide-react';

import { Room } from '@/lib/models/room';
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
    DialogHeader,
    DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
    const { toast } = useToast();
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);

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

    // Guest details form state
    const [guestForm, setGuestForm] = useState({
        title: 'Mr',
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<{
        roomName: string;
        checkIn: Date | undefined;
        checkOut: Date | undefined;
        nights: number;
        guests: string;
        totalAmount: number;
    } | null>(null);

    useEffect(() => {
        async function fetchRoom() {
            try {
                const response = await fetch(`/api/rooms/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setRoom(data);
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('Failed to fetch room:', errorData.error || response.statusText);
                    setRoom(null);
                }
            } catch (error) {
                console.error('Error fetching room:', error);
                setRoom(null);
            } finally {
                setLoading(false);
            }
        }
        if (params.id) {
            fetchRoom();
        }
    }, [params.id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-muted/20 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Loading room details...</p>
                </div>
            </main>
        );
    }

    if (!room) {
        return (
            <main className="min-h-screen bg-muted/20 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Room Not Found</h1>
                    <Button onClick={() => router.push('/rooms')}>Back to Rooms</Button>
                </div>
            </main>
        );
    }

    const basePrice = room.priceSummary?.basePrice || room.price || 0;
    const taxes = room.priceSummary?.taxes || 0;
    const serviceFees = room.priceSummary?.serviceFees || 0;
    const roomImages = room.gallery || room.images || [];
    const roomName = room.title || room.name || 'Room';
    const addons = room.addons || [];
    const goibiboOffers = room.goibiboOffers || [];

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
                            {roomImages[0] && (
                                <Image
                                    src={roomImages[0]}
                                    alt={roomName}
                                    width={120}
                                    height={120}
                                    className="rounded-md object-cover"
                                />
                            )}

                            <div className="flex-1">
                                <h2 className="font-bold text-lg">{roomName}</h2>
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
                                <p className="font-semibold">1 x {roomName}</p>
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
                    {roomImages.length > 0 && (
                        <Carousel>
                            <CarouselContent>
                                {roomImages.map((img, i) => (
                                    <CarouselItem key={i}>
                                        {img.startsWith('/') ? (
                                            <Image
                                                src={img}
                                                alt={roomName}
                                                width={900}
                                                height={500}
                                                className="rounded-lg object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={img}
                                                alt={roomName}
                                                className="w-full h-[500px] rounded-lg object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    )}

                    {/* GALLERY SECTION */}
                    {roomImages.length > 0 && (
                        <div className="bg-background border rounded-lg p-6">
                            <h3 className="font-bold mb-4">Gallery</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {roomImages.map((img, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedImageIndex(i)}
                                        className="relative aspect-video overflow-hidden rounded-lg group cursor-pointer"
                                    >
                                        {img.startsWith('/') ? (
                                            <Image
                                                src={img}
                                                alt={`${roomName} - Image ${i + 1}`}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        ) : (
                                            <img
                                                src={img}
                                                alt={`${roomName} - Image ${i + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* IMAGE PREVIEW MODAL */}
                    <Dialog
                        open={selectedImageIndex !== null}
                        onOpenChange={(open) => !open && setSelectedImageIndex(null)}
                    >
                        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none">
                            <DialogTitle className="sr-only">
                                {selectedImageIndex !== null
                                    ? `${roomName} - Image ${selectedImageIndex + 1} of ${roomImages.length}`
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
                                {selectedImageIndex !== null && roomImages[selectedImageIndex] && (
                                    <div className="relative w-full h-full flex items-center justify-center p-8">
                                        {roomImages[selectedImageIndex].startsWith('/') ? (
                                            <Image
                                                src={roomImages[selectedImageIndex]}
                                                alt={`${roomName} - Image ${selectedImageIndex + 1}`}
                                                width={1200}
                                                height={800}
                                                className="max-w-full max-h-full object-contain"
                                                priority
                                            />
                                        ) : (
                                            <img
                                                src={roomImages[selectedImageIndex]}
                                                alt={`${roomName} - Image ${selectedImageIndex + 1}`}
                                                className="max-w-full max-h-full object-contain"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                    </div>
                                )}

                                {/* Next Button */}
                                {selectedImageIndex !== null &&
                                    selectedImageIndex < roomImages.length - 1 && (
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
                                        {selectedImageIndex + 1} / {roomImages.length}
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* DESCRIPTION + AMENITIES */}
                    <div className="bg-background border rounded-lg p-6">
                        <h3 className="font-bold mb-3">About the Room</h3>
                        <p className="text-muted-foreground mb-6">{room.description}</p>

                        <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                            <p className="text-foreground/60 text-sm mb-1">
                                Rooms Reception Contact Number
                            </p>
                            <a 
                                href="tel:8879929746"
                                className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity font-mono"
                            >
                                88799 29746
                            </a>
                        </div>

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

                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    setSubmitting(true);
                                    const bookingData = {
                                        roomId: room?.id || params.id,
                                        roomName: roomName,
                                        title: guestForm.title,
                                        firstName: guestForm.firstName,
                                        lastName: guestForm.lastName,
                                        email: guestForm.email,
                                        mobileNumber: guestForm.mobileNumber,
                                        checkIn: dateRange.from,
                                        checkOut: dateRange.to,
                                        guests: '2',
                                        nights: nights,
                                        totalAmount: basePrice + taxes + serviceFees,
                                    };

                                    const response = await fetch('/api/bookings', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(bookingData),
                                    });

                                    if (response.ok) {
                                        // Store booking details before resetting form
                                        setBookingDetails({
                                            roomName: roomName,
                                            checkIn: dateRange.from,
                                            checkOut: dateRange.to,
                                            nights: nights,
                                            guests: '2',
                                            totalAmount: basePrice + taxes + serviceFees,
                                        });
                                        // Reset form
                                        setGuestForm({
                                            title: 'Mr',
                                            firstName: '',
                                            lastName: '',
                                            email: '',
                                            mobileNumber: '',
                                        });
                                        // Show confirmation modal
                                        setShowConfirmation(true);
                                    } else {
                                        const error = await response.json();
                                        toast({
                                            title: 'Error',
                                            description: error.error || 'Failed to submit booking',
                                            variant: 'destructive',
                                        });
                                    }
                                } catch (error) {
                                    console.error('Error submitting booking:', error);
                                    toast({
                                        title: 'Error',
                                        description: 'Failed to submit booking',
                                        variant: 'destructive',
                                    });
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <Select
                                    value={guestForm.title}
                                    onValueChange={(value) =>
                                        setGuestForm({ ...guestForm, title: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mr">Mr</SelectItem>
                                        <SelectItem value="Ms">Ms</SelectItem>
                                        <SelectItem value="Mrs">Mrs</SelectItem>
                                        <SelectItem value="Dr">Dr</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Input
                                    placeholder="First Name"
                                    value={guestForm.firstName}
                                    onChange={(e) =>
                                        setGuestForm({ ...guestForm, firstName: e.target.value })
                                    }
                                    required
                                />
                                <Input
                                    placeholder="Last Name"
                                    value={guestForm.lastName}
                                    onChange={(e) =>
                                        setGuestForm({ ...guestForm, lastName: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <Input
                                type="email"
                                placeholder="Email Address (optional)"
                                className="mb-4"
                                value={guestForm.email}
                                onChange={(e) =>
                                    setGuestForm({ ...guestForm, email: e.target.value })
                                }
                            />
                            <Input
                                type="tel"
                                placeholder="Mobile Number"
                                className="mb-4"
                                value={guestForm.mobileNumber}
                                onChange={(e) =>
                                    setGuestForm({ ...guestForm, mobileNumber: e.target.value })
                                }
                                required
                            />
                            <Button type="submit" className="w-full" disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Submit Booking'}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* RIGHT COLUMN – STICKY PRICE SUMMARY */}
                <div className="sticky top-24 h-fit">
                    <PricingSidebar
                        roomName={roomName}
                        price={basePrice}
                        taxes={taxes}
                        serviceFees={serviceFees}
                        addons={addons}
                        goibiboOffers={goibiboOffers}
                    />
                </div>
            </div>

            {/* Booking Confirmation Modal */}
            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <DialogTitle className="text-2xl font-serif">Room Booking Confirmed!</DialogTitle>
                            <DialogDescription className="text-base">
                                Your room booking has been submitted successfully. We will contact you shortly to confirm your reservation.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        {bookingDetails && (
                            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Room:</span>
                                    <span className="text-sm font-semibold">{bookingDetails.roomName}</span>
                                </div>
                                {bookingDetails.checkIn && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Check-in:</span>
                                        <span className="text-sm font-semibold">
                                            {format(bookingDetails.checkIn, 'EEEE, MMMM d, yyyy')}
                                        </span>
                                    </div>
                                )}
                                {bookingDetails.checkOut && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Check-out:</span>
                                        <span className="text-sm font-semibold">
                                            {format(bookingDetails.checkOut, 'EEEE, MMMM d, yyyy')}
                                        </span>
                                    </div>
                                )}
                                {bookingDetails.nights > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Nights:</span>
                                        <span className="text-sm font-semibold">{bookingDetails.nights} {bookingDetails.nights === 1 ? 'Night' : 'Nights'}</span>
                                    </div>
                                )}
                                {bookingDetails.guests && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Guests:</span>
                                        <span className="text-sm font-semibold">{bookingDetails.guests} {bookingDetails.guests === '1' ? 'Guest' : 'Guests'}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t">
                                    <span className="text-sm font-medium">Total Amount:</span>
                                    <span className="text-lg font-bold">₹{bookingDetails.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                        <Button
                            onClick={() => setShowConfirmation(false)}
                            className="w-full"
                            size="lg"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    );
}
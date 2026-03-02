'use client'

import React from 'react'
import { CheckCircle, Calendar as CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface PricingSidebarProps {
    roomName: string
    price: number
    pricePer24Hours?: number
    hours?: number
    nights?: number
    taxes?: number
    serviceFees?: number
    addons?: Array<{
        name: string
        price: number
        description?: string
    }>
    selectedAddons?: Set<number>
    onAddonToggle?: (index: number) => void
    goibiboOffers?: Array<{
        title: string
        description: string
        discount?: string
    }>
    // Booking form props
    guestForm?: {
        firstName: string
        lastName: string
        email: string
        mobileNumber: string
    }
    onGuestFormChange?: (field: string, value: string) => void
    dateRange?: {
        from: Date | undefined
        to: Date | undefined
    }
    onDateRangeChange?: (dates: { from: Date | undefined; to: Date | undefined }) => void
    onSubmit?: (e: React.FormEvent) => void
    submitting?: boolean
}

export function PricingSidebar({ 
    roomName, 
    price, 
    pricePer24Hours, 
    hours, 
    nights, 
    taxes = 0, 
    serviceFees = 0, 
    addons = [], 
    selectedAddons = new Set(), 
    onAddonToggle, 
    goibiboOffers = [],
    guestForm,
    onGuestFormChange,
    dateRange,
    onDateRangeChange,
    onSubmit,
    submitting = false
}: PricingSidebarProps) {
    const totalTaxesAndFees = taxes + serviceFees;
    
    // Calculate selected addons total
    const selectedAddonsTotal = Array.from(selectedAddons).reduce((sum, index) => {
        return sum + (addons[index]?.price || 0);
    }, 0);
    
    const total = price + totalTaxesAndFees + selectedAddonsTotal;

    return (
        <div className="sticky top-24 space-y-4">
            {/* Booking Form */}
            <div className="bg-background rounded-sm border border-border shadow-sm overflow-hidden">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">Book a Room</h3>
                    <form onSubmit={onSubmit} className="space-y-4">
                        {/* Name and Last Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Name *</label>
                                <Input
                                    placeholder="First Name"
                                    value={guestForm?.firstName || ''}
                                    onChange={(e) => onGuestFormChange?.('firstName', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Last Name *</label>
                                <Input
                                    placeholder="Last Name"
                                    value={guestForm?.lastName || ''}
                                    onChange={(e) => onGuestFormChange?.('lastName', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Email Address (Optional)</label>
                            <Input
                                type="email"
                                placeholder="your.email@example.com (optional)"
                                value={guestForm?.email || ''}
                                onChange={(e) => onGuestFormChange?.('email', e.target.value)}
                            />
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Phone Number *</label>
                            <Input
                                type="tel"
                                placeholder="+91 1234567890"
                                value={guestForm?.mobileNumber || ''}
                                onChange={(e) => onGuestFormChange?.('mobileNumber', e.target.value)}
                                required
                            />
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Date *</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !dateRange?.from && 'text-muted-foreground'
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateRange?.from ? (
                                                format(dateRange.from, 'MM/dd/yyyy')
                                            ) : (
                                                <span>mm/dd/yyyy</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dateRange?.from}
                                            onSelect={(date) => {
                                                if (date && onDateRangeChange) {
                                                    const newFrom = date;
                                                    const newTo = dateRange?.to && newFrom.getTime() >= dateRange.to.getTime() 
                                                        ? undefined 
                                                        : dateRange?.to;
                                                    onDateRangeChange({
                                                        from: newFrom,
                                                        to: newTo,
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
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">To Date *</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !dateRange?.to && 'text-muted-foreground'
                                            )}
                                            disabled={!dateRange?.from}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateRange?.to ? (
                                                format(dateRange.to, 'MM/dd/yyyy')
                                            ) : (
                                                <span>mm/dd/yyyy</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dateRange?.to}
                                            onSelect={(date) => {
                                                if (date && dateRange?.from && onDateRangeChange) {
                                                    onDateRangeChange({
                                                        ...dateRange,
                                                        to: date.getTime() > dateRange.from.getTime() ? date : undefined,
                                                    });
                                                }
                                            }}
                                            disabled={(date) => {
                                                if (!dateRange?.from) return true;
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
                        </div>

                        {/* Price Display */}
                        <div className="pt-4 border-t border-border">
                            <div className="space-y-2">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-sm font-semibold text-foreground/80">
                                        Price + Taxes & Service Fees
                                    </span>
                                    <span className="text-base font-bold text-foreground">
                                        ₹{price.toLocaleString()} + ₹{totalTaxesAndFees.toLocaleString()}
                                    </span>
                                </div>
                                {pricePer24Hours && nights !== undefined && nights > 0 ? (
                                    <p className="text-xs text-foreground/50">
                                        (₹{pricePer24Hours.toLocaleString()}/24hrs × {nights} {nights === 1 ? 'night' : 'nights'})
                                    </p>
                                ) : null}
                                {selectedAddonsTotal > 0 && (
                                    <div className="flex items-baseline justify-between pt-2">
                                        <span className="text-sm font-semibold text-foreground/80">
                                            Selected Addons
                                        </span>
                                        <span className="text-base font-bold text-foreground">
                                            ₹{selectedAddonsTotal.toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-baseline justify-between pt-2 border-t border-border">
                                    <span className="text-base font-bold text-foreground">
                                        Total Amount to be paid
                                    </span>
                                    <span className="text-xl font-bold text-foreground">
                                        ₹{total.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Booking Request'}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                            We'll confirm your reservation within 24 hours
                        </p>
                    </form>
                </div>
            </div>

            {/* Addons */}
            <div className="bg-background rounded-sm border border-border shadow-sm overflow-hidden">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">Addons</h3>
                    <p className="text-sm text-foreground/60 mb-6">Price inclusive of taxes and for all guests</p>

                    <div className="space-y-4">
                        {addons.length > 0 ? (
                            addons.map((addon, index) => {
                                const isSelected = selectedAddons.has(index);
                                return (
                                    <div key={index} className={`border rounded-sm p-4 ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground mb-1">
                                                    Add <span className="font-bold">{addon.name}</span> for ₹{addon.price.toLocaleString()} for all guests
                                                </p>
                                                {addon.description && (
                                                    <p className="text-xs text-foreground/50">{addon.description}</p>
                                                )}
                                                <p className="text-xs text-foreground/50 mt-1">Includes taxes and fees</p>
                                            </div>
                                            <button 
                                                onClick={() => onAddonToggle?.(index)}
                                                className={`text-sm font-bold shrink-0 ml-4 px-3 py-1 rounded transition-colors ${
                                                    isSelected 
                                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                                                        : 'text-primary hover:underline'
                                                }`}
                                            >
                                                {isSelected ? 'REMOVE' : 'APPLY'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="border border-border rounded-sm p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground mb-1">
                                            Add <span className="font-bold">Breakfast</span> for ₹1061 for all guests
                                        </p>
                                        <p className="text-xs text-foreground/50">Includes taxes and fees</p>
                                    </div>
                                    <button className="text-sm font-bold text-primary hover:underline shrink-0 ml-4">
                                        APPLY
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="bg-muted/30 border border-border rounded-sm p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-foreground mb-1">
                                        Tap to contribute ₹10 towards plantation of two million trees
                                    </p>
                                    <button className="text-sm font-medium text-primary hover:underline">
                                        Know More
                                    </button>
                                </div>
                                <div className="w-12 h-6 bg-border rounded-full shrink-0 ml-4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Goibibo Offers */}
            {goibiboOffers.length > 0 && (
                <div className="bg-background rounded-sm border border-border shadow-sm overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-foreground mb-4">Goibibo Offers</h3>

                        <div className="space-y-3">
                            {goibiboOffers.map((offer, index) => (
                                <div key={index} className="bg-primary/5 border border-primary/20 rounded-sm p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle size={24} className="text-green-600 fill-green-600" />
                                            <div>
                                                <p className="text-base font-bold text-green-700">{offer.title}</p>
                                                <p className="text-xs text-foreground/60 mt-0.5">
                                                    {offer.description}
                                                </p>
                                            </div>
                                        </div>
                                        {offer.discount && (
                                            <span className="text-lg font-bold text-green-700 shrink-0 ml-4">
                                                {offer.discount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

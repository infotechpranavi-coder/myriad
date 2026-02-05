'use client'

import React from 'react'
import { ChevronDown, Gift, CheckCircle } from 'lucide-react'

interface PricingSidebarProps {
    roomName: string
    price: number
    taxes?: number
    serviceFees?: number
    addons?: Array<{
        name: string
        price: number
        description?: string
    }>
    goibiboOffers?: Array<{
        title: string
        description: string
        discount?: string
    }>
}

export function PricingSidebar({ roomName, price, taxes = 0, serviceFees = 0, addons = [], goibiboOffers = [] }: PricingSidebarProps) {
    const totalTaxesAndFees = taxes + serviceFees;
    const total = price + totalTaxesAndFees;

    return (
        <div className="sticky top-24 space-y-4">
            {/* Price Summary */}
            <div className="bg-background rounded-sm border border-border shadow-sm overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-foreground">Price Summary</h3>
                        <button className="flex items-center gap-2 text-sm text-primary font-medium hover:underline">
                            View Full Breakup
                            <ChevronDown size={16} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex items-baseline justify-between mb-1">
                                <span className="text-sm font-semibold text-foreground/80">
                                    Price + Taxes & Service Fees
                                </span>
                                <span className="text-lg font-bold text-foreground">
                                    ₹{price.toLocaleString()} + ₹{totalTaxesAndFees.toLocaleString()}
                                </span>
                            </div>
                            <p className="text-xs text-foreground/50">(1 Room x 1 Night)</p>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <div className="flex items-baseline justify-between">
                                <span className="text-base font-bold text-foreground">
                                    Total Amount to be paid
                                </span>
                                <span className="text-2xl font-bold text-foreground">
                                    ₹{total.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/20 rounded-sm p-4 flex items-start gap-3">
                            <Gift size={20} className="text-primary shrink-0 mt-0.5" />
                            <p className="text-sm text-primary font-medium">
                                Unlock Lower Pricing: Log In Now.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Addons */}
            <div className="bg-background rounded-sm border border-border shadow-sm overflow-hidden">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">Addons</h3>
                    <p className="text-sm text-foreground/60 mb-6">Price inclusive of taxes and for all guests</p>

                    <div className="space-y-4">
                        {addons.length > 0 ? (
                            addons.map((addon, index) => (
                                <div key={index} className="border border-border rounded-sm p-4">
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
                                        <button className="text-sm font-bold text-primary hover:underline shrink-0 ml-4">
                                            APPLY
                                        </button>
                                    </div>
                                </div>
                            ))
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

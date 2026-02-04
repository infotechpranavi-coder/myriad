"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "lucide-react"

interface BookingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    roomName: string
    roomPrice: string
}

export function BookingDialog({ open, onOpenChange, roomName, roomPrice }: BookingDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        checkIn: "",
        checkOut: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission here
        console.log("Booking submitted:", { ...formData, roomName, roomPrice })
        // Show success message or redirect
        alert(`Booking request submitted for ${roomName}!\n\nGuest: ${formData.name}\nPhone: ${formData.phone}\nCheck-in: ${formData.checkIn}\nCheck-out: ${formData.checkOut}`)
        onOpenChange(false)
        // Reset form
        setFormData({ name: "", phone: "", checkIn: "", checkOut: "" })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif text-primary">Book Your Stay</DialogTitle>
                    <DialogDescription>
                        Complete the form below to reserve your {roomName} at {roomPrice} per night.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground font-medium">
                            Full Name *
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full"
                        />
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-foreground font-medium">
                            Phone Number *
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            className="w-full"
                        />
                    </div>

                    {/* Date Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="checkIn" className="text-foreground font-medium">
                                Check-in Date *
                            </Label>
                            <div className="relative">
                                <Input
                                    id="checkIn"
                                    type="date"
                                    value={formData.checkIn}
                                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="checkOut" className="text-foreground font-medium">
                                Check-out Date *
                            </Label>
                            <div className="relative">
                                <Input
                                    id="checkOut"
                                    type="date"
                                    value={formData.checkOut}
                                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                                    required
                                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
                        >
                            Confirm Booking
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

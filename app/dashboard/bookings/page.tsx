'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';

// Mock bookings data - replace with actual data from backend
const mockBookings = [
  {
    id: 1,
    type: 'Room',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 1234567890',
    checkIn: '2024-02-15',
    checkOut: '2024-02-17',
    guests: 2,
    status: 'confirmed',
  },
  {
    id: 2,
    type: 'Restaurant',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91 9876543210',
    date: '2024-02-20',
    time: '19:00',
    guests: 4,
    restaurant: 'Urban Dhaba',
    status: 'pending',
  },
];

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-muted-foreground">Manage reservations and bookings</p>
      </div>

      <div className="grid gap-4">
        {mockBookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{booking.name}</CardTitle>
                  <CardDescription>{booking.email}</CardDescription>
                </div>
                <Badge
                  variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                >
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {booking.type === 'Room' ? 'Check-in' : 'Date'}
                    </p>
                    <p className="font-medium">
                      {booking.type === 'Room' ? booking.checkIn : booking.date}
                    </p>
                  </div>
                </div>
                {booking.type === 'Room' && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Check-out</p>
                      <p className="font-medium">{booking.checkOut}</p>
                    </div>
                  </div>
                )}
                {booking.type === 'Restaurant' && booking.time && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{booking.time}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-medium">{booking.guests}</p>
                  </div>
                </div>
                {booking.restaurant && (
                  <div>
                    <p className="text-sm text-muted-foreground">Restaurant</p>
                    <p className="font-medium">{booking.restaurant}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">Phone: {booking.phone}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

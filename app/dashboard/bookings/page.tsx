'use client';

import { useState, useEffect } from 'react';
import { Booking } from '@/lib/models/booking';
import { RestaurantBooking } from '@/lib/models/restaurant-booking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BookingsPage() {
  const [roomBookings, setRoomBookings] = useState<Booking[]>([]);
  const [restaurantBookings, setRestaurantBookings] = useState<RestaurantBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingRoomBooking, setViewingRoomBooking] = useState<Booking | null>(null);
  const [viewingRestaurantBooking, setViewingRestaurantBooking] = useState<RestaurantBooking | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoomBookings();
    fetchRestaurantBookings();
  }, []);

  async function fetchRoomBookings() {
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setRoomBookings(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch room bookings',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching room bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch room bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchRestaurantBookings() {
    try {
      const response = await fetch('/api/restaurant-bookings');
      if (response.ok) {
        const data = await response.json();
        setRestaurantBookings(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch restaurant bookings',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching restaurant bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch restaurant bookings',
        variant: 'destructive',
      });
    }
  }

  const handleDeleteRoomBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Room booking deleted successfully',
        });
        fetchRoomBookings();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete booking',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting room booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete booking',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRestaurantBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      const response = await fetch(`/api/restaurant-bookings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Restaurant booking deleted successfully',
        });
        fetchRestaurantBookings();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete booking',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting restaurant booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete booking',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRoomBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        setViewingRoomBooking(updatedBooking);
        toast({
          title: 'Success',
          description: 'Booking status updated successfully',
        });
        fetchRoomBookings();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRestaurantBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/restaurant-bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        setViewingRestaurantBooking(updatedBooking);
        toast({
          title: 'Success',
          description: 'Booking status updated successfully',
        });
        fetchRestaurantBookings();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-muted-foreground">Manage room and restaurant reservations</p>
      </div>

      {/* Room Bookings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Room Bookings</CardTitle>
          <CardDescription>
            Manage all room reservations and bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {roomBookings.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No room bookings yet
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Nights</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roomBookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell className="font-medium">
                        {booking.title} {booking.firstName} {booking.lastName}
                      </TableCell>
                      <TableCell>{booking.email}</TableCell>
                      <TableCell>{booking.mobileNumber}</TableCell>
                      <TableCell>{booking.roomName}</TableCell>
                      <TableCell>
                        {booking.checkIn
                          ? new Date(booking.checkIn).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {booking.checkOut
                          ? new Date(booking.checkOut).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>{booking.nights || '-'}</TableCell>
                      <TableCell>{booking.guests || '-'}</TableCell>
                      <TableCell>
                        ₹{booking.totalAmount?.toLocaleString() || '-'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'active'
                              ? 'bg-blue-100 text-blue-700'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {booking.status || 'pending'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingRoomBooking(booking)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRoomBooking(booking._id!)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Restaurant Bookings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Bookings</CardTitle>
          <CardDescription>
            Manage all restaurant table reservations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {restaurantBookings.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No restaurant bookings yet
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restaurantBookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell className="font-medium">{booking.name}</TableCell>
                      <TableCell>{booking.email}</TableCell>
                      <TableCell>{booking.phone}</TableCell>
                      <TableCell>{booking.restaurantName}</TableCell>
                      <TableCell>
                        {booking.date
                          ? new Date(booking.date).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>{booking.time || '-'}</TableCell>
                      <TableCell>{booking.guests || '-'}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'active'
                              ? 'bg-blue-100 text-blue-700'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {booking.status || 'pending'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingRestaurantBooking(booking)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRestaurantBooking(booking._id!)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Room Booking Dialog */}
      <Dialog open={viewingRoomBooking !== null} onOpenChange={(open) => !open && setViewingRoomBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Room Booking Details</DialogTitle>
            <DialogDescription>
              View complete booking information
            </DialogDescription>
          </DialogHeader>
          {viewingRoomBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Guest Name</p>
                  <p className="font-semibold">
                    {viewingRoomBooking.title} {viewingRoomBooking.firstName} {viewingRoomBooking.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{viewingRoomBooking.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile Number</p>
                  <p className="font-semibold">{viewingRoomBooking.mobileNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Room</p>
                  <p className="font-semibold">{viewingRoomBooking.roomName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p className="font-semibold">
                    {viewingRoomBooking.checkIn
                      ? new Date(viewingRoomBooking.checkIn).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p className="font-semibold">
                    {viewingRoomBooking.checkOut
                      ? new Date(viewingRoomBooking.checkOut).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nights</p>
                  <p className="font-semibold">{viewingRoomBooking.nights || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Guests</p>
                  <p className="font-semibold">{viewingRoomBooking.guests || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold text-lg">
                    ₹{viewingRoomBooking.totalAmount?.toLocaleString() || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Status</p>
                  <Select
                    value={viewingRoomBooking.status || 'pending'}
                    onValueChange={(value) => handleUpdateRoomBookingStatus(viewingRoomBooking._id!, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          Pending
                        </span>
                      </SelectItem>
                      <SelectItem value="active">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          Active
                        </span>
                      </SelectItem>
                      <SelectItem value="confirmed">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Confirmed
                        </span>
                      </SelectItem>
                      <SelectItem value="cancelled">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Cancelled
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Booking Date</p>
                  <p className="font-semibold">
                    {viewingRoomBooking.createdAt
                      ? new Date(viewingRoomBooking.createdAt).toLocaleString()
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Restaurant Booking Dialog */}
      <Dialog open={viewingRestaurantBooking !== null} onOpenChange={(open) => !open && setViewingRestaurantBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Restaurant Booking Details</DialogTitle>
            <DialogDescription>
              View complete booking information
            </DialogDescription>
          </DialogHeader>
          {viewingRestaurantBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Guest Name</p>
                  <p className="font-semibold">{viewingRestaurantBooking.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{viewingRestaurantBooking.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-semibold">{viewingRestaurantBooking.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Restaurant</p>
                  <p className="font-semibold">{viewingRestaurantBooking.restaurantName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">
                    {viewingRestaurantBooking.date
                      ? new Date(viewingRestaurantBooking.date).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-semibold">{viewingRestaurantBooking.time || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Number of Guests</p>
                  <p className="font-semibold">{viewingRestaurantBooking.guests || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Status</p>
                  <Select
                    value={viewingRestaurantBooking.status || 'pending'}
                    onValueChange={(value) => handleUpdateRestaurantBookingStatus(viewingRestaurantBooking._id!, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          Pending
                        </span>
                      </SelectItem>
                      <SelectItem value="active">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          Active
                        </span>
                      </SelectItem>
                      <SelectItem value="confirmed">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Confirmed
                        </span>
                      </SelectItem>
                      <SelectItem value="cancelled">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Cancelled
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {viewingRestaurantBooking.specialRequests && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Special Requests</p>
                    <p className="font-semibold">{viewingRestaurantBooking.specialRequests}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Booking Date</p>
                  <p className="font-semibold">
                    {viewingRestaurantBooking.createdAt
                      ? new Date(viewingRestaurantBooking.createdAt).toLocaleString()
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

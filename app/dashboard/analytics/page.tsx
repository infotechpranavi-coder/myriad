'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Booking } from '@/lib/models/booking';
import { RestaurantBooking } from '@/lib/models/restaurant-booking';
import { Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
  const [roomBookings, setRoomBookings] = useState<Booking[]>([]);
  const [restaurantBookings, setRestaurantBookings] = useState<RestaurantBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [roomBookingsRes, restaurantBookingsRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/restaurant-bookings'),
      ]);

      if (roomBookingsRes.ok) {
        const roomData = await roomBookingsRes.json();
        setRoomBookings(roomData);
      }

      if (restaurantBookingsRes.ok) {
        const restaurantData = await restaurantBookingsRes.json();
        setRestaurantBookings(restaurantData);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Calculate statistics
  const totalBookings = roomBookings.length + restaurantBookings.length;
  const confirmedBookings = [
    ...roomBookings.filter((b) => b.status === 'confirmed'),
    ...restaurantBookings.filter((b) => b.status === 'confirmed'),
  ].length;
  const pendingBookings = [
    ...roomBookings.filter((b) => b.status === 'pending'),
    ...restaurantBookings.filter((b) => b.status === 'pending'),
  ].length;

  // Calculate revenue from room bookings
  const totalRevenue = roomBookings
    .filter((b) => b.status === 'confirmed' || b.status === 'active')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Calculate average booking value
  const confirmedRoomBookings = roomBookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'active'
  );
  const averageBookingValue =
    confirmedRoomBookings.length > 0
      ? totalRevenue / confirmedRoomBookings.length
      : 0;

  // Get bookings from this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthRoomBookings = roomBookings.filter((b) => {
    if (!b.createdAt) return false;
    const bookingDate = new Date(b.createdAt);
    return bookingDate >= startOfMonth;
  });
  const thisMonthRestaurantBookings = restaurantBookings.filter((b) => {
    if (!b.createdAt) return false;
    const bookingDate = new Date(b.createdAt);
    return bookingDate >= startOfMonth;
  });
  const thisMonthBookings = thisMonthRoomBookings.length + thisMonthRestaurantBookings.length;
  const thisMonthRevenue = thisMonthRoomBookings
    .filter((b) => b.status === 'confirmed' || b.status === 'active')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Get bookings from last month for comparison
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const lastMonthRoomBookings = roomBookings.filter((b) => {
    if (!b.createdAt) return false;
    const bookingDate = new Date(b.createdAt);
    return bookingDate >= startOfLastMonth && bookingDate <= endOfLastMonth;
  });
  const lastMonthRestaurantBookings = restaurantBookings.filter((b) => {
    if (!b.createdAt) return false;
    const bookingDate = new Date(b.createdAt);
    return bookingDate >= startOfLastMonth && bookingDate <= endOfLastMonth;
  });
  const lastMonthBookings = lastMonthRoomBookings.length + lastMonthRestaurantBookings.length;
  const lastMonthRevenue = lastMonthRoomBookings
    .filter((b) => b.status === 'confirmed' || b.status === 'active')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Calculate percentage changes
  const bookingsChange =
    lastMonthBookings > 0
      ? ((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100
      : 0;
  const revenueChange =
    lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;
  const avgBookingValueLastMonth =
    lastMonthRoomBookings.length > 0
      ? lastMonthRevenue / lastMonthRoomBookings.length
      : 0;
  const avgBookingValueChange =
    avgBookingValueLastMonth > 0
      ? ((averageBookingValue - avgBookingValueLastMonth) / avgBookingValueLastMonth) * 100
      : 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">View website statistics and performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Bookings</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalBookings}</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confirmed:</span>
                <span className="font-semibold">{confirmedBookings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending:</span>
                <span className="font-semibold">{pendingBookings}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings This Month</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{thisMonthBookings}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {bookingsChange >= 0 ? '+' : ''}
              {bookingsChange.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(thisMonthRevenue)}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {revenueChange >= 0 ? '+' : ''}
              {revenueChange.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Booking Value</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(averageBookingValue)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {avgBookingValueChange >= 0 ? '+' : ''}
              {avgBookingValueChange.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Room Bookings</CardTitle>
            <CardDescription>Statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-semibold text-lg">{roomBookings.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">This Month:</span>
                <span className="font-semibold">{thisMonthRoomBookings.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="font-semibold">{formatCurrency(thisMonthRevenue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Restaurant Bookings</CardTitle>
            <CardDescription>Statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-semibold text-lg">{restaurantBookings.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">This Month:</span>
                <span className="font-semibold">{thisMonthRestaurantBookings.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pending:</span>
                <span className="font-semibold">
                  {restaurantBookings.filter((b) => b.status === 'pending').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

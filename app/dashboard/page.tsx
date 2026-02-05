'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hotel, UtensilsCrossed, Calendar, TrendingUp, Loader2 } from 'lucide-react';
import { Booking } from '@/lib/models/booking';
import { RestaurantBooking } from '@/lib/models/restaurant-booking';
import { Room } from '@/lib/models/room';
import { Restaurant } from '@/lib/models/restaurant';

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [roomBookings, setRoomBookings] = useState<Booking[]>([]);
  const [restaurantBookings, setRestaurantBookings] = useState<RestaurantBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [roomsRes, restaurantsRes, roomBookingsRes, restaurantBookingsRes] =
        await Promise.all([
          fetch('/api/rooms'),
          fetch('/api/restaurants'),
          fetch('/api/bookings'),
          fetch('/api/restaurant-bookings'),
        ]);

      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        setRooms(roomsData);
      }

      if (restaurantsRes.ok) {
        const restaurantsData = await restaurantsRes.json();
        setRestaurants(restaurantsData);
      }

      if (roomBookingsRes.ok) {
        const roomBookingsData = await roomBookingsRes.json();
        setRoomBookings(roomBookingsData);
      }

      if (restaurantBookingsRes.ok) {
        const restaurantBookingsData = await restaurantBookingsRes.json();
        setRestaurantBookings(restaurantBookingsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Calculate statistics
  const totalBookings = roomBookings.length + restaurantBookings.length;
  const activeBookings = [
    ...roomBookings.filter((b) => b.status === 'active' || b.status === 'confirmed'),
    ...restaurantBookings.filter((b) => b.status === 'active' || b.status === 'confirmed'),
  ].length;

  // Calculate revenue from confirmed/active room bookings
  const totalRevenue = roomBookings
    .filter((b) => b.status === 'confirmed' || b.status === 'active')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

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
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Myriad Hotel Admin Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rooms.length}</div>
            <p className="text-xs text-muted-foreground">
              {rooms.length > 0 ? `${rooms.length} room${rooms.length !== 1 ? 's' : ''} available` : 'No rooms added'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restaurants</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurants.length}</div>
            <p className="text-xs text-muted-foreground">
              {restaurants.length > 0 ? 'All operational' : 'No restaurants added'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {activeBookings} active reservations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">From confirmed bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your hotel content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/dashboard/rooms"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-2">Manage Rooms</h3>
              <p className="text-sm text-muted-foreground">
                Add, edit, or remove room types and pricing
              </p>
            </a>
            <a
              href="/dashboard/restaurants"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-2">Manage Restaurants</h3>
              <p className="text-sm text-muted-foreground">
                Update restaurant details and menus
              </p>
            </a>
            <a
              href="/dashboard/bookings"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-2">View Bookings</h3>
              <p className="text-sm text-muted-foreground">
                Check reservations and manage schedules
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

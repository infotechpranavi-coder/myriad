'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">View website statistics and performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12,345</div>
            <p className="text-sm text-muted-foreground mt-2">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">156</div>
            <p className="text-sm text-muted-foreground mt-2">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹2.4L</div>
            <p className="text-sm text-muted-foreground mt-2">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Booking Value</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹15,384</div>
            <p className="text-sm text-muted-foreground mt-2">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Popular Pages</CardTitle>
          <CardDescription>Most visited pages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Home</span>
              <span className="font-semibold">4,523 views</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Rooms</span>
              <span className="font-semibold">3,245 views</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Restaurants</span>
              <span className="font-semibold">2,187 views</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Banquet Hall</span>
              <span className="font-semibold">1,456 views</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

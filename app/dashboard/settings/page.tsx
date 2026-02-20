'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage website settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hotel Information</CardTitle>
          <CardDescription>Update hotel details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Hotel Name</label>
            <Input defaultValue="The Myriad Hotel" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Address</label>
            <Textarea defaultValue="Thane, Mumbai" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Phone</label>
              <Input defaultValue="+91 1234567890" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input type="email" defaultValue="Support@myriad.net.in" />
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Website Settings</CardTitle>
          <CardDescription>Configure website preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Site Title</label>
            <Input defaultValue="The Myriad Hotel | Luxury Accommodation" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Meta Description</label>
            <Textarea
              defaultValue="Experience luxury at The Myriad Hotel. Discover elegant rooms, fine dining restaurants, and premium event spaces."
              rows={3}
            />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}

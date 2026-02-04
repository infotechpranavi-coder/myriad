'use client';

import { useState } from 'react';
import { restaurants } from '@/lib/restaurant-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export default function RestaurantsManagementPage() {
  const [restaurantList, setRestaurantList] = useState(restaurants);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    description: '',
    image: '',
    slug: '',
    openingHours: '',
    capacity: '',
    address: '',
    highlights: '',
  });

  const handleEdit = (restaurant: any) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      description: restaurant.description,
      image: restaurant.image,
      slug: restaurant.slug,
      openingHours: restaurant.openingHours,
      capacity: restaurant.capacity,
      address: restaurant.address,
      highlights: restaurant.highlights.join(', '),
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingRestaurant(null);
    setFormData({
      name: '',
      cuisine: '',
      description: '',
      image: '',
      slug: '',
      openingHours: '',
      capacity: '',
      address: '',
      highlights: '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const restaurantData = {
      id: editingRestaurant?.id || restaurantList.length + 1,
      name: formData.name,
      cuisine: formData.cuisine,
      description: formData.description,
      image: formData.image,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      openingHours: formData.openingHours,
      capacity: formData.capacity,
      address: formData.address,
      highlights: formData.highlights.split(',').map((h) => h.trim()),
      menu: editingRestaurant?.menu || {},
    };

    if (editingRestaurant) {
      setRestaurantList(
        restaurantList.map((r) => (r.id === editingRestaurant.id ? restaurantData : r))
      );
    } else {
      setRestaurantList([...restaurantList, restaurantData]);
    }

    setIsDialogOpen(false);
    alert('Restaurant saved! (Note: Changes are temporary - implement backend to persist)');
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      setRestaurantList(restaurantList.filter((r) => r.id !== id));
      alert('Restaurant deleted! (Note: Changes are temporary - implement backend to persist)');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Restaurants</h1>
          <p className="text-muted-foreground">Add, edit, or remove restaurants</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
              </DialogTitle>
              <DialogDescription>
                {editingRestaurant
                  ? 'Update restaurant details'
                  : 'Create a new restaurant'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Restaurant Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Urban Dhaba"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Cuisine Type</label>
                  <Input
                    value={formData.cuisine}
                    onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                    placeholder="Contemporary Indian"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="urban-dhaba"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Restaurant description..."
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Image URL</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Opening Hours</label>
                  <Input
                    value={formData.openingHours}
                    onChange={(e) =>
                      setFormData({ ...formData, openingHours: e.target.value })
                    }
                    placeholder="11:30 AM - 11:00 PM"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Capacity</label>
                  <Input
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="Up to 60 guests"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ground Floor, The Myriad Hotel"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Highlights (comma-separated)
                </label>
                <Input
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Award-winning chef, Tandoori specialties"
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingRestaurant ? 'Update Restaurant' : 'Add Restaurant'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {restaurantList.map((restaurant) => (
          <Card key={restaurant.id}>
            <CardHeader>
              <CardTitle>{restaurant.name}</CardTitle>
              <CardDescription>{restaurant.cuisine}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Hours:</span>
                  <span className="text-sm">{restaurant.openingHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Capacity:</span>
                  <span className="text-sm">{restaurant.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Location:</span>
                  <span className="text-sm">{restaurant.address}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(restaurant)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDelete(restaurant.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Restaurant } from '@/lib/models/restaurant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Loader2, X, Image as ImageIcon, Eye } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { RestaurantBooking } from '@/lib/models/restaurant-booking';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function RestaurantsManagementPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    description: '',
    about: '',
    image: '',
    slug: '',
    openingHours: '',
    capacity: '',
    address: '',
    location: '',
    highlights: '',
    menu: '',
    menuHighlights: '',
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [bookings, setBookings] = useState<RestaurantBooking[]>([]);
  const [viewingBooking, setViewingBooking] = useState<RestaurantBooking | null>(null);
  const [menuItems, setMenuItems] = useState<Array<{ name: string; price: string }>>([]);
  const [mainMenuItems, setMainMenuItems] = useState<Array<{ name: string; price: string }>>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    fetchRestaurants();
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const response = await fetch('/api/restaurant-bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching restaurant bookings:', error);
    }
  }

  async function fetchRestaurants() {
    try {
      setLoading(true);
      const response = await fetch('/api/restaurants');
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch restaurants',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch restaurants',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      description: restaurant.description,
      about: restaurant.about || '',
      image: restaurant.image,
      slug: restaurant.slug,
      openingHours: restaurant.openingHours,
      capacity: restaurant.capacity,
      address: restaurant.address,
      location: restaurant.location || '',
      highlights: restaurant.highlights.join(', '),
      menu: '', // No longer used
      menuHighlights: '', // No longer used
    });
    setImageUrls(restaurant.gallery || []);
    // Convert menu to array format
    if (restaurant.menu) {
      const items: Array<{ name: string; price: string }> = [];
      Object.values(restaurant.menu).forEach((categoryItems) => {
        categoryItems.forEach((item) => {
          items.push({ name: item.name || '', price: item.price || '' });
        });
      });
      setMainMenuItems(items);
    } else {
      setMainMenuItems([]);
    }
    // Convert menuHighlights to array format
    if (restaurant.menuHighlights) {
      const items: Array<{ name: string; price: string }> = [];
      Object.values(restaurant.menuHighlights).forEach((categoryItems) => {
        categoryItems.forEach((item) => {
          items.push({ name: item.name || '', price: item.price || '' });
        });
      });
      setMenuItems(items);
    } else {
      setMenuItems([]);
    }
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingRestaurant(null);
    setFormData({
      name: '',
      cuisine: '',
      description: '',
      about: '',
      image: '',
      slug: '',
      openingHours: '',
      capacity: '',
      address: '',
      location: '',
      highlights: '',
      menu: '',
      menuHighlights: '',
    });
    setImageUrls([]);
    setNewImageUrl('');
    setMenuItems([]);
    setMainMenuItems([]);
    setIsDialogOpen(true);
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select a valid image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size must be less than 10MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingImage(true);
    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      setFormData({ ...formData, image: data.url });
      setUploadingImage(false);
      toast({
        title: 'Success',
        description: 'Image uploaded to Cloudinary successfully',
      });
    } catch (error) {
      setUploadingImage(false);
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive',
      });
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    const newImages: string[] = [];
    const uploadPromises: Promise<void>[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          continue;
        }

        // Upload to Cloudinary
        const uploadPromise = (async () => {
          try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Upload failed');
            }

            const data = await response.json();
            newImages.push(data.url);
          } catch (error) {
            console.error(`Failed to upload image ${i + 1}:`, error);
          }
        })();

        uploadPromises.push(uploadPromise);
      }

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);

      if (newImages.length > 0) {
        setImageUrls([...imageUrls, ...newImages]);
        toast({
          title: 'Success',
          description: `${newImages.length} image(s) uploaded to Cloudinary successfully`,
        });
      } else {
        toast({
          title: 'Warning',
          description: 'No images were uploaded. Please check file types and sizes.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload some images',
        variant: 'destructive',
      });
    } finally {
      setUploadingGallery(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleRemoveImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleAddMenuItem = () => {
    setMenuItems([...menuItems, { name: '', price: '' }]);
  };

  const handleRemoveMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const handleMenuItemChange = (index: number, field: 'name' | 'price', value: string) => {
    const updated = [...menuItems];
    updated[index] = { ...updated[index], [field]: value };
    setMenuItems(updated);
  };

  const handleAddMainMenuItem = () => {
    setMainMenuItems([...mainMenuItems, { name: '', price: '' }]);
  };

  const handleRemoveMainMenuItem = (index: number) => {
    setMainMenuItems(mainMenuItems.filter((_, i) => i !== index));
  };

  const handleMainMenuItemChange = (index: number, field: 'name' | 'price', value: string) => {
    const updated = [...mainMenuItems];
    updated[index] = { ...updated[index], [field]: value };
    setMainMenuItems(updated);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Convert main menu items array to menu format
      let menuData = {};
      if (mainMenuItems.length > 0) {
        menuData = {
          main: mainMenuItems.map((item) => ({
            name: item.name,
            price: item.price,
            description: '', // Empty description as user only provides name and price
          })),
        };
      }

      // Convert menu items array to menuHighlights format
      let menuHighlightsData = undefined;
      if (menuItems.length > 0) {
        menuHighlightsData = {
          highlights: menuItems.map((item) => ({
            name: item.name,
            price: item.price,
            description: '', // Empty description as user only provides name and price
          })),
        };
      }

      const restaurantData = {
        id: editingRestaurant?.id || restaurants.length + 1,
        name: formData.name,
        cuisine: formData.cuisine,
        description: formData.description,
        about: formData.about || undefined,
        image: formData.image,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        openingHours: formData.openingHours,
        capacity: formData.capacity,
        address: formData.address,
        location: formData.location || undefined,
        highlights: formData.highlights.split(',').map((h) => h.trim()).filter(Boolean),
        menu: menuData,
        menuHighlights: menuHighlightsData,
        gallery: imageUrls.filter(Boolean),
      };

      const url = editingRestaurant 
        ? `/api/restaurants/${editingRestaurant.id}` 
        : '/api/restaurants';
      const method = editingRestaurant ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurantData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: editingRestaurant 
            ? 'Restaurant updated successfully' 
            : 'Restaurant created successfully',
        });
        setIsDialogOpen(false);
        fetchRestaurants();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to save restaurant',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving restaurant:', error);
      toast({
        title: 'Error',
        description: 'Failed to save restaurant',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
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
          description: 'Booking deleted successfully',
        });
        fetchBookings();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete booking',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete booking',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
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
        setViewingBooking(updatedBooking);
        toast({
          title: 'Success',
          description: 'Booking status updated successfully',
        });
        fetchBookings();
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this restaurant?')) {
      return;
    }

    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Restaurant deleted successfully',
        });
        fetchRestaurants();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete restaurant',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete restaurant',
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Restaurants</h1>
          <p className="text-muted-foreground">Add, edit, or remove restaurants</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              // Reset gallery when dialog closes
              setImageUrls([]);
              setNewImageUrl('');
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
            <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
              <DialogTitle>
                {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
              </DialogTitle>
              <DialogDescription>
                {editingRestaurant
                  ? 'Update restaurant details'
                  : 'Create a new restaurant'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 px-6 pb-6 overflow-y-auto flex-1 min-h-0">
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
                <label className="text-sm font-medium mb-2 block">About</label>
                <Textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  placeholder="Detailed information about the restaurant..."
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Main Image</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    disabled={uploadingImage}
                    className="cursor-pointer h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  />
                  {uploadingImage && (
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Uploading image...
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Or enter image URL:
                  </div>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or upload above"
                  />
                  {formData.image && (
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <div className="relative aspect-video">
                        <Image
                          src={formData.image}
                          alt="Main image preview"
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
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
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Floor 2, Wing A"
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
              {/* Gallery Section */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Gallery Images
                </label>
                <div className="space-y-3">
                  {/* Upload Images */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImageUpload}
                      disabled={uploadingGallery}
                      className="cursor-pointer h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    />
                    {uploadingGallery && (
                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Uploading images...
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Select multiple images to upload (max 5MB each)
                    </p>
                  </div>
                  
                  {/* Add Image URL Input */}
                  <div className="text-xs text-muted-foreground">
                    Or add image URL:
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                      placeholder="Enter image URL (e.g., /restaurants/image.png or https://...)"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddImageUrl}
                      variant="outline"
                      disabled={!newImageUrl.trim()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  {/* Image Gallery Preview */}
                  {imageUrls.length > 0 && (
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-3">
                        {imageUrls.length} image{imageUrls.length !== 1 ? 's' : ''} added
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {imageUrls.map((url, index) => (
                          <div
                            key={index}
                            className="relative group border rounded-lg overflow-hidden bg-background"
                          >
                            <div className="aspect-video relative">
                              {url.startsWith('http') || url.startsWith('/') ? (
                                <Image
                                  src={url}
                                  alt={`Restaurant image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="h-6 w-6 p-0"
                                onClick={() => handleRemoveImageUrl(index)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="p-2 bg-background/90 backdrop-blur-sm">
                              <p className="text-xs text-muted-foreground truncate" title={url}>
                                {url.length > 30 ? `${url.substring(0, 30)}...` : url}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {imageUrls.length === 0 && (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/20">
                      <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No images added yet. Add image URLs above to create a gallery.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* Menu - Dish Name and Price */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Menu</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddMainMenuItem}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Dish
                  </Button>
                </div>
                {mainMenuItems.length === 0 ? (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/20">
                    <p className="text-sm text-muted-foreground">
                      No dishes added yet. Click "Add Dish" to add menu items.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mainMenuItems.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/30">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">
                              Dish Name
                            </label>
                            <Input
                              value={item.name || ''}
                              onChange={(e) =>
                                handleMainMenuItemChange(index, 'name', e.target.value)
                              }
                              placeholder="e.g., Pasta Carbonara"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">
                              Price
                            </label>
                            <Input
                              value={item.price || ''}
                              onChange={(e) =>
                                handleMainMenuItemChange(index, 'price', e.target.value)
                              }
                              placeholder="e.g., ₹450"
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMainMenuItem(index)}
                          className="mt-6"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Menu Highlights - Dish Name and Price */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Menu Highlights</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddMenuItem}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Dish
                  </Button>
                </div>
                {menuItems.length === 0 ? (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/20">
                    <p className="text-sm text-muted-foreground">
                      No dishes added yet. Click "Add Dish" to add menu items.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {menuItems.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/30">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">
                              Dish Name
                            </label>
                            <Input
                              value={item.name || ''}
                              onChange={(e) =>
                                handleMenuItemChange(index, 'name', e.target.value)
                              }
                              placeholder="e.g., Continental Breakfast"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">
                              Price
                            </label>
                            <Input
                              value={item.price || ''}
                              onChange={(e) =>
                                handleMenuItemChange(index, 'price', e.target.value)
                              }
                              placeholder="e.g., ₹500"
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMenuItem(index)}
                          className="mt-6"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={handleSave} className="w-full" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingRestaurant ? 'Update Restaurant' : 'Add Restaurant'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant) => (
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

      {/* Bookings Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Table Bookings</h2>
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No bookings yet
            </CardContent>
          </Card>
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
                {bookings.map((booking) => (
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
                          onClick={() => setViewingBooking(booking)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteBooking(booking._id!)}
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
      </div>

      {/* View Booking Dialog */}
      <Dialog open={viewingBooking !== null} onOpenChange={(open) => !open && setViewingBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              View complete booking information
            </DialogDescription>
          </DialogHeader>
          {viewingBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Guest Name</p>
                  <p className="font-semibold">{viewingBooking.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{viewingBooking.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-semibold">{viewingBooking.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Restaurant</p>
                  <p className="font-semibold">{viewingBooking.restaurantName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">
                    {viewingBooking.date
                      ? new Date(viewingBooking.date).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-semibold">{viewingBooking.time || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Number of Guests</p>
                  <p className="font-semibold">{viewingBooking.guests || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Status</p>
                  <Select
                    value={viewingBooking.status || 'pending'}
                    onValueChange={(value) => handleUpdateStatus(viewingBooking._id!, value)}
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
                {viewingBooking.specialRequests && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Special Requests</p>
                    <p className="font-semibold">{viewingBooking.specialRequests}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Booking Date</p>
                  <p className="font-semibold">
                    {viewingBooking.createdAt
                      ? new Date(viewingBooking.createdAt).toLocaleString()
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

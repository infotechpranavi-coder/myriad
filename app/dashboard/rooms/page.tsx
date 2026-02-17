'use client';

import { useState, useEffect } from 'react';
import { Room } from '@/lib/models/room';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Loader2, X, Image as ImageIcon, Eye, Save } from 'lucide-react';
import Image from 'next/image';
import { Booking } from '@/lib/models/booking';
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
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function RoomsManagementPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    room: '',
    about: '',
    amenities: '',
    basePrice: '',
    taxes: '',
    serviceFees: '',
    addons: '',
    goibiboOffers: '',
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [addons, setAddons] = useState<Array<{ name: string; price: string }>>([]);
  const [goibiboOffers, setGoibiboOffers] = useState<Array<{ title: string; description: string }>>([]);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  async function fetchRooms() {
    try {
      setLoading(true);
      const response = await fetch('/api/rooms');
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch rooms',
          variant: 'destructive',
  });
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch rooms',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchBookings() {
    try {
      setBookingsLoading(true);
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch bookings',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch bookings',
        variant: 'destructive',
      });
    } finally {
      setBookingsLoading(false);
    }
  }

  const handleDeleteBooking = async (id: string) => {
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
      const response = await fetch(`/api/bookings/${bookingId}`, {
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

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      title: room.title || room.name || '',
      checkIn: room.checkIn || '',
      checkOut: room.checkOut || '',
      guests: room.guests || room.capacity || '',
      room: room.room || '',
      about: room.about || room.description || '',
      amenities: room.amenities.join(', '),
      basePrice: room.priceSummary?.basePrice?.toString() || room.price?.toString() || '',
      taxes: room.priceSummary?.taxes?.toString() || '',
      serviceFees: room.priceSummary?.serviceFees?.toString() || '',
      addons: '', // No longer used
      goibiboOffers: '', // No longer used
    });
    setImageUrls(room.gallery || room.images || []);
    // Convert addons to array format
    if (room.addons && room.addons.length > 0) {
      setAddons(room.addons.map((addon) => ({
        name: addon.name,
        price: addon.price.toString(),
      })));
    } else {
      setAddons([]);
    }
    // Convert goibiboOffers to array format
    if (room.goibiboOffers && room.goibiboOffers.length > 0) {
      setGoibiboOffers(room.goibiboOffers.map((offer) => ({
        title: offer.title,
        description: offer.description,
      })));
    } else {
      setGoibiboOffers([]);
    }
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingRoom(null);
    setFormData({
      title: '',
      checkIn: '',
      checkOut: '',
      guests: '',
      room: '',
      about: '',
      amenities: '',
      basePrice: '',
      taxes: '',
      serviceFees: '',
      addons: '',
      goibiboOffers: '',
    });
    setImageUrls([]);
    setNewImageUrl('');
    setAddons([]);
    setGoibiboOffers([]);
    setIsDialogOpen(true);
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleAddAddon = () => {
    setAddons([...addons, { name: '', price: '' }]);
  };

  const handleRemoveAddon = (index: number) => {
    setAddons(addons.filter((_, i) => i !== index));
  };

  const handleAddonChange = (index: number, field: 'name' | 'price', value: string) => {
    const updated = [...addons];
    updated[index] = { ...updated[index], [field]: value };
    setAddons(updated);
  };

  const handleAddOffer = () => {
    setGoibiboOffers([...goibiboOffers, { title: '', description: '' }]);
  };

  const handleRemoveOffer = (index: number) => {
    setGoibiboOffers(goibiboOffers.filter((_, i) => i !== index));
  };

  const handleOfferChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...goibiboOffers];
    updated[index] = { ...updated[index], [field]: value };
    setGoibiboOffers(updated);
  };


  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGalleryImage(true);
    
    try {
      const uploadPromises: Promise<string>[] = [];
      
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
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);

            const response = await fetch('/api/upload', {
              method: 'POST',
              body: uploadFormData,
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Upload failed');
            }

            const data = await response.json();
            return data.url;
          } catch (error) {
            console.error(`Failed to upload image ${i + 1}:`, error);
            throw error;
          }
        })();

        uploadPromises.push(uploadPromise);
      }

      const uploadedUrls = await Promise.all(uploadPromises);
      
      if (uploadedUrls.length > 0) {
        setImageUrls([...imageUrls, ...uploadedUrls]);
        toast({
          title: 'Success',
          description: `${uploadedUrls.length} image(s) uploaded successfully`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setUploadingGalleryImage(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Convert addons array to proper format
      let addonsData = undefined;
      if (addons.length > 0) {
        addonsData = addons
          .filter((addon) => addon.name.trim() && addon.price.trim())
          .map((addon) => ({
            name: addon.name.trim(),
            price: parseFloat(addon.price) || 0,
            description: '',
          }));
        if (addonsData.length === 0) {
          addonsData = undefined;
        }
      }

      // Convert goibiboOffers array to proper format
      let goibiboOffersData = undefined;
      if (goibiboOffers.length > 0) {
        goibiboOffersData = goibiboOffers
          .filter((offer) => offer.title.trim() && offer.description.trim())
          .map((offer) => ({
            title: offer.title.trim(),
            description: offer.description.trim(),
            discount: undefined,
          }));
        if (goibiboOffersData.length === 0) {
          goibiboOffersData = undefined;
        }
      }

      const basePrice = formData.basePrice ? parseFloat(formData.basePrice) : 0;
      const taxes = formData.taxes ? parseFloat(formData.taxes) : 0;
      const serviceFees = formData.serviceFees ? parseFloat(formData.serviceFees) : 0;
      const totalAmount = basePrice + taxes + serviceFees;

    const roomData = {
      id: editingRoom?.id || (rooms.length + 1).toString(),
        title: formData.title,
        checkIn: formData.checkIn || undefined,
        checkOut: formData.checkOut || undefined,
        guests: formData.guests || undefined,
        room: formData.room || undefined,
        about: formData.about || undefined,
        amenities: formData.amenities.split(',').map((a) => a.trim()).filter(Boolean),
        gallery: imageUrls.filter(Boolean),
        priceSummary: {
          basePrice,
          taxes: taxes || undefined,
          serviceFees: serviceFees || undefined,
          totalAmount,
        },
        addons: addonsData,
        goibiboOffers: goibiboOffersData,
        // Legacy fields for backward compatibility
        name: formData.title,
        description: formData.about,
        price: basePrice,
        capacity: formData.guests,
    };

      const url = editingRoom ? `/api/rooms/${editingRoom.id}` : '/api/rooms';
      const method = editingRoom ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: editingRoom ? 'Room updated successfully' : 'Room created successfully',
        });
        setIsDialogOpen(false);
        fetchRooms();
    } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to save room',
          variant: 'destructive',
        });
    }
    } catch (error) {
      console.error('Error saving room:', error);
      toast({
        title: 'Error',
        description: 'Failed to save room',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      const response = await fetch(`/api/rooms/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Room deleted successfully',
        });
        fetchRooms();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete room',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete room',
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
          <h1 className="text-3xl font-bold">Manage Rooms</h1>
          <p className="text-muted-foreground">Add, edit, or remove room types</p>
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
          modal={true}
        >
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 [&>button]:hidden"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <div className="px-6 pt-6 pb-4 border-b flex-shrink-0 relative">
              <DialogHeader>
                <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
                <DialogDescription>
                  {editingRoom ? 'Update room details' : 'Create a new room type'}
                </DialogDescription>
              </DialogHeader>
              <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>
            <div 
              className="space-y-4 px-6 pb-6 overflow-y-auto flex-1 min-h-0 overscroll-contain" 
              style={{ 
                maxHeight: 'calc(90vh - 140px)',
                WebkitOverflowScrolling: 'touch'
              }}
              onWheel={(e) => {
                e.stopPropagation();
              }}
              onTouchMove={(e) => {
                e.stopPropagation();
              }}
            >
              {/* Title */}
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Deluxe Room"
                />
              </div>

              {/* Check-in & Check-out */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Check-in</label>
                  <Input
                    type="time"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    placeholder="2:00 PM"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Check-out</label>
                  <Input
                    type="time"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    placeholder="11:00 AM"
                  />
                </div>
              </div>

              {/* Guests & Room */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Guests</label>
                  <Input
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    placeholder="2 Guests"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Room</label>
                  <Input
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="Room Type/Details"
                  />
                </div>
              </div>

              {/* About the Room */}
              <div>
                <label className="text-sm font-medium mb-2 block">About the Room</label>
                <Textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  placeholder="Detailed information about the room..."
                  rows={4}
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Amenities (comma-separated)
                </label>
                <Input
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="Double Bed, WiFi, TV, AC"
                />
              </div>

              {/* Gallery Section */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Gallery
                </label>
                <div className="space-y-3">
                  {/* Upload Images Button */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImageUpload}
                      disabled={uploadingGalleryImage}
                      className="cursor-pointer h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    />
                    {uploadingGalleryImage && (
                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Uploading images...
                      </p>
                    )}
                  </div>

                  {/* Add Image URL Input */}
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
                      placeholder="Or enter image URL (e.g., /rooms/deluxe.png or https://...)"
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
                                url.startsWith('/') ? (
                                  <Image
                                    src={url}
                                    alt={`Room image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={url}
                                    alt={`Room image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                )
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

              {/* Price Summary */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3">Price Summary</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price (₹)</label>
                    <Input
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      placeholder="4230"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Taxes & Service Fees (₹)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        value={formData.taxes}
                        onChange={(e) => setFormData({ ...formData, taxes: e.target.value })}
                        placeholder="Taxes"
                      />
                      <Input
                        type="number"
                        value={formData.serviceFees}
                        onChange={(e) => setFormData({ ...formData, serviceFees: e.target.value })}
                        placeholder="Service Fees"
                      />
                    </div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Amount to be paid:</span>
                      <span className="text-lg font-bold">
                        ₹{(
                          (formData.basePrice ? parseFloat(formData.basePrice) : 0) +
                          (formData.taxes ? parseFloat(formData.taxes) : 0) +
                          (formData.serviceFees ? parseFloat(formData.serviceFees) : 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Addons */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Addons</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddAddon}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Addon
                  </Button>
                </div>
                {addons.length === 0 ? (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/20">
                    <p className="text-sm text-muted-foreground">
                      No addons added yet. Click "Add Addon" to add items.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addons.map((addon, index) => (
                      <div key={index} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/30">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">
                              Addon Name
                            </label>
                            <Input
                              value={addon.name}
                              onChange={(e) =>
                                handleAddonChange(index, 'name', e.target.value)
                              }
                              placeholder="e.g., Breakfast"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">
                              Price
                            </label>
                            <Input
                              type="number"
                              value={addon.price}
                              onChange={(e) =>
                                handleAddonChange(index, 'price', e.target.value)
                              }
                              placeholder="e.g., 500"
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAddon(index)}
                          className="mt-6"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Goibibo Offers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Goibibo Offers</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddOffer}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Offer
                  </Button>
                </div>
                {goibiboOffers.length === 0 ? (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/20">
                    <p className="text-sm text-muted-foreground">
                      No offers added yet. Click "Add Offer" to add items.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {goibiboOffers.map((offer, index) => (
                      <div key={index} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/30">
                        <div className="flex-1 space-y-2">
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">
                              Offer Title
                            </label>
                            <Input
                              value={offer.title}
                              onChange={(e) =>
                                handleOfferChange(index, 'title', e.target.value)
                              }
                              placeholder="e.g., Early Bird Discount"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">
                              Description
                </label>
                <Input
                              value={offer.description}
                              onChange={(e) =>
                                handleOfferChange(index, 'description', e.target.value)
                              }
                              placeholder="e.g., Book 30 days in advance"
                              className="text-sm"
                />
              </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveOffer(index)}
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
                  editingRoom ? 'Update Room' : 'Add Room'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bookings Table */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Bookings</h2>
            <p className="text-muted-foreground">View and manage guest bookings</p>
          </div>
        </div>

        {bookingsLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-card border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No bookings found</p>
          </div>
        ) : (
          <div className="bg-card border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Nights</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>
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
      <Dialog open={viewingBooking !== null} onOpenChange={(open) => !open && setViewingBooking(null)} modal={true}>
        <DialogContent 
          className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="px-6 pt-6 pb-4 border-b flex-shrink-0 relative">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                View complete booking information
              </DialogDescription>
            </DialogHeader>
            <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
          <div 
            className="flex-1 overflow-y-auto overscroll-contain px-6 py-4" 
            style={{ 
              maxHeight: 'calc(90vh - 140px)',
              WebkitOverflowScrolling: 'touch'
            }}
            onWheel={(e) => {
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
            }}
          >
          {viewingBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Guest Name</p>
                  <p className="font-semibold">
                    {viewingBooking.title} {viewingBooking.firstName} {viewingBooking.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{viewingBooking.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile Number</p>
                  <p className="font-semibold">{viewingBooking.mobileNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Room</p>
                  <p className="font-semibold">{viewingBooking.roomName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p className="font-semibold">
                    {viewingBooking.checkIn
                      ? new Date(viewingBooking.checkIn).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p className="font-semibold">
                    {viewingBooking.checkOut
                      ? new Date(viewingBooking.checkOut).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nights</p>
                  <p className="font-semibold">{viewingBooking.nights || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Guests</p>
                  <p className="font-semibold">{viewingBooking.guests || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold text-lg">
                    ₹{viewingBooking.totalAmount?.toLocaleString() || '-'}
                  </p>
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
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <CardTitle>{room.name}</CardTitle>
              <CardDescription>{room.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <span className="font-semibold">₹{room.price}</span>
                </div>
                {room.oldPrice && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Old Price:</span>
                    <span className="text-sm line-through">₹{room.oldPrice}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Capacity:</span>
                  <span className="text-sm">{room.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Size:</span>
                  <span className="text-sm">{room.size}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(room)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDelete(room.id)}
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

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon, Upload, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BanquetGalleryImage } from '@/lib/models/banquet-gallery';
import Image from 'next/image';

export default function BanquetGalleryManagementPage() {
  const [images, setImages] = useState<BanquetGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<BanquetGalleryImage | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    isActive: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isDialogOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isDialogOpen]);

  async function fetchImages() {
    try {
      setLoading(true);
      const response = await fetch('/api/banquet-gallery');
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch gallery images',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch gallery images',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAddClick = () => {
    setEditingImage(null);
    setFormData({
      image: '',
      title: '',
      description: '',
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEditClick = (image: BanquetGalleryImage) => {
    setEditingImage(image);
    setFormData({
      image: image.image || '',
      title: image.title || '',
      description: image.description || '',
      isActive: image.isActive !== undefined ? image.isActive : true,
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload?folder=myriad-hotel/banquet-gallery', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, image: data.url }));
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!formData.image) {
      toast({
        title: 'Validation Error',
        description: 'Image is required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      if (editingImage && editingImage._id) {
        // Update existing image
        const response = await fetch(`/api/banquet-gallery/${editingImage._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Gallery image updated successfully',
          });
          fetchImages();
          setIsDialogOpen(false);
        } else {
          throw new Error('Failed to update gallery image');
        }
      } else {
        // Create new image
        const response = await fetch('/api/banquet-gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Gallery image created successfully',
          });
          fetchImages();
          setIsDialogOpen(false);
        } else {
          throw new Error('Failed to create gallery image');
        }
      }
    } catch (error) {
      console.error('Error saving gallery image:', error);
      toast({
        title: 'Error',
        description: 'Failed to save gallery image',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch(`/api/banquet-gallery/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Gallery image deleted successfully',
        });
        fetchImages();
      } else {
        throw new Error('Failed to delete gallery image');
      }
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete gallery image',
        variant: 'destructive',
      });
    }
  };

  const handleOrderChange = async (image: BanquetGalleryImage, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex((img) => img._id === image._id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const targetImage = images[newIndex];
    const newOrder = targetImage.order;
    const targetNewOrder = image.order;

    try {
      // Update both images' order
      await Promise.all([
        fetch(`/api/banquet-gallery/${image._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: newOrder }),
        }),
        fetch(`/api/banquet-gallery/${targetImage._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: targetNewOrder }),
        }),
      ]);

      fetchImages();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update image order',
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Banquet Gallery Management</h1>
          <p className="text-muted-foreground">Manage gallery images for the banquet page</p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{images.length}</div>
            <p className="text-xs text-muted-foreground">All gallery images</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {images.filter((img) => img.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Active images</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {images.filter((img) => !img.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Inactive images</p>
          </CardContent>
        </Card>
      </div>

      {/* Images List */}
      <Card>
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
          <CardDescription>Manage images displayed in the banquet gallery section</CardDescription>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No gallery images yet. Click "Add Image" to create one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div
                  key={image._id}
                  className="flex flex-col gap-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOrderChange(image, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOrderChange(image, 'down')}
                        disabled={index === images.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(image)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => image._id && handleDelete(image._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="relative w-full h-48 rounded overflow-hidden shrink-0">
                    <Image
                      src={image.image || '/placeholder.svg'}
                      alt={image.title || 'Gallery image'}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {image.title && (
                        <h3 className="font-semibold text-sm">{image.title}</h3>
                      )}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          image.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                        }`}
                      >
                        {image.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Order: {image.order}
                      </span>
                    </div>
                    {image.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
        <DialogContent 
          className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="px-6 pt-6 pb-4 border-b shrink-0 relative">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? 'Edit Gallery Image' : 'Add New Gallery Image'}
              </DialogTitle>
              <DialogDescription>
                {editingImage
                  ? 'Update the gallery image information below'
                  : 'Add a new image to the banquet gallery section'}
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
          <div className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label>Image *</Label>
              <div className="space-y-3">
                {/* Image URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Enter image URL or upload a file"
                      className="flex-1"
                    />
                    {formData.image && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, image: '' })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label className="text-sm">Or Upload Image</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={uploadingImage}
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center gap-2 px-4 py-2 border border-border rounded-md cursor-pointer hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Choose File</span>
                        </>
                      )}
                    </label>
                    {formData.image && (
                      <span className="text-sm text-muted-foreground">
                        Image selected
                      </span>
                    )}
                  </div>
                </div>

                {/* Image Preview */}
                {formData.image && formData.image.trim() !== '' && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                    {formData.image.startsWith('http://') || formData.image.startsWith('https://') || formData.image.startsWith('/') ? (
                      <Image
                        src={formData.image}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized={!formData.image.includes('res.cloudinary.com')}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                        <p className="text-sm">Invalid image URL</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter image title (optional)"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter image description (optional)"
                rows={3}
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-border"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active (show in gallery)
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingImage ? (
                  'Update Image'
                ) : (
                  'Add Image'
                )}
              </Button>
            </div>
          </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

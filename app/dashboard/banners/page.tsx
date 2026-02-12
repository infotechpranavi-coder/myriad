'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye, Loader2, Image as ImageIcon, ArrowUp, ArrowDown, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Banner } from '@/lib/models/banner';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function BannersManagementPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    images: [] as string[],
    link: '',
    buttonText: 'Learn More',
    isActive: true,
    page: 'home' as 'home' | 'about' | 'rooms',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<number[]>([]);

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    try {
      setLoading(true);
      const response = await fetch('/api/banners');
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch banners',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch banners',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAddClick = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      images: [],
      link: '',
      buttonText: 'Learn More',
      isActive: true,
      page: 'home',
    });
    setIsDialogOpen(true);
  };

  const handleEditClick = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image: banner.image || '',
      images: banner.images || (banner.image ? [banner.image] : []),
      link: banner.link || '',
      buttonText: banner.buttonText || 'Learn More',
      isActive: banner.isActive !== undefined ? banner.isActive : true,
      page: banner.page || 'home',
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    // Use images array if available, otherwise fall back to single image
    const imagesToSave = formData.images.length > 0 ? formData.images : (formData.image ? [formData.image] : []);
    
    if (!formData.title || imagesToSave.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Title and at least one image are required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      if (editingBanner) {
        // Update existing banner
        const updateData = {
          ...formData,
          images: imagesToSave,
          image: imagesToSave[0] || formData.image, // Keep first image for backward compatibility
        };
        const response = await fetch(`/api/banners/${editingBanner._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        });

        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Banner updated successfully',
          });
          fetchBanners();
          setIsDialogOpen(false);
        } else {
          throw new Error('Failed to update banner');
        }
      } else {
        // Create new banner
        const createData = {
          ...formData,
          images: imagesToSave,
          image: imagesToSave[0] || formData.image, // Keep first image for backward compatibility
        };
        const response = await fetch('/api/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createData),
        });

        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Banner created successfully',
          });
          fetchBanners();
          setIsDialogOpen(false);
        } else {
          throw new Error('Failed to create banner');
        }
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to save banner',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Banner deleted successfully',
        });
        fetchBanners();
      } else {
        throw new Error('Failed to delete banner');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete banner',
        variant: 'destructive',
      });
    }
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

      const response = await fetch('/api/upload?folder=myriad-hotel/banners', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFormData((prev) => ({ 
        ...prev, 
        image: data.url,
        images: prev.images.length > 0 ? [...prev.images, data.url] : [data.url]
      }));
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
      // Reset file input
      event.target.value = '';
    }
  };

  const handleMultipleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    
    // Validate all files
    for (const file of filesArray) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File',
          description: `${file.name} is not an image file`,
          variant: 'destructive',
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: `${file.name} is larger than 5MB`,
          variant: 'destructive',
        });
        return;
      }
    }

    const uploadPromises = filesArray.map(async (file, index) => {
      setUploadingImages((prev) => [...prev, index]);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload?folder=myriad-hotel/banners', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.url;
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: 'Error',
          description: `Failed to upload ${file.name}`,
          variant: 'destructive',
        });
        return null;
      } finally {
        setUploadingImages((prev) => prev.filter((i) => i !== index));
      }
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    const validUrls = uploadedUrls.filter((url) => url !== null) as string[];

    if (validUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validUrls],
        image: prev.image || validUrls[0], // Set first image if no image exists
      }));
      toast({
        title: 'Success',
        description: `${validUrls.length} image(s) uploaded successfully`,
      });
    }

    // Reset file input
    event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: newImages[0] || prev.image, // Keep first image or existing image
      };
    });
  };

  const handleAddImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url.trim()],
        image: prev.image || url.trim(), // Set first image if no image exists
      }));
    }
  };

  const handleOrderChange = async (banner: Banner, direction: 'up' | 'down') => {
    const currentIndex = banners.findIndex((b) => b._id === banner._id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;

    const targetBanner = banners[newIndex];
    const newOrder = targetBanner.order;
    const targetNewOrder = banner.order;

    try {
      // Update both banners' order
      await Promise.all([
        fetch(`/api/banners/${banner._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: newOrder }),
        }),
        fetch(`/api/banners/${targetBanner._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: targetNewOrder }),
        }),
      ]);

      fetchBanners();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update banner order',
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
          <h1 className="text-3xl font-bold">Banner Management</h1>
          <p className="text-muted-foreground">Manage homepage hero banners</p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Banners</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{banners.length}</div>
            <p className="text-xs text-muted-foreground">All banners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {banners.filter((b) => b.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Active banners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {banners.filter((b) => !b.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Inactive banners</p>
          </CardContent>
        </Card>
      </div>

      {/* Banners List */}
      <Card>
        <CardHeader>
          <CardTitle>Banners</CardTitle>
          <CardDescription>Manage your homepage hero banners</CardDescription>
        </CardHeader>
        <CardContent>
          {banners.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No banners yet. Click "Add Banner" to create one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {banners.map((banner, index) => (
                <div
                  key={banner._id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOrderChange(banner, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOrderChange(banner, 'down')}
                      disabled={index === banners.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="relative w-32 h-20 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={banner.image || '/placeholder.svg'}
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{banner.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          banner.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                        }`}
                      >
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Order: {banner.order}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        Page: {banner.page || 'home'}
                      </span>
                    </div>
                    {banner.subtitle && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.link && (
                      <p className="text-xs text-muted-foreground">
                        Link: {banner.link}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(banner)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => banner._id && handleDelete(banner._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </DialogTitle>
            <DialogDescription>
              {editingBanner
                ? 'Update the banner information below'
                : 'Create a new banner for the homepage hero section'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter banner title"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Enter banner subtitle"
              />
            </div>

            {/* Page Selection */}
            <div className="space-y-2">
              <Label htmlFor="page">Page *</Label>
              <Select
                value={formData.page}
                onValueChange={(value: 'home' | 'about' | 'rooms') => setFormData({ ...formData, page: value })}
              >
                <SelectTrigger id="page">
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="about">About</SelectItem>
                  <SelectItem value="rooms">Rooms</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select where this banner will be displayed
              </p>
            </div>

            {/* Multiple Images Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Banner Images * (Multiple images will be shown in slider)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddImageUrl}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add URL
                </Button>
              </div>
              
              <div className="space-y-3">
                {/* Multiple File Upload */}
                <div className="space-y-2">
                  <Label className="text-sm">Upload Multiple Images</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleImageUpload}
                      className="hidden"
                      id="images-upload"
                      disabled={uploadingImages.length > 0}
                    />
                    <label
                      htmlFor="images-upload"
                      className="flex items-center gap-2 px-4 py-2 border border-border rounded-md cursor-pointer hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingImages.length > 0 ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading {uploadingImages.length} image(s)...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Choose Multiple Files</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Single File Upload (for backward compatibility) */}
                <div className="space-y-2">
                  <Label className="text-sm">Or Upload Single Image</Label>
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
                  </div>
                </div>

                {/* Images Preview Grid */}
                {formData.images.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm">Uploaded Images ({formData.images.length})</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
                            <Image
                              src={img}
                              alt={`Banner image ${index + 1}`}
                              fill
                              className="object-cover"
                              unoptimized={!img.includes('res.cloudinary.com')}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Single Image Preview (for backward compatibility) */}
                {formData.images.length === 0 && formData.image && formData.image.trim() !== '' && (
                  <div className="space-y-2">
                    <Label className="text-sm">Image Preview</Label>
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
                  </div>
                )}
              </div>
            </div>

            {/* Link */}
            <div className="space-y-2">
              <Label htmlFor="link">Link URL</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="/rooms or https://..."
              />
            </div>

            {/* Button Text */}
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="Learn More"
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
                Active (show on homepage)
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
                ) : editingBanner ? (
                  'Update Banner'
                ) : (
                  'Create Banner'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

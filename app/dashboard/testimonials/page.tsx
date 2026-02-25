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
import { Plus, Edit, Trash2, Loader2, Star, ArrowUp, ArrowDown, Eye, EyeOff, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Testimonial } from '@/lib/models/testimonial';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TestimonialsManagementPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: '',
    rating: 5,
    image: '',
    email: '',
    phone: '',
    isActive: true,
  });

  useEffect(() => {
    fetchTestimonials();
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

  async function fetchTestimonials() {
    try {
      setLoading(true);
      const response = await fetch('/api/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch testimonials',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch testimonials',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAddClick = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      role: '',
      quote: '',
      rating: 5,
      image: '',
      email: '',
      phone: '',
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEditClick = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name || '',
      role: testimonial.role || '',
      quote: testimonial.quote || '',
      rating: testimonial.rating || 5,
      image: testimonial.image || '',
      email: testimonial.email || '',
      phone: testimonial.phone || '',
      isActive: testimonial.isActive !== undefined ? testimonial.isActive : true,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.quote) {
      toast({
        title: 'Validation Error',
        description: 'Name and quote are required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const url = editingTestimonial
        ? `/api/testimonials/${editingTestimonial._id}`
        : '/api/testimonials';
      const method = editingTestimonial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: editingTestimonial
            ? 'Testimonial updated successfully'
            : 'Testimonial created successfully',
        });
        setIsDialogOpen(false);
        fetchTestimonials();
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to save testimonial',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to save testimonial',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Testimonial deleted successfully',
        });
        fetchTestimonials();
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to delete testimonial',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (testimonial: Testimonial) => {
    try {
      const response = await fetch(`/api/testimonials/${testimonial._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...testimonial,
          isActive: !testimonial.isActive,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Testimonial ${!testimonial.isActive ? 'activated' : 'deactivated'}`,
        });
        fetchTestimonials();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update testimonial',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error toggling testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to update testimonial',
        variant: 'destructive',
      });
    }
  };

  const handleMoveOrder = async (testimonial: Testimonial, direction: 'up' | 'down') => {
    const currentIndex = testimonials.findIndex((t) => t._id === testimonial._id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= testimonials.length) return;

    const targetTestimonial = testimonials[newIndex];
    const newOrder = targetTestimonial.order;
    const oldOrder = testimonial.order;

    try {
      // Update both testimonials
      await Promise.all([
        fetch(`/api/testimonials/${testimonial._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...testimonial, order: newOrder }),
        }),
        fetch(`/api/testimonials/${targetTestimonial._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...targetTestimonial, order: oldOrder }),
        }),
      ]);

      fetchTestimonials();
    } catch (error) {
      console.error('Error moving testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder testimonial',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeTestimonials = testimonials.filter((t) => t.isActive);
  const inactiveTestimonials = testimonials.filter((t) => !t.isActive);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Testimonials Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage guest testimonials displayed on the homepage
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Testimonial
        </Button>
      </div>

      {/* Active Testimonials */}
      {activeTestimonials.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Active Testimonials</h2>
          <div className="grid gap-4">
            {activeTestimonials.map((testimonial, index) => (
              <Card key={testimonial._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription className="mt-1">{testimonial.role}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {index > 0 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleMoveOrder(testimonial, 'up')}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                      )}
                      {index < activeTestimonials.length - 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleMoveOrder(testimonial, 'down')}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggleActive(testimonial)}
                        title="Deactivate"
                      >
                        <EyeOff className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(testimonial)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(testimonial._id!)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground/80 italic mb-4">"{testimonial.quote}"</p>
                  {(testimonial.email || testimonial.phone) && (
                    <div className="pt-3 border-t border-border space-y-1">
                      {testimonial.email && (
                        <p className="text-sm text-foreground/60">
                          <span className="font-medium">Email:</span> {testimonial.email}
                        </p>
                      )}
                      {testimonial.phone && (
                        <p className="text-sm text-foreground/60">
                          <span className="font-medium">Phone:</span> {testimonial.phone}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Inactive Testimonials */}
      {inactiveTestimonials.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Inactive Testimonials</h2>
          <div className="grid gap-4">
            {inactiveTestimonials.map((testimonial) => (
              <Card key={testimonial._id} className="opacity-60">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription className="mt-1">{testimonial.role}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggleActive(testimonial)}
                        title="Activate"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(testimonial)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(testimonial._id!)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground/80 italic mb-4">"{testimonial.quote}"</p>
                  {(testimonial.email || testimonial.phone) && (
                    <div className="pt-3 border-t border-border space-y-1">
                      {testimonial.email && (
                        <p className="text-sm text-foreground/60">
                          <span className="font-medium">Email:</span> {testimonial.email}
                        </p>
                      )}
                      {testimonial.phone && (
                        <p className="text-sm text-foreground/60">
                          <span className="font-medium">Phone:</span> {testimonial.phone}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {testimonials.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No testimonials yet. Add your first one!</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
        <DialogContent 
          className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 gap-0 [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="px-6 pt-6 pb-4 border-b shrink-0 relative">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
              <DialogDescription>
                {editingTestimonial
                  ? 'Update the testimonial details below.'
                  : 'Fill in the details to add a new testimonial.'}
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Guest name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role / Title</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Business Traveler, Wedding Guest"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote">Quote *</Label>
              <Textarea
                id="quote"
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                placeholder="Testimonial quote"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Select
                value={formData.rating.toString()}
                onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} {rating === 1 ? 'Star' : 'Stars'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Profile Image URL (Optional)</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="guest@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 1234567890"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isActive" className="font-normal">
                Active (visible on homepage)
              </Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingTestimonial ? (
                  'Update Testimonial'
                ) : (
                  'Create Testimonial'
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

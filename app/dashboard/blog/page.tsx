'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, FileText, Edit, Trash2, Eye, Loader2, Image as ImageIcon, Upload, X, Trash } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { BlogPost, BlogSection } from '@/lib/models/blog';
import Image from 'next/image';

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    author: '',
    date: '',
    image: '',
    readTime: '',
    content: '',
  });
  const [sections, setSections] = useState<BlogSection[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isEditDialogOpen) {
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
  }, [isEditDialogOpen]);

  async function fetchPosts() {
    try {
      setLoading(true);
      const response = await fetch('/api/blog');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch blog posts',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch blog posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAddClick = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      author: '',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      image: '',
      readTime: '5 min read',
      content: '',
    });
    setSections([]);
    setIsEditDialogOpen(true);
  };

  const handleEditClick = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      excerpt: post.excerpt || '',
      author: post.author || '',
      date: post.date || '',
      image: post.image || '',
      readTime: post.readTime || '5 min read',
      content: post.content || '',
    });
    setSections(post.sections || []);
    setIsEditDialogOpen(true);
  };

  const handleAddSection = () => {
    setSections([...sections, { title: '', descriptions: [''] }]);
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSectionTitleChange = (index: number, title: string) => {
    const updatedSections = [...sections];
    updatedSections[index].title = title;
    setSections(updatedSections);
  };

  const handleAddDescription = (sectionIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].descriptions.push('');
    setSections(updatedSections);
  };

  const handleRemoveDescription = (sectionIndex: number, descIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].descriptions = updatedSections[sectionIndex].descriptions.filter(
      (_, i) => i !== descIndex
    );
    setSections(updatedSections);
  };

  const handleDescriptionChange = (sectionIndex: number, descIndex: number, value: string) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].descriptions[descIndex] = value;
    setSections(updatedSections);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        description: 'File size must be less than 10MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload?folder=myriad-hotel/blog', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, image: data.url });
        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
        });
      } else {
        throw new Error('Upload failed');
      }
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
    if (!formData.title || !formData.author || !formData.image) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields (Title, Author, and Image)',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      if (editingPost && editingPost._id) {
        // Update existing post
        // Filter sections to only include valid ones with titles
        const validSections = sections
          .filter(section => section && section.title && section.title.trim() !== '')
          .map(section => ({
            title: section.title.trim(),
            descriptions: (section.descriptions || [])
              .filter((desc: string) => desc && typeof desc === 'string')
              .map((desc: string) => desc.trim())
          }));

        const updateData = {
          title: formData.title.trim(),
          excerpt: formData.excerpt || '',
          author: formData.author.trim(),
          date: formData.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          image: formData.image || '',
          images: formData.image ? [formData.image] : [],
          readTime: formData.readTime || '5 min read',
          content: formData.content || '',
          sections: validSections,
        };

        console.log('Sending update request:', {
          postId: editingPost._id,
          updateData,
        });

        const response = await fetch(`/api/blog/${editingPost._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        });

        let responseData: any = {};
        const responseText = await response.text();
        
        try {
          responseData = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
          // Response might not be JSON
          console.error('Non-JSON response:', responseText);
          responseData = { error: responseText || 'Unknown error' };
        }

        if (response.ok) {
          toast({
            title: 'Success',
            description: responseData.message || 'Blog post updated successfully',
          });
          fetchPosts();
          setIsEditDialogOpen(false);
          setEditingPost(null);
          setSections([]);
        } else {
          const errorMessage = responseData.error || responseData.message || responseText || `Failed to update blog post (Status: ${response.status})`;
          console.error('Update error:', {
            status: response.status,
            statusText: response.statusText,
            responseText,
            responseData,
            updateData,
            postId: editingPost._id,
          });
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        }
      } else {
        // Create new post
        const createData = {
          ...formData,
          images: formData.image ? [formData.image] : [],
          category: formData.category || '',
          status: 'published',
          sections: sections.filter(section => section.title.trim() !== ''),
        };

        const response = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createData),
        });

        const responseData = await response.json();

        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Blog post created successfully',
          });
          fetchPosts();
          setIsEditDialogOpen(false);
          setEditingPost(null);
        } else {
          const errorMessage = responseData.error || 'Failed to create blog post';
          console.error('Create error:', responseData);
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save blog post',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Blog post deleted successfully',
        });
        fetchPosts();
      } else {
        throw new Error('Failed to delete blog post');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground">Manage your blog posts and articles</p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">All blog posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.filter((p) => p.status === 'published').length}
            </div>
            <p className="text-xs text-muted-foreground">Published posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.filter((p) => p.status === 'draft').length}
            </div>
            <p className="text-xs text-muted-foreground">Draft posts</p>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>Manage and edit your blog articles</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No blog posts yet. Click "New Post" to create one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{post.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post._id}`} target="_blank">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(post)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => post._id && handleDelete(post._id)}
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} modal={true}>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="px-6 pt-6 pb-4 border-b flex-shrink-0 relative">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </DialogTitle>
              <DialogDescription>
                {editingPost
                  ? 'Update the blog post information below'
                  : 'Fill in the details to create a new blog post'}
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
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter blog post title"
              />
            </div>

            {/* Author and Date Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="January 15, 2024"
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label>Main Image *</Label>
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
                {formData.image && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Read Time */}
            <div className="space-y-2">
              <Label htmlFor="readTime">Read Time</Label>
              <Input
                id="readTime"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                placeholder="5 min read"
              />
            </div>

            {/* Sections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Sections</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSection}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>

              {sections.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No sections added. Click "Add Section" to create one.
                </p>
              )}

              {sections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="border border-border rounded-lg p-4 space-y-4 bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      Section {sectionIndex + 1}
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSection(sectionIndex)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Section Title */}
                  <div className="space-y-2">
                    <Label>Section Title *</Label>
                    <Input
                      value={section.title}
                      onChange={(e) => handleSectionTitleChange(sectionIndex, e.target.value)}
                      placeholder="Enter section title"
                    />
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Descriptions</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddDescription(sectionIndex)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Description
                      </Button>
                    </div>

                    {section.descriptions.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        No descriptions. Click "Add Description" to add one.
                      </p>
                    )}

                    {section.descriptions.map((description, descIndex) => (
                      <div key={descIndex} className="flex gap-2">
                        <Textarea
                          value={description}
                          onChange={(e) =>
                            handleDescriptionChange(sectionIndex, descIndex, e.target.value)
                          }
                          placeholder="Enter description text"
                          rows={3}
                          className="flex-1"
                        />
                        {section.descriptions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDescription(sectionIndex, descIndex)}
                            className="text-destructive hover:text-destructive mt-auto"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingPost(null);
                }}
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
                ) : editingPost ? (
                  'Update Post'
                ) : (
                  'Create Post'
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

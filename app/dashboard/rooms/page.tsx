'use client';

import { useState } from 'react';
import { roomTypes } from '@/lib/room-data';
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

export default function RoomsManagementPage() {
  const [rooms, setRooms] = useState(roomTypes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    capacity: '',
    size: '',
    amenities: '',
    images: '',
  });

  const handleEdit = (room: any) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description,
      price: room.price.toString(),
      oldPrice: room.oldPrice?.toString() || '',
      capacity: room.capacity,
      size: room.size,
      amenities: room.amenities.join(', '),
      images: room.images.join(', '),
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingRoom(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      capacity: '',
      size: '',
      amenities: '',
      images: '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const roomData = {
      id: editingRoom?.id || (rooms.length + 1).toString(),
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      oldPrice: formData.oldPrice ? parseInt(formData.oldPrice) : undefined,
      capacity: formData.capacity,
      size: formData.size,
      amenities: formData.amenities.split(',').map((a) => a.trim()),
      images: formData.images.split(',').map((img) => img.trim()),
    };

    if (editingRoom) {
      setRooms(rooms.map((r) => (r.id === editingRoom.id ? roomData : r)));
    } else {
      setRooms([...rooms, roomData]);
    }

    setIsDialogOpen(false);
    alert('Room saved! (Note: Changes are temporary - implement backend to persist)');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter((r) => r.id !== id));
      alert('Room deleted! (Note: Changes are temporary - implement backend to persist)');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Rooms</h1>
          <p className="text-muted-foreground">Add, edit, or remove room types</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
              <DialogDescription>
                {editingRoom ? 'Update room details' : 'Create a new room type'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Room Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Deluxe Room"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Room description..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Price (₹)</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="4230"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Old Price (₹)</label>
                  <Input
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    placeholder="5500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Capacity</label>
                  <Input
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="2 Guests"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Size</label>
                  <Input
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="150 sq ft"
                  />
                </div>
              </div>
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
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Image URLs (comma-separated)
                </label>
                <Input
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="/rooms/deluxe.png, /rooms/executive.png"
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingRoom ? 'Update Room' : 'Add Room'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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

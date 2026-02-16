'use client';

import { useState, useEffect } from 'react';
import { Proposal } from '@/lib/models/proposal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingProposal, setViewingProposal] = useState<Proposal | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProposals();
  }, []);

  async function fetchProposals() {
    try {
      setLoading(true);
      const response = await fetch('/api/proposals');
      if (response.ok) {
        const data = await response.json();
        setProposals(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch proposals',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch proposals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this proposal?')) {
      return;
    }

    try {
      const response = await fetch(`/api/proposals/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Proposal deleted successfully',
        });
        fetchProposals();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete proposal',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting proposal:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete proposal',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/proposals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Proposal status updated successfully',
        });
        fetchProposals();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update proposal status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating proposal status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update proposal status',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'quoted':
        return 'bg-purple-100 text-purple-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Proposal Requests</CardTitle>
          <CardDescription>
            Manage and track all proposal requests from potential clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {proposals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No proposals found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Event Date</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.map((proposal) => (
                    <TableRow key={proposal._id}>
                      <TableCell className="font-medium">{proposal.firstName} {proposal.lastName}</TableCell>
                      <TableCell>{proposal.mobileNumber}</TableCell>
                      <TableCell>{proposal.eventType}{proposal.eventTypeOther ? ` (${proposal.eventTypeOther})` : ''}</TableCell>
                      <TableCell>
                        {proposal.eventDate
                          ? new Date(proposal.eventDate).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{proposal.expectedGuests || 'N/A'}</TableCell>
                      <TableCell>
                        <Select
                          value={proposal.status || 'pending'}
                          onValueChange={(value) =>
                            handleStatusChange(proposal._id!, value)
                          }
                        >
                          <SelectTrigger className={`w-32 ${getStatusColor(proposal.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="quoted">Quoted</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingProposal(proposal)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(proposal._id!)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Proposal Dialog */}
      <Dialog
        open={viewingProposal !== null}
        onOpenChange={(open) => !open && setViewingProposal(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Proposal Details</DialogTitle>
            <DialogDescription>
              View complete information about this proposal request
            </DialogDescription>
          </DialogHeader>
          {viewingProposal && (
            <div className="space-y-6">
              {/* Personal Details */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2">Personal Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">First Name</p>
                    <p className="text-base font-semibold">{viewingProposal.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                    <p className="text-base font-semibold">{viewingProposal.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mobile Number</p>
                    <p className="text-base font-semibold">{viewingProposal.mobileNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Alternate Contact</p>
                    <p className="text-base font-semibold">{viewingProposal.alternateContactNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2">Event Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Event Type</p>
                    <p className="text-base font-semibold">
                      {viewingProposal.eventType}
                      {viewingProposal.eventTypeOther && ` (${viewingProposal.eventTypeOther})`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Event Date</p>
                    <p className="text-base font-semibold">
                      {viewingProposal.eventDate
                        ? new Date(viewingProposal.eventDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Event Timing</p>
                    <p className="text-base font-semibold">{viewingProposal.eventTiming || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Catering Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2">Catering Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Food Preference</p>
                    <p className="text-base font-semibold">
                      {viewingProposal.foodPreference}
                      {viewingProposal.foodPreferenceOther && ` (${viewingProposal.foodPreferenceOther})`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Alcohol Required</p>
                    <p className="text-base font-semibold">{viewingProposal.alcoholRequired}</p>
                  </div>
                </div>
              </div>

              {/* Guest & Accommodation */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2">Guest & Accommodation Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Expected Guests</p>
                    <p className="text-base font-semibold">{viewingProposal.expectedGuests || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rooms Required</p>
                    <p className="text-base font-semibold">{viewingProposal.roomsRequired}</p>
                  </div>
                  {viewingProposal.roomsRequired === 'Yes' && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Number of Rooms</p>
                      <p className="text-base font-semibold">{viewingProposal.numberOfRooms || 'N/A'}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Requirements */}
              {viewingProposal.additionalRequirements && (
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2">Additional Requirements / Special Notes</h3>
                  <p className="text-base bg-muted p-4 rounded-lg">{viewingProposal.additionalRequirements}</p>
                </div>
              )}

              {/* Status & Submitted */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="text-base font-semibold capitalize">
                    {viewingProposal.status || 'Pending'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="text-base">
                    {viewingProposal.createdAt
                      ? new Date(viewingProposal.createdAt).toLocaleString()
                      : 'N/A'}
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

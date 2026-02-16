export interface Booking {
  _id?: string;
  roomId: string;
  roomName: string;
  title: string; // Mr, Ms, etc.
  firstName: string;
  lastName: string;
  email?: string;
  mobileNumber: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: string;
  nights?: number;
  hours?: number;
  selectedAddons?: Array<{
    name: string;
    price: number;
  }>;
  totalAmount?: number;
  status?: 'pending' | 'active' | 'confirmed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

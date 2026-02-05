import { ObjectId } from 'mongodb';

export interface RestaurantBooking {
  _id?: ObjectId;
  restaurantId: string;
  restaurantName: string;
  restaurantSlug: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: string;
  specialRequests?: string;
  status: 'pending' | 'active' | 'confirmed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

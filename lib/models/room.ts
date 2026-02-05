export interface Room {
  _id?: string;
  id: string;
  title: string; // Room title/name
  checkIn?: string; // Check-in time
  checkOut?: string; // Check-out time
  guests?: string; // Guest capacity
  room?: string; // Room type/details
  gallery?: string[]; // Gallery images
  about?: string; // About the room
  amenities: string[]; // Room amenities
  priceSummary?: {
    basePrice: number;
    taxes?: number;
    serviceFees?: number;
    totalAmount?: number;
  };
  addons?: Array<{
    name: string;
    price: number;
    description?: string;
  }>;
  goibiboOffers?: Array<{
    title: string;
    description: string;
    discount?: string;
  }>;
  // Legacy fields for backward compatibility
  name?: string;
  description?: string;
  price?: number;
  oldPrice?: number;
  images?: string[];
  capacity?: string;
  size?: string;
  highlights?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

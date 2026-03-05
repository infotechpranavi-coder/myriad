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
  location?: string; // Room location (e.g., "Thane, Mumbai")
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
  menuHighlights?: {
    highlights: Array<{
      name: string;
      price: string;
      description?: string;
      images?: string[];
    }>;
  };
  // Room booking display fields
  roomDisplayName?: string; // e.g., "1 x Deluxe Room"
  adultsCount?: string; // e.g., "2 Adults"
  boardBasis?: string; // e.g., "Room Only"
  nonRefundablePercentage?: number; // e.g., 60
  refundablePercentage?: number; // e.g., 40
  refundableTimeframe?: string; // e.g., "24 to 48 hours"
  partialRefundAvailable?: boolean; // true/false
  bookingOfferText?: string; // e.g., "Book @ ₹0 available"
  // Display order for sorting
  order?: number;
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

export interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  quote: string;
  rating?: number; // 1-5 stars
  image?: string; // Optional profile image
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

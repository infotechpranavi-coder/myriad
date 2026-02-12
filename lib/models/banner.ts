export interface Banner {
  _id?: string;
  title: string;
  subtitle?: string;
  image: string; // Keep for backward compatibility
  images?: string[]; // Array of images for slider
  link?: string;
  buttonText?: string;
  isActive: boolean;
  order: number;
  page?: 'home' | 'about' | 'rooms';
  createdAt?: Date;
  updatedAt?: Date;
}

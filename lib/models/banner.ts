export interface Banner {
  _id?: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  buttonText?: string;
  isActive: boolean;
  order: number;
  page?: 'home' | 'about';
  createdAt?: Date;
  updatedAt?: Date;
}

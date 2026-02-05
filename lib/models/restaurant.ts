export interface MenuItem {
  name: string;
  price: string;
  description: string;
}

export interface Restaurant {
  _id?: string;
  id: number;
  name: string;
  cuisine: string;
  image: string;
  slug: string;
  description: string;
  about?: string;
  openingHours: string;
  capacity: string;
  address: string;
  location?: string;
  highlights: string[];
  menu: {
    [key: string]: MenuItem[];
  };
  menuHighlights?: {
    [key: string]: MenuItem[];
  };
  gallery?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

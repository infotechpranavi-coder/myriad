export interface BlogSection {
  title: string;
  descriptions: string[];
}

export interface BlogPost {
  _id?: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  status: 'published' | 'draft';
  image?: string;
  images?: string[];
  readTime?: string;
  content?: string;
  sections?: BlogSection[];
  createdAt?: Date;
  updatedAt?: Date;
}

import clientPromise from '@/lib/mongodb';
import { Banner } from '@/lib/models/banner';
import { Room } from '@/lib/models/room';
import { Restaurant } from '@/lib/models/restaurant';
import { Testimonial } from '@/lib/models/testimonial';
import HomeClient from '@/components/home-client';

const DB_NAME = 'hotel_db';

async function getBanners(): Promise<Banner[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const banners = await db
      .collection<Banner>('banners')
      .find({})
      .sort({ order: 1 })
      .toArray();
    // Serialize ObjectIds to strings for client component
    return JSON.parse(JSON.stringify(banners));
    } catch (error) {
      console.error('Error fetching banners:', error);
    return [];
  }
}

async function getRooms(): Promise<Room[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const rooms = await db.collection<Room>('rooms').find({}).toArray();
    
    // Ensure all rooms have both id and _id for consistency
    const roomsWithIds = rooms.map(room => ({
      ...room,
      id: room.id || room._id?.toString() || (room._id as any)?.toString?.() || String(room._id),
      _id: room._id?.toString() || room._id
    }));
    
    // Sort rooms by order field (lower numbers first)
    // Rooms without order will appear last
    const sortedRooms = roomsWithIds.sort((a, b) => {
      const orderA = a.order ?? 9999; // Default to high number if no order
      const orderB = b.order ?? 9999;
      
      // Primary sort by order
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      // Secondary sort by name if order is the same
      const nameA = (a.name || a.title || '').trim();
      const nameB = (b.name || b.title || '').trim();
      return nameA.localeCompare(nameB);
    });
    
    // Serialize ObjectIds to strings for client component
    return JSON.parse(JSON.stringify(sortedRooms));
    } catch (error) {
      console.error('Error fetching rooms:', error);
    return [];
  }
}

async function getRestaurants(): Promise<Restaurant[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const restaurants = await db
      .collection<Restaurant>('restaurants')
      .find({})
      .toArray();
    // Serialize ObjectIds to strings for client component
    return JSON.parse(JSON.stringify(restaurants));
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    return [];
  }
}

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const testimonials = await db
      .collection<Testimonial>('testimonials')
      .find({})
      .sort({ order: 1 })
      .toArray();
    // Serialize ObjectIds to strings for client component
    return JSON.parse(JSON.stringify(testimonials));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    return [];
  }
}

export default async function Home() {
  // Fetch all data in parallel for better performance
  const [banners, rooms, restaurants, testimonials] = await Promise.all([
    getBanners(),
    getRooms(),
    getRestaurants(),
    getTestimonials(),
  ]);

  return (
    <HomeClient
      banners={banners}
      rooms={rooms}
      restaurants={restaurants}
      testimonials={testimonials}
    />
  );
}

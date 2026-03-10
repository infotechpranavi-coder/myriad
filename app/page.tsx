import clientPromise from '@/lib/mongodb';
import { Banner } from '@/lib/models/banner';
import { Room } from '@/lib/models/room';
import { Restaurant } from '@/lib/models/restaurant';
import { BlogPost } from '@/lib/models/blog';
import HomeClient from '@/components/home-client';
import { sortRooms } from '@/lib/utils/room-sort';

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
    const roomsWithIds = rooms.map((room) => ({
      ...room,
      id:
        room.id ||
        room._id?.toString() ||
        (room._id as any)?.toString?.() ||
        String(room._id),
      _id: room._id?.toString() || room._id,
    }));

    // Sort rooms using the utility function (handles order field and default sequence)
    const sortedRooms = sortRooms(roomsWithIds);

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

async function getBlogs(): Promise<BlogPost[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const blogs = await db
      .collection<BlogPost>('blog_posts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    // Serialize ObjectIds to strings for client component
    const serializedBlogs = JSON.parse(JSON.stringify(blogs));
    console.log(`[getBlogs] Fetched ${serializedBlogs.length} blogs from database`);
    return serializedBlogs;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

// Force dynamic rendering on Vercel - disable all caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

export default async function Home() {
  // Fetch all data in parallel for better performance
  const [banners, rooms, restaurants, blogs] = await Promise.all([
    getBanners(),
    getRooms(),
    getRestaurants(),
    getBlogs(),
  ]);

  console.log('[Home Page] Fetched data:', {
    banners: banners.length,
    rooms: rooms.length,
    restaurants: restaurants.length,
    blogs: blogs.length
  });

  return (
    <HomeClient
      banners={banners}
      rooms={rooms}
      restaurants={restaurants}
      blogs={blogs}
    />
  );
}

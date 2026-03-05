import clientPromise from '@/lib/mongodb';
import { Room } from '@/lib/models/room';
import Header from './header';

const DB_NAME = 'hotel_db';

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
    
    // Serialize ObjectIds to strings for client component
    return JSON.parse(JSON.stringify(roomsWithIds));
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
}

export default async function HeaderWrapper() {
  const rooms = await getRooms();
  
  // Sort rooms by order field (lower numbers first)
  // Rooms without order will appear last
  const sortedRooms = [...rooms].sort((a, b) => {
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
  
  return <Header initialRooms={sortedRooms} />;
}

import clientPromise from '@/lib/mongodb';
import { Room } from '@/lib/models/room';
import Header from './header';
import { sortRooms } from '@/lib/utils/room-sort';

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
  
  // Sort rooms using the utility function (handles order field and default sequence)
  const sortedRooms = sortRooms(rooms);
  
  return <Header initialRooms={sortedRooms} />;
}

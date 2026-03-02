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
  
  // Define the desired order sequence
  const roomOrder = [
    'Deluxe Room',
    'Deluxe Twin',
    'Super Deluxe',
    'Executive Room',
    'Executive Suite',
    'Presidential Suite'
  ];
  
  // Sort rooms based on the defined order
  const sortedRooms = [...rooms].sort((a, b) => {
    const roomNameA = (a.name || a.title || '').trim();
    const roomNameB = (b.name || b.title || '').trim();
    
    const indexA = roomOrder.findIndex(order => 
      roomNameA.toLowerCase() === order.toLowerCase()
    );
    const indexB = roomOrder.findIndex(order => 
      roomNameB.toLowerCase() === order.toLowerCase()
    );
    
    // If both are in the order list, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    // If only A is in the order list, A comes first
    if (indexA !== -1) return -1;
    // If only B is in the order list, B comes first
    if (indexB !== -1) return 1;
    // If neither is in the order list, maintain original order
    return 0;
  });
  
  return <Header initialRooms={sortedRooms} />;
}

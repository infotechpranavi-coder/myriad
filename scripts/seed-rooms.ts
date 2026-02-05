// Load environment variables FIRST before any other imports
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Now import after env vars are loaded
import clientPromise from '../lib/mongodb';
import { roomTypes } from '../lib/room-data';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'rooms';

async function seedRooms() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Clear existing rooms
    await collection.deleteMany({});

    // Insert rooms with timestamps
    const roomsWithTimestamps = roomTypes.map((room) => ({
      ...room,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await collection.insertMany(roomsWithTimestamps);
    console.log(`✅ Seeded ${result.insertedCount} rooms successfully!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding rooms:', error);
    process.exit(1);
  }
}

seedRooms();

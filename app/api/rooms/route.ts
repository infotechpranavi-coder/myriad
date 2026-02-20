import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Room } from '@/lib/models/room';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'rooms';

// GET all rooms
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const rooms = await db.collection<Room>(COLLECTION_NAME).find({}).toArray();
    
    // Ensure all rooms have both id and _id for consistency
    const roomsWithIds = rooms.map(room => ({
      ...room,
      id: room.id || room._id?.toString() || (room._id as any)?.toString?.() || String(room._id),
      _id: room._id?.toString() || room._id
    }));
    
    return NextResponse.json(roomsWithIds, { status: 200 });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

// POST create a new room
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Ensure id field is set - use provided id or generate from _id after insert
    const roomData: Room = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Room>(COLLECTION_NAME).insertOne(roomData);
    
    // Return room with both id and _id
    const createdRoom = {
      ...roomData,
      _id: result.insertedId,
      id: roomData.id || result.insertedId.toString(),
    };
    
    return NextResponse.json(createdRoom, { status: 201 });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}

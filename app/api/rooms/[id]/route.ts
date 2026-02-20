import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Room } from '@/lib/models/room';
import { ObjectId } from 'mongodb';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'rooms';

// GET a single room by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    console.log('Fetching room with id:', id);
    
    let room: Room | null = null;
    
    // Try multiple strategies to find the room
    // 1. Try by custom id field (string IDs like "1", "2", "3")
    if (id) {
      room = await db.collection<Room>(COLLECTION_NAME).findOne({ id: id });
    }
    
    // 2. If not found and id looks like MongoDB ObjectId, try by _id
    if (!room && ObjectId.isValid(id)) {
      try {
        room = await db.collection<Room>(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
      } catch (e) {
        console.log('Error trying ObjectId lookup:', e);
      }
    }
    
    // 3. Try finding by _id as string (in case it's stored as string)
    if (!room) {
      room = await db.collection<Room>(COLLECTION_NAME).findOne({ _id: id as any });
    }
    
    // 4. Try finding by converting _id string to ObjectId if possible
    if (!room && id && id.length === 24) {
      try {
        const objectId = new ObjectId(id);
        room = await db.collection<Room>(COLLECTION_NAME).findOne({ _id: objectId });
      } catch (e) {
        // Not a valid ObjectId format, continue
      }
    }
    
    if (!room) {
      console.log('Room not found with id:', id);
      // Log all available room IDs for debugging
      const allRooms = await db.collection<Room>(COLLECTION_NAME).find({}).toArray();
      console.log('Available room IDs:', allRooms.map(r => ({ 
        id: r.id, 
        _id: r._id?.toString() || r._id,
        title: r.title || r.name 
      })));
      return NextResponse.json(
        { error: 'Room not found', id: id },
        { status: 404 }
      );
    }
    
    // Ensure the room has both id and _id for consistency
    const roomResponse = {
      ...room,
      id: room.id || room._id?.toString() || (room._id as any)?.toString?.() || String(room._id),
      _id: room._id?.toString() || room._id
    };
    
    return NextResponse.json(roomResponse, { status: 200 });
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// PUT update a room
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const updateData = {
      ...body,
      updatedAt: new Date(),
    };
    
    // Try to update by MongoDB _id first, then by custom id field
    let result;
    if (ObjectId.isValid(id)) {
      result = await db.collection<Room>(COLLECTION_NAME).findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
    } else {
      result = await db.collection<Room>(COLLECTION_NAME).findOneAndUpdate(
        { id },
        { $set: updateData },
        { returnDocument: 'after' }
      );
    }
    
    if (!result) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { error: 'Failed to update room' },
      { status: 500 }
    );
  }
}

// DELETE a room
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Try to delete by MongoDB _id first, then by custom id field
    let result;
    if (ObjectId.isValid(id)) {
      result = await db.collection<Room>(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    } else {
      result = await db.collection<Room>(COLLECTION_NAME).deleteOne({ id });
    }
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Room deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    );
  }
}

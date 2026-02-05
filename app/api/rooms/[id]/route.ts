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
    
    // Try to find by custom id field first (since we're using string IDs like "1", "2", "3")
    let room = await db.collection<Room>(COLLECTION_NAME).findOne({ id: id });
    
    // If not found by custom id, try MongoDB _id
    if (!room && ObjectId.isValid(id)) {
      room = await db.collection<Room>(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
    }
    
    if (!room) {
      console.log('Room not found with id:', id);
      // Log all available room IDs for debugging
      const allRooms = await db.collection<Room>(COLLECTION_NAME).find({}).toArray();
      console.log('Available room IDs:', allRooms.map(r => ({ id: r.id, _id: r._id })));
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(room, { status: 200 });
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

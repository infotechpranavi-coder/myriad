import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Booking } from '@/lib/models/booking';
import { ObjectId } from 'mongodb';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'bookings';

// GET booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    let booking = null;
    
    if (ObjectId.isValid(id)) {
      booking = await db
        .collection<Booking>(COLLECTION_NAME)
        .findOne({ _id: new ObjectId(id) });
    }

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error(`Error fetching booking with id ${params}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

// PUT update booking by ID
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

    let result = null;
    
    if (ObjectId.isValid(id)) {
      result = await db
        .collection<Booking>(COLLECTION_NAME)
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: updateData },
          { returnDocument: 'after' }
        );
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(`Error updating booking with id ${params}:`, error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// DELETE booking by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    let result = null;
    
    if (ObjectId.isValid(id)) {
      result = await db
        .collection<Booking>(COLLECTION_NAME)
        .deleteOne({ _id: new ObjectId(id) });
    }

    if (!result || result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Booking deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting booking with id ${params}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}

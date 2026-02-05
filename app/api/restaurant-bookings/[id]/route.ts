import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { RestaurantBooking } from '@/lib/models/restaurant-booking';
import { ObjectId } from 'mongodb';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'restaurant_bookings';

// GET restaurant booking by ID
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
        .collection<RestaurantBooking>(COLLECTION_NAME)
        .findOne({ _id: new ObjectId(id) });
    }

    if (!booking) {
      return NextResponse.json(
        { error: 'Restaurant booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error(`Error fetching restaurant booking with id ${params}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant booking' },
      { status: 500 }
    );
  }
}

// PUT update restaurant booking by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const updateData: any = {
      ...body,
      updatedAt: new Date(),
    };

    // Convert date string to Date object if present
    if (body.date) {
      updateData.date = new Date(body.date);
    }

    let result = null;

    if (ObjectId.isValid(id)) {
      result = await db
        .collection<RestaurantBooking>(COLLECTION_NAME)
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: updateData },
          { returnDocument: 'after' }
        );
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Restaurant booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(`Error updating restaurant booking with id ${params}:`, error);
    return NextResponse.json(
      { error: 'Failed to update restaurant booking' },
      { status: 500 }
    );
  }
}

// DELETE restaurant booking by ID
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
        .collection<RestaurantBooking>(COLLECTION_NAME)
        .deleteOne({ _id: new ObjectId(id) });
    }

    if (!result || result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Restaurant booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Restaurant booking deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting restaurant booking with id ${params}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete restaurant booking' },
      { status: 500 }
    );
  }
}

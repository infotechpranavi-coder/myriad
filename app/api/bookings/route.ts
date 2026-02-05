import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Booking } from '@/lib/models/booking';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'bookings';

// GET all bookings
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const bookings = await db
      .collection<Booking>(COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const bookingData: Booking = {
      ...body,
      status: body.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection<Booking>(COLLECTION_NAME)
      .insertOne(bookingData);

    return NextResponse.json(
      { ...bookingData, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

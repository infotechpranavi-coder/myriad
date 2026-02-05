import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { RestaurantBooking } from '@/lib/models/restaurant-booking';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'restaurant_bookings';

// GET all restaurant bookings
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const bookings = await db
      .collection<RestaurantBooking>(COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('Error fetching restaurant bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant bookings' },
      { status: 500 }
    );
  }
}

// POST create a new restaurant booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const bookingData: RestaurantBooking = {
      ...body,
      date: new Date(body.date),
      status: 'pending', // Default status
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection<RestaurantBooking>(COLLECTION_NAME)
      .insertOne(bookingData);

    return NextResponse.json(
      { ...bookingData, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating restaurant booking:', error);
    return NextResponse.json(
      { error: 'Failed to create restaurant booking' },
      { status: 500 }
    );
  }
}

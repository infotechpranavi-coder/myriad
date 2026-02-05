import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Restaurant } from '@/lib/models/restaurant';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'restaurants';

// GET all restaurants
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const restaurants = await db
      .collection<Restaurant>(COLLECTION_NAME)
      .find({})
      .toArray();

    return NextResponse.json(restaurants, { status: 200 });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}

// POST create a new restaurant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Get the next ID
    const existingRestaurants = await db
      .collection<Restaurant>(COLLECTION_NAME)
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const nextId = existingRestaurants.length > 0 
      ? existingRestaurants[0].id + 1 
      : 1;

    const restaurantData: Restaurant = {
      ...body,
      id: body.id || nextId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection<Restaurant>(COLLECTION_NAME)
      .insertOne(restaurantData);

    return NextResponse.json(
      { ...restaurantData, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    );
  }
}

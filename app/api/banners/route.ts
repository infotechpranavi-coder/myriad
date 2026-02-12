import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Banner } from '@/lib/models/banner';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'banners';

// GET - Fetch all banners
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const banners = await db
      .collection<Banner>(COLLECTION_NAME)
      .find({})
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// POST - Create a new banner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Get the highest order number
    const lastBanner = await db
      .collection<Banner>(COLLECTION_NAME)
      .findOne({}, { sort: { order: -1 } });

    const newBanner: Banner = {
      title: body.title,
      subtitle: body.subtitle || '',
      image: body.image || (body.images && body.images.length > 0 ? body.images[0] : ''),
      images: body.images || (body.image ? [body.image] : []),
      link: body.link || '',
      buttonText: body.buttonText || 'Learn More',
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: lastBanner ? lastBanner.order + 1 : 1,
      page: body.page || 'home',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Banner>(COLLECTION_NAME).insertOne(newBanner);

    return NextResponse.json(
      { ...newBanner, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}

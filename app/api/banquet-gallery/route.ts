import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { BanquetGalleryImage } from '@/lib/models/banquet-gallery';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'banquet_gallery';

// GET - Fetch all gallery images
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const images = await db
      .collection<BanquetGalleryImage>(COLLECTION_NAME)
      .find({})
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}

// POST - Create a new gallery image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Get the highest order number
    const lastImage = await db
      .collection<BanquetGalleryImage>(COLLECTION_NAME)
      .findOne({}, { sort: { order: -1 } });

    const newImage: BanquetGalleryImage = {
      image: body.image,
      title: body.title || '',
      description: body.description || '',
      order: lastImage ? lastImage.order + 1 : 1,
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<BanquetGalleryImage>(COLLECTION_NAME).insertOne(newImage);

    return NextResponse.json(
      { ...newImage, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery image' },
      { status: 500 }
    );
  }
}

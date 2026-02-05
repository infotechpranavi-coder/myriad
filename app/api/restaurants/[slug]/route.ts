import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Restaurant } from '@/lib/models/restaurant';
import { ObjectId } from 'mongodb';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'restaurants';

// Helper function to determine if param is numeric (ID) or string (slug)
function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

// GET restaurant by slug or ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    let restaurant = null;

    // If numeric, treat as ID
    if (isNumeric(slug)) {
      restaurant = await db
        .collection<Restaurant>(COLLECTION_NAME)
        .findOne({ id: parseInt(slug) });

      // If not found by custom id, try by MongoDB _id
      if (!restaurant && ObjectId.isValid(slug)) {
        restaurant = await db
          .collection<Restaurant>(COLLECTION_NAME)
          .findOne({ _id: new ObjectId(slug) });
      }
    } else {
      // Otherwise treat as slug
      restaurant = await db
        .collection<Restaurant>(COLLECTION_NAME)
        .findOne({ slug });
    }

    if (!restaurant) {
      console.warn(`Restaurant with identifier ${slug} not found.`);
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(restaurant, { status: 200 });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant' },
      { status: 500 }
    );
  }
}

// PUT update restaurant by slug or ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    let result = null;

    // If numeric, treat as ID
    if (isNumeric(slug)) {
      result = await db
        .collection<Restaurant>(COLLECTION_NAME)
        .findOneAndUpdate(
          { id: parseInt(slug) },
          { $set: updateData },
          { returnDocument: 'after' }
        );

      // If not found by custom id, try by MongoDB _id
      if (!result && ObjectId.isValid(slug)) {
        result = await db
          .collection<Restaurant>(COLLECTION_NAME)
          .findOneAndUpdate(
            { _id: new ObjectId(slug) },
            { $set: updateData },
            { returnDocument: 'after' }
          );
      }
    } else {
      // Otherwise treat as slug
      result = await db
        .collection<Restaurant>(COLLECTION_NAME)
        .findOneAndUpdate(
          { slug },
          { $set: updateData },
          { returnDocument: 'after' }
        );
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to update restaurant' },
      { status: 500 }
    );
  }
}

// DELETE restaurant by slug or ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    let result = null;

    // If numeric, treat as ID
    if (isNumeric(slug)) {
      result = await db
        .collection<Restaurant>(COLLECTION_NAME)
        .deleteOne({ id: parseInt(slug) });

      // If not found by custom id, try by MongoDB _id
      if (result.deletedCount === 0 && ObjectId.isValid(slug)) {
        result = await db
          .collection<Restaurant>(COLLECTION_NAME)
          .deleteOne({ _id: new ObjectId(slug) });
      }
    } else {
      // Otherwise treat as slug
      result = await db
        .collection<Restaurant>(COLLECTION_NAME)
        .deleteOne({ slug });
    }

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Restaurant deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to delete restaurant' },
      { status: 500 }
    );
  }
}

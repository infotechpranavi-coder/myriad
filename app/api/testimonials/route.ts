import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Testimonial } from '@/lib/models/testimonial';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'testimonials';

// GET - Fetch all testimonials
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const testimonials = await db
      .collection<Testimonial>(COLLECTION_NAME)
      .find({})
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST - Create a new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Get the highest order number
    const lastTestimonial = await db
      .collection<Testimonial>(COLLECTION_NAME)
      .findOne({}, { sort: { order: -1 } });

    const newTestimonial: Testimonial = {
      name: body.name,
      role: body.role || '',
      quote: body.quote,
      rating: body.rating || 5,
      image: body.image || '',
      email: body.email || undefined,
      phone: body.phone || undefined,
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: lastTestimonial ? lastTestimonial.order + 1 : 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Testimonial>(COLLECTION_NAME).insertOne(newTestimonial);

    return NextResponse.json(
      { ...newTestimonial, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}

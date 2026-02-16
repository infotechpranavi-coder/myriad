import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Proposal } from '@/lib/models/proposal';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'proposals';

// GET all proposals
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const proposals = await db
      .collection<Proposal>(COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(proposals, { status: 200 });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}

// POST create a new proposal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const proposalData: Proposal = {
      firstName: body.firstName,
      lastName: body.lastName,
      mobileNumber: body.mobileNumber,
      alternateContactNumber: body.alternateContactNumber,
      eventType: body.eventType,
      eventTypeOther: body.eventTypeOther,
      eventDate: body.eventDate,
      eventTiming: body.eventTiming,
      foodPreference: body.foodPreference,
      foodPreferenceOther: body.foodPreferenceOther,
      alcoholRequired: body.alcoholRequired,
      expectedGuests: body.expectedGuests,
      roomsRequired: body.roomsRequired,
      numberOfRooms: body.numberOfRooms,
      additionalRequirements: body.additionalRequirements,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection<Proposal>(COLLECTION_NAME)
      .insertOne(proposalData);

    return NextResponse.json(
      { ...proposalData, _id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to create proposal' },
      { status: 500 }
    );
  }
}

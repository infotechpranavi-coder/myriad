import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Proposal } from '@/lib/models/proposal';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'proposals';

// GET a single proposal
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid proposal ID' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const proposal = await db
      .collection<Proposal>(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(proposal, { status: 200 });
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposal' },
      { status: 500 }
    );
  }
}

// PUT update a proposal
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid proposal ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const updateData: Partial<Proposal> = {
      updatedAt: new Date(),
    };

    if (body.firstName !== undefined) updateData.firstName = body.firstName;
    if (body.lastName !== undefined) updateData.lastName = body.lastName;
    if (body.mobileNumber !== undefined) updateData.mobileNumber = body.mobileNumber;
    if (body.alternateContactNumber !== undefined) updateData.alternateContactNumber = body.alternateContactNumber;
    if (body.eventType !== undefined) updateData.eventType = body.eventType;
    if (body.eventTypeOther !== undefined) updateData.eventTypeOther = body.eventTypeOther;
    if (body.eventDate !== undefined) updateData.eventDate = body.eventDate;
    if (body.eventTiming !== undefined) updateData.eventTiming = body.eventTiming;
    if (body.foodPreference !== undefined) updateData.foodPreference = body.foodPreference;
    if (body.foodPreferenceOther !== undefined) updateData.foodPreferenceOther = body.foodPreferenceOther;
    if (body.alcoholRequired !== undefined) updateData.alcoholRequired = body.alcoholRequired;
    if (body.expectedGuests !== undefined) updateData.expectedGuests = body.expectedGuests;
    if (body.roomsRequired !== undefined) updateData.roomsRequired = body.roomsRequired;
    if (body.numberOfRooms !== undefined) updateData.numberOfRooms = body.numberOfRooms;
    if (body.additionalRequirements !== undefined) updateData.additionalRequirements = body.additionalRequirements;
    if (body.status !== undefined) updateData.status = body.status;

    const result = await db
      .collection<Proposal>(COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    const updatedProposal = await db
      .collection<Proposal>(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });

    return NextResponse.json(updatedProposal, { status: 200 });
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to update proposal' },
      { status: 500 }
    );
  }
}

// DELETE a proposal
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid proposal ID' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const result = await db
      .collection<Proposal>(COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Proposal deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json(
      { error: 'Failed to delete proposal' },
      { status: 500 }
    );
  }
}

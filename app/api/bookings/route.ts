import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { syncBookingToBookingjini } from '@/lib/bookingjini';
import { Booking } from '@/lib/models/booking';
import { Room } from '@/lib/models/room';

const DB_NAME = 'hotel_db';
const BOOKINGS_COLLECTION = 'bookings';
const ROOMS_COLLECTION = 'rooms';

// GET all bookings
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const bookings = await db
      .collection<Booking>(BOOKINGS_COLLECTION)
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
      .collection<Booking>(BOOKINGS_COLLECTION)
      .insertOne(bookingData);

    let bookingjiniRoomTypeId: number | undefined;
    if (bookingData.roomId) {
      const room = await db.collection<Room>(ROOMS_COLLECTION).findOne({
        $or: [{ id: bookingData.roomId }, { _id: bookingData.roomId }],
      });
      bookingjiniRoomTypeId = room?.bookingjiniRoomTypeId;
    }

    const syncResult = await syncBookingToBookingjini(bookingData, {
      bookingjiniRoomTypeId,
    });

    const syncUpdates: Partial<Booking> = {
      updatedAt: new Date(),
    };

    if (syncResult.success && syncResult.invoiceId) {
      syncUpdates.bookingjiniInvoiceId = syncResult.invoiceId;
      syncUpdates.bookingjiniSyncError = undefined;
    } else if (syncResult.error) {
      syncUpdates.bookingjiniSyncError = syncResult.error;
    }

    if (syncResult.success || syncResult.error) {
      await db.collection<Booking>(BOOKINGS_COLLECTION).updateOne(
        { _id: result.insertedId },
        { $set: syncUpdates }
      );
    }

    const savedBooking = {
      ...bookingData,
      _id: result.insertedId,
      ...syncUpdates,
    };

    return NextResponse.json(savedBooking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

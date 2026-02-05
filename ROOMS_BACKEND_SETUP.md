# Rooms Backend Setup Guide

This guide explains how to set up and use the MongoDB backend for managing rooms.

## Prerequisites

1. MongoDB connection string is configured in `.env.local`
2. Node.js and pnpm are installed

## Initial Setup

### 1. Seed the Database

First, populate your MongoDB database with initial room data:

```bash
pnpm run seed:rooms
```

This will:
- Create a database named `hotel_db`
- Create a collection named `rooms`
- Insert the default room types from `lib/room-data.ts`

### 2. Start the Development Server

```bash
pnpm dev
```

## API Endpoints

### GET `/api/rooms`
Fetch all rooms

**Response:**
```json
[
  {
    "_id": "...",
    "id": "1",
    "name": "Deluxe Room",
    "description": "...",
    "price": 4230,
    "oldPrice": 5500,
    "images": ["/rooms/deluxe.png"],
    "amenities": ["Double Bed", "WiFi"],
    "capacity": "2 Guests",
    "size": "150 sq ft",
    "highlights": ["Free Cancellation"],
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### GET `/api/rooms/[id]`
Fetch a single room by ID

### POST `/api/rooms`
Create a new room

**Request Body:**
```json
{
  "id": "4",
  "name": "Premium Suite",
  "description": "...",
  "price": 8000,
  "oldPrice": 10000,
  "images": ["/rooms/premium.png"],
  "amenities": ["King Bed", "WiFi"],
  "capacity": "3 Guests",
  "size": "300 sq ft",
  "highlights": ["Free Cancellation"]
}
```

### PUT `/api/rooms/[id]`
Update an existing room

### DELETE `/api/rooms/[id]`
Delete a room

## Using the Dashboard

1. Navigate to `/dashboard/rooms`
2. Click "Add Room" to create a new room
3. Click "Edit" on any room card to modify it
4. Click "Delete" to remove a room

All changes are saved to MongoDB and will persist across page refreshes.

## Frontend Pages

- `/rooms` - Lists all rooms (fetches from API)
- `/rooms/[id]` - Shows room details (fetches from API)

## Database Structure

**Database:** `hotel_db`  
**Collection:** `rooms`

**Room Schema:**
```typescript
{
  _id?: string;           // MongoDB ObjectId
  id: string;             // Custom room ID
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  amenities: string[];
  capacity: string;
  size: string;
  highlights?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
```

## Troubleshooting

### Rooms not showing?
1. Make sure MongoDB connection string is correct in `.env.local`
2. Run `pnpm run seed:rooms` to populate initial data
3. Check browser console for API errors

### API errors?
1. Verify MongoDB connection string
2. Check that the database and collection exist
3. Review server logs for detailed error messages

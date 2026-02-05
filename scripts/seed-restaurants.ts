import 'dotenv/config';
import clientPromise from '../lib/mongodb';
import { restaurants } from '../lib/restaurant-data';
import { Restaurant } from '../lib/models/restaurant';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'restaurants';

async function seedRestaurants() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Clear existing restaurants
    await db.collection(COLLECTION_NAME).deleteMany({});

    // Insert restaurants
    const restaurantsToInsert: Restaurant[] = restaurants.map((restaurant) => ({
      ...restaurant,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await db
      .collection<Restaurant>(COLLECTION_NAME)
      .insertMany(restaurantsToInsert);

    console.log(`✅ Successfully seeded ${result.insertedCount} restaurants`);
  } catch (error) {
    console.error('❌ Error seeding restaurants:', error);
    process.exit(1);
  }
}

seedRestaurants();

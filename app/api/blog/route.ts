import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { BlogPost } from '@/lib/models/blog';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'blog_posts';

// GET - Fetch all blog posts
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const posts = await db
      .collection<BlogPost>(COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const newPost: BlogPost = {
      title: body.title,
      excerpt: body.excerpt || '',
      author: body.author,
      date: body.date,
      category: body.category || '',
      status: body.status || 'draft',
      image: body.image || '/hero.jpg',
      images: body.images || [body.image || '/hero.jpg'],
      readTime: body.readTime || '5 min read',
      content: body.content || '',
      sections: body.sections || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<BlogPost>(COLLECTION_NAME).insertOne(newPost);

    return NextResponse.json(
      { ...newPost, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

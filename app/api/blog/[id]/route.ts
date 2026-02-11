import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { BlogPost } from '@/lib/models/blog';

const DB_NAME = 'hotel_db';
const COLLECTION_NAME = 'blog_posts';

// GET - Fetch a single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const post = await db.collection<BlogPost>(COLLECTION_NAME).findOne({
      _id: new ObjectId(id),
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT - Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Resolve params first (Next.js 15+ uses Promise)
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Connect to database
    let client;
    try {
      client = await clientPromise;
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const db = client.db(DB_NAME);

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid blog post ID format' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.title || !body.author) {
      return NextResponse.json(
        { error: 'Title and Author are required' },
        { status: 400 }
      );
    }

    // Validate sections structure
    let sections = [];
    if (body.sections && Array.isArray(body.sections)) {
      sections = body.sections.filter((section: any) => {
        return section && 
               typeof section === 'object' && 
               typeof section.title === 'string' &&
               Array.isArray(section.descriptions);
      }).map((section: any) => ({
        title: section.title || '',
        descriptions: Array.isArray(section.descriptions) 
          ? section.descriptions.filter((desc: any) => typeof desc === 'string')
          : []
      }));
    }

    const updateData: any = {
      title: body.title,
      excerpt: body.excerpt || '',
      author: body.author,
      date: body.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      image: body.image || '/hero.jpg',
      images: Array.isArray(body.images) ? body.images : (body.image ? [body.image] : []),
      readTime: body.readTime || '5 min read',
      content: body.content || '',
      sections: sections,
      updatedAt: new Date(),
    };

    // Only update category and status if they exist in the body
    if (body.category !== undefined) {
      updateData.category = body.category;
    }
    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    console.log('Updating blog post:', { id, updateData });

    // Perform update
    let result;
    try {
      result = await db.collection<BlogPost>(COLLECTION_NAME).updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
    } catch (updateError) {
      console.error('MongoDB update error:', updateError);
      return NextResponse.json(
        { error: `Database update failed: ${updateError instanceof Error ? updateError.message : 'Unknown error'}` },
        { status: 500 }
      );
    }

    console.log('Update result:', {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      acknowledged: result.acknowledged,
    });

    if (result.matchedCount === 0) {
      console.error('Blog post not found with id:', id);
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      // Document was found but not modified (no changes)
      console.log('No changes detected for blog post:', id);
      return NextResponse.json({ 
        success: true, 
        message: 'No changes detected' 
      });
    }

    console.log('Blog post updated successfully:', id);
    return NextResponse.json({ 
      success: true,
      message: 'Blog post updated successfully'
    });
  } catch (error) {
    console.error('Unexpected error updating blog post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update blog post';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error stack:', errorStack);
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorStack ? 'Check server logs for details' : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db.collection<BlogPost>(COLLECTION_NAME).deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const leakId = searchParams.get('leakId');

    if (!leakId || !ObjectId.isValid(leakId)) {
      return NextResponse.json({ error: 'Invalid leak ID' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const comments = await db
      .collection('comments')
      .find({ leakId: new ObjectId(leakId) })
      .sort({ createdAt: -1 })
      .toArray();

    // Enrich with user data
    const enrichedComments = await Promise.all(
      comments.map(async (comment) => {
        const commentUser = await db.collection('users').findOne({ _id: comment.userId });
        return {
          ...comment,
          _id: comment._id.toString(),
          leakId: comment.leakId.toString(),
          userId: comment.userId.toString(),
          username: commentUser?.username
        };
      })
    );

    return NextResponse.json({ comments: enrichedComments });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { leakId, rating, comment } = await request.json();

    if (!leakId || !rating || !comment) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!ObjectId.isValid(leakId)) {
      return NextResponse.json({ error: 'Invalid leak ID' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Check if leak exists
    const leak = await db.collection('leaks').findOne({ _id: new ObjectId(leakId) });
    if (!leak) {
      return NextResponse.json({ error: 'Leak not found' }, { status: 404 });
    }

    const result = await db.collection('comments').insertOne({
      leakId: new ObjectId(leakId),
      userId: new ObjectId(user.id),
      rating,
      comment,
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      commentId: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

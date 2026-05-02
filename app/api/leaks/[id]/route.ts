import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const leakId = params.id;

    if (!ObjectId.isValid(leakId)) {
      return NextResponse.json({ error: 'Invalid leak ID' }, { status: 400 });
    }

    // Increment view count
    await db.collection('leaks').updateOne(
      { _id: new ObjectId(leakId) },
      { $inc: { views: 1 } }
    );

    // Get leak details
    const leak = await db.collection('leaks').findOne({ _id: new ObjectId(leakId) });

    if (!leak) {
      return NextResponse.json({ error: 'Leak not found' }, { status: 404 });
    }

    // Get user and category info
    const leakUser = await db.collection('users').findOne({ _id: leak.userId });
    const category = await db.collection('categories').findOne({ _id: leak.categoryId });

    // Get similar leaks (same category, limit 5)
    const similarLeaks = await db
      .collection('leaks')
      .find({
        categoryId: leak.categoryId,
        _id: { $ne: leak._id }
      })
      .sort({ views: -1 })
      .limit(5)
      .toArray();

    const enrichedSimilarLeaks = await Promise.all(
      similarLeaks.map(async (similar) => {
        const similarUser = await db.collection('users').findOne({ _id: similar.userId });
        const similarCategory = await db.collection('categories').findOne({ _id: similar.categoryId });
        return {
          ...similar,
          _id: similar._id.toString(),
          userId: similar.userId.toString(),
          categoryId: similar.categoryId.toString(),
          username: similarUser?.username,
          categoryName: similarCategory?.name,
          categorySlug: similarCategory?.slug
        };
      })
    );

    const enrichedLeak = {
      ...leak,
      _id: leak._id.toString(),
      userId: leak.userId.toString(),
      categoryId: leak.categoryId.toString(),
      username: leakUser?.username,
      categoryName: category?.name,
      categorySlug: category?.slug
    };

    return NextResponse.json({
      leak: enrichedLeak,
      similarLeaks: enrichedSimilarLeaks
    });
  } catch (error) {
    console.error('Get leak error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

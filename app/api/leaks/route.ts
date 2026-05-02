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
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const { db } = await connectToDatabase();

    // Construire le filtre
    const filter: any = {};
    if (category) {
      const categoryDoc = await db.collection('categories').findOne({ slug: category });
      if (categoryDoc) {
        filter.categoryId = categoryDoc._id;
      }
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Récupérer les leaks
    const leaks = await db
      .collection('leaks')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    // Enrichir avec les données utilisateur et catégorie
    const enrichedLeaks = await Promise.all(
      leaks.map(async (leak) => {
        const user = await db.collection('users').findOne({ _id: leak.userId });
        const category = await db.collection('categories').findOne({ _id: leak.categoryId });
        return {
          ...leak,
          _id: leak._id.toString(),
          userId: leak.userId.toString(),
          categoryId: leak.categoryId.toString(),
          username: user?.username,
          categoryName: category?.name,
          categorySlug: category?.slug
        };
      })
    );

    return NextResponse.json({ leaks: enrichedLeaks });
  } catch (error) {
    console.error('Get leaks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { title, message, link, image, categoryId } = await request.json();

    if (!title || !message || !link || !categoryId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const result = await db.collection('leaks').insertOne({
      userId: new ObjectId(user.id),
      categoryId: new ObjectId(categoryId),
      title,
      message,
      link,
      image: image || null,
      views: 0,
      downloads: 0,
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      leakId: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Create leak error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

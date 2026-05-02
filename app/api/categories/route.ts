import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    const categories = await db
      .collection('categories')
      .find({})
      .sort({ name: 1 })
      .toArray();

    const formattedCategories = categories.map(cat => ({
      ...cat,
      _id: cat._id.toString()
    }));

    return NextResponse.json({ categories: formattedCategories });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

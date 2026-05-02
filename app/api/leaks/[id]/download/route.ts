import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function POST(
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

    // Increment download count
    const result = await db.collection('leaks').updateOne(
      { _id: new ObjectId(leakId) },
      { $inc: { downloads: 1 } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Leak not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Download tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

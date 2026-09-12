import { NextRequest, NextResponse } from 'next/server';
import { queryLiveLeaderboard } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 100;

    const shops = queryLiveLeaderboard(state, limit);

    return NextResponse.json({
      success: true,
      count: shops.length,
      data: shops,
    });
  } catch (error) {
    console.error('Error in /api/analytics/shops/leaderboard:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

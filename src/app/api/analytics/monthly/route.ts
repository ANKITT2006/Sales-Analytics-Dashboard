import { NextRequest, NextResponse } from 'next/server';
import { queryLiveTimeline, filterMonthlyByDateRange, INDIAN_STATE_MAP } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'ALL';
    const dateRange = searchParams.get('dateRange') || 'all';

    const points = queryLiveTimeline(state, dateRange);
    const filtered = filterMonthlyByDateRange(points, dateRange);

    const regionName = state !== 'ALL' ? (INDIAN_STATE_MAP[state] || state) : 'All India';

    return NextResponse.json({
      success: true,
      region: regionName,
      dateRange,
      data: filtered,
    });
  } catch (error) {
    console.error('Error in /api/analytics/monthly:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

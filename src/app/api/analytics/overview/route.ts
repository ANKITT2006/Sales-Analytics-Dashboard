import { NextRequest, NextResponse } from 'next/server';
import { queryDynamicOverview } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'ALL';
    const dateRange = searchParams.get('dateRange') || '2y';

    const result = queryDynamicOverview(state, dateRange);

    return NextResponse.json({
      success: true,
      region: result.region,
      state_code: state,
      dateRange,
      data: result.data,
    });
  } catch (error) {
    console.error('Error in /api/analytics/overview:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

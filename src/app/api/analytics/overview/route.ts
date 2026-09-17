import { NextRequest, NextResponse } from 'next/server';
import { queryDynamicOverview } from '@/lib/analytics';
import { verifyAuth } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'ALL';
    const dateRange = searchParams.get('dateRange') || '2y';
    const retrain = searchParams.get('retrain');

    // Store sync / retrain requires authentication
    if (retrain === 'true') {
      const auth = await verifyAuth(request);
      if (!auth.authenticated) {
        return NextResponse.json(
          {
            success: false,
            error: 'Authentication Required. Please sign in to synchronize store.',
          },
          { status: 401 }
        );
      }
    }

    const result = await queryDynamicOverview(state, dateRange);

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

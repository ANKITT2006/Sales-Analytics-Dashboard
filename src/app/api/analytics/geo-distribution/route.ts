import { NextResponse } from 'next/server';
import { queryLiveStateDistribution } from '@/lib/analytics';

export async function GET() {
  try {
    const distribution = await queryLiveStateDistribution();

    return NextResponse.json({
      success: true,
      total_states: distribution.length,
      data: distribution,
    });
  } catch (error) {
    console.error('Error in /api/analytics/geo-distribution:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

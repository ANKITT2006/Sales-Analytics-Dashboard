import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { verifyAuth } from '@/lib/supabase/server';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    // 1. Enforce Server-Side Authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication Required. Please sign in to access data ingestion and store synchronization.",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No CSV file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'scripts', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const tempFilePath = path.join(uploadsDir, `upload_${Date.now()}.csv`);
    fs.writeFileSync(tempFilePath, buffer);

    // Ingest data via Python script
    const pythonCmd = `python "${path.join(process.cwd(), 'scripts', 'ingest_sales.py')}" --csv "${tempFilePath}"`;
    const { stdout: ingestOutput } = await execAsync(pythonCmd);

    // Retrain the ML model on new combined data
    const trainCmd = `python "${path.join(process.cwd(), 'ml', 'train.py')}"`;
    await execAsync(trainCmd);

    // Clean up temp file
    try {
      fs.unlinkSync(tempFilePath);
    } catch {
      // Ignore
    }

    return NextResponse.json({
      success: true,
      message: 'Store transaction logs ingested, validated, and ML model retrained.',
      details: ingestOutput,
    });
  } catch (error: unknown) {
    console.error('Error in /api/analytics/upload:', error);
    const msg = error instanceof Error ? error.message : 'Upload processing failed';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

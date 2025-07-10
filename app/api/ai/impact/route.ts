import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/ai/enhanced-impact/${userId}`, {
      headers: {
        'Authorization': request.headers.get('Authorization') || ''
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch impact data');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Impact API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch impact data' },
      { status: 500 }
    );
  }
}

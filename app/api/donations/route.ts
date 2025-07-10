import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '10';
    
    // Forward request to backend server
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/donations?lat=${lat}&lng=${lng}&radius=${radius}`, {
      headers: {
        'Authorization': request.headers.get('Authorization') || ''
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch donations');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Forward multipart form data to backend
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/donations`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': request.headers.get('Authorization') || ''
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create donation' },
      { status: 500 }
    );
  }
}

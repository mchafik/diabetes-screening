import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const API_ENDPOINT = 'https://api.hirassa.com/diabetes-screening/get-pharmacies';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');

    if (!city) {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.DIABETES_SCREENING_API_KEY;

    if (!apiKey) {
      console.warn('DIABETES_SCREENING_API_KEY is not configured');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const url = `${API_ENDPOINT}?city='${city}'`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching pharmacies from API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pharmacies' },
      { status: 500 }
    );
  }
}

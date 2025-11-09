import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const API_ENDPOINT = 'https://api.hirassa.com/diabetes-screening/get-pharmacies';

export async function GET(request: NextRequest) {
  console.log('=== API Route Called ===');

  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    console.log('City parameter received:', city);

    if (!city) {
      console.error('ERROR: No city parameter provided');
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.DIABETES_SCREENING_API_KEY;
    console.log('API Key configured:', apiKey ? 'YES (length: ' + apiKey.length + ')' : 'NO');

    if (!apiKey) {
      console.error('ERROR: DIABETES_SCREENING_API_KEY is not configured');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const url = `${API_ENDPOINT}?city=${city}`;
    console.log('Fetching from URL:', url);
    console.log('Request headers:', {
      'x-api-key': apiKey.substring(0, 5) + '...',
      'Content-Type': 'application/json',
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Data received successfully. Number of pharmacies:', Array.isArray(data) ? data.length : 'N/A');
    console.log('First pharmacy sample:', data[0] ? JSON.stringify(data[0]) : 'No data');

    return NextResponse.json(data);
  } catch (error) {
    console.error('=== ERROR in API Route ===');
    console.error('Error details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pharmacies', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

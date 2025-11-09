interface Pharmacy {
  pharmacyNameLatin: string;
  pharmacyNameArabic: string;
  cityCode: string;
  pharmacyPhone: string;
  addressLatin: string;
  addressArabic: string;
  latitude: number;
  longitude: number;
}

const API_ENDPOINT = 'https://api.hirassa.com/diabetes-screening';

export async function fetchPharmaciesByCity(city: string): Promise<Pharmacy[]> {
  try {
    const apiKey = process.env.DIABETES_SCREENING_API_KEY;

    if (!apiKey) {
      console.warn('NEXT_PUBLIC_API_KEY is not configured');
      throw new Error('API key not configured');
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
    return data;
  } catch (error) {
    console.error('Error fetching pharmacies from API:', error);
    throw error;
  }
}

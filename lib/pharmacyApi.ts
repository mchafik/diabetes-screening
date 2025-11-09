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

export async function fetchPharmaciesByCity(city: string): Promise<Pharmacy[]> {
  console.log('=== Client: Fetching Pharmacies ===');
  console.log('City requested:', city);

  try {
    const url = `/api/pharmacies?city=${encodeURIComponent(city)}`;
    console.log('Client: Calling URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Client: Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Client: Error response data:', errorData);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Client: Data received successfully');
    console.log('Client: Number of pharmacies:', Array.isArray(data) ? data.length : 'N/A');
    console.log('Client: First pharmacy:', data[0]);

    return data;
  } catch (error) {
    console.error('=== Client: Error fetching pharmacies ===');
    console.error('Error details:', error);
    throw error;
  }
}

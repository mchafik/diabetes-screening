# API Integration Guide

## Diabetes Screening Pharmacies API

This application integrates with an external API to fetch pharmacy data for diabetes screening locations.

### API Configuration

**Endpoint:** `https://the-best.api.com/diabetes-screening`

**Authentication Method:** HTTP Header
**Header Name:** `x-api-key`
**Header Value:** Your secret API key

### Setup Instructions

1. **Configure API Key in Vercel**

   In your Vercel project settings:

   - Go to **Settings** → **Environment Variables**
   - Add a new environment variable:
     - **Name:** `DIABETES_SCREENING_API_KEY`
     - **Value:** Your actual API key
     - **Environment:** Production, Preview, Development (select all)
   - Click **Save**
   - Redeploy your application

2. **Local Development (Optional)**

   For local testing, you can create a `.env.local` file:

   ```
   DIABETES_SCREENING_API_KEY=your_actual_api_key_here
   ```

   ⚠️ **Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

3. **Architecture**

   The application uses a secure server-side API route (`/app/api/pharmacies/route.ts`) to proxy requests to the external API. This keeps your API key secure on the server and prevents it from being exposed in the client-side bundle.

   **Request Flow:**
   ```
   Browser → Next.js API Route (/api/pharmacies) → External API
   ```

   The `DIABETES_SCREENING_API_KEY` environment variable is only accessible on the server side, ensuring it never gets exposed to the browser.

### API Request Format

The application makes requests to the API with the following format:

```
GET https://the-best.api.com/diabetes-screening?city='[CITY_CODE]'
Headers:
  x-api-key: [YOUR_API_KEY]
  Content-Type: application/json
```

### Query Parameters

- **city** (required): City code to filter pharmacies
  - Format: String wrapped in single quotes
  - Example: `?city='CASABLANCA'`

### Supported City Codes

The application supports filtering by the following city codes:
- `CASABLANCA`
- `RABAT`
- `MARRAKECH`
- `FES`
- `TANGIER`
- `AGADIR`
- `MEKNES`
- `OUJDA`
- `KENITRA`
- `TETOUAN`
- `SAFI`
- `ESSAOUIRA`
- `TAROUDANT`

### Expected Response Format

The API should return an array of pharmacy objects with the following structure:

```json
[
  {
    "pharmacyNameLatin": "Atlas Pharmacy",
    "pharmacyNameArabic": "صيدلية أطلس",
    "cityCode": "CASABLANCA",
    "pharmacyPhone": "+212 522 123456",
    "addressLatin": "123 Boulevard Mohammed V, Casablanca",
    "addressArabic": "123 شارع محمد الخامس، الدار البيضاء",
    "latitude": 33.5898,
    "longitude": -7.6187
  }
]
```

### Implementation Details

The API integration uses two layers:

1. **Client-side helper** (`/lib/pharmacyApi.ts`):
   ```typescript
   import { fetchPharmaciesByCity } from '@/lib/pharmacyApi';

   // Usage in component
   const data = await fetchPharmaciesByCity('CASABLANCA');
   ```

2. **Server-side API route** (`/app/api/pharmacies/route.ts`):
   - Securely stores and uses the API key
   - Proxies requests to the external API
   - Handles authentication and error responses

### Fallback Mechanism

The application includes a fallback mechanism that uses mock data if:
- The API key is not configured
- The API request fails
- Network connectivity issues occur

This ensures the application continues to function even when the external API is unavailable.

### Error Handling

The application handles various error scenarios:

1. **Missing API Key**: Logs a warning and falls back to mock data
2. **Network Errors**: Catches exceptions and uses fallback data
3. **Invalid Response**: Falls back to mock data if response is not OK

All errors are logged to the browser console for debugging purposes.

### Testing the Integration

1. **Without API Key** (Uses fallback data):
   - Don't set the `DIABETES_SCREENING_API_KEY` environment variable
   - The app will use mock pharmacy data

2. **With API Key** (Uses live data):
   - Set `DIABETES_SCREENING_API_KEY` in Vercel environment variables
   - For local testing, add it to `.env.local`
   - Restart the development server
   - The app will fetch live data from the API

### Development vs Production

**Development:**
```bash
npm run dev
```
API calls go through the Next.js API route at `/api/pharmacies`.

**Production Build:**
```bash
npm run build
npm start
```
The API route securely handles all external API requests. The API key is never exposed to the client.

### Security Considerations

✅ **Secure Implementation:**

This application uses a secure server-side proxy pattern:

1. **API Key Security**: The `DIABETES_SCREENING_API_KEY` is stored securely on the server and never exposed to the browser.

2. **Server-Side Proxy**: All external API requests are routed through the Next.js API route (`/app/api/pharmacies/route.ts`), which:
   - Keeps the API key server-side only
   - Prevents unauthorized access to the external API
   - Allows you to implement additional rate limiting if needed
   - Provides a centralized place for API error handling

3. **Best Practices**:
   - Never commit API keys to version control
   - Use environment variables for all sensitive data
   - Monitor API usage through your provider's dashboard

### Troubleshooting

**Problem: No data appearing**
- Check if `DIABETES_SCREENING_API_KEY` is configured in Vercel environment variables
- Check browser console for error messages
- Check server logs in Vercel for API route errors
- Verify network connectivity to the API endpoint
- For local development, ensure `.env.local` exists with the API key

**Problem: CORS errors**
- The external API must allow requests from your domain
- Contact the API provider about CORS configuration

**Problem: Authentication errors**
- Verify your API key is valid and active
- Check if the API key has the necessary permissions
- Ensure the header name is exactly `x-api-key`

### Support

For issues related to:
- **API Access**: Contact the diabetes screening API provider
- **Application Code**: Check the codebase documentation
- **Configuration**: Review this guide and the `.env.example` file

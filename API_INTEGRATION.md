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
     - **Name:** `NEXT_PUBLIC_API_KEY`
     - **Value:** Your actual API key
     - **Environment:** Production, Preview, Development (select all)
   - Click **Save**
   - Redeploy your application

2. **Local Development (Optional)**

   For local testing, you can create a `.env.local` file:

   ```
   NEXT_PUBLIC_API_KEY=your_actual_api_key_here
   ```

   ⚠️ **Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

3. **Environment Variables**

   The application uses the `NEXT_PUBLIC_API_KEY` environment variable. The `NEXT_PUBLIC_` prefix is required because this is a static export application that runs entirely in the browser. The API key will be included in the client-side bundle.

   > **Security Note:** For production applications handling sensitive data, consider implementing a backend proxy to keep API keys secure.

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

The API integration is handled in `/lib/pharmacyApi.ts`:

```typescript
import { fetchPharmaciesByCity } from '@/lib/pharmacyApi';

// Usage in component
const data = await fetchPharmaciesByCity('CASABLANCA');
```

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
   - Don't set the `NEXT_PUBLIC_API_KEY` environment variable
   - The app will use mock pharmacy data

2. **With API Key** (Uses live data):
   - Set `NEXT_PUBLIC_API_KEY` in Vercel environment variables
   - For local testing, add it to `.env.local`
   - Restart the development server
   - The app will fetch live data from the API

### Development vs Production

**Development:**
```bash
npm run dev
```
API calls are made directly from the browser to the external API.

**Production Build:**
```bash
npm run build
npm start
```
The static export includes the API key in the bundle. All requests are client-side.

### Security Considerations

⚠️ **Important Security Notes:**

1. **Client-Side API Keys**: This implementation exposes the API key in the client-side JavaScript bundle. This is suitable for:
   - Public APIs with rate limiting
   - APIs with IP restrictions
   - Development and testing environments

2. **Production Recommendations**:
   - Implement a backend proxy server to hide API keys
   - Use authentication tokens with short expiration
   - Implement rate limiting on your backend
   - Monitor API usage for unusual patterns

3. **Alternative Architecture** (More Secure):
   ```
   Browser → Your Backend API → External API
   ```
   This keeps the API key secure on your server.

### Troubleshooting

**Problem: No data appearing**
- Check if `NEXT_PUBLIC_API_KEY` is configured in Vercel environment variables
- Check browser console for error messages
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

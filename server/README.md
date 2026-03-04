# CropHub Backend API

Complete Node.js + Express backend for the CropHub Agricultural Decision Support System.

## Architecture Overview

- **Framework**: Node.js with Express
- **Database**: Supabase (PostgreSQL)
- **Cloud Storage**: AWS S3 for soil images
- **Authentication**: JWT with bcrypt password hashing
- **Encryption**: AES-256-CBC for financial data (budget, profit)
- **Validation**: Zod schemas
- **Rate Limiting**: Rate-limiter-flexible

## API Endpoints

### Authentication (`/api/auth`)

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`
Login to existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** Same as register

---

### Terra Layer - Soil Diagnostics (`/api/terra`)

#### POST `/api/terra/analyze`
Upload and analyze soil image using AI.

**Headers:**
- `Authorization: Bearer {token}`

**Request:** Multipart form-data
- `soilImage`: Image file (JPEG, PNG, max 10MB)

**Response:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://s3.amazonaws.com/...",
    "analysis": {
      "soilType": "Loamy Soil",
      "nitrogen": 65,
      "phosphorus": 42,
      "potassium": 78,
      "ph": 6.5,
      "composition": {
        "sand": 40,
        "silt": 35,
        "clay": 25
      },
      "recommendations": [
        "Soil is excellent for most crops",
        "Consider adding nitrogen-rich fertilizers"
      ]
    }
  }
}
```

#### GET `/api/terra/history`
Get user's soil analysis history.

**Headers:**
- `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "image_url": "https://...",
      "soil_type": "Loamy Soil",
      "analyzed_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Fathom Layer - Crop Optimization (`/api/fathom`)

#### POST `/api/fathom/optimize`
Generate AI-optimized crop allocation plan.

**Headers:**
- `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "budget": 500000,
  "landSize": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "crops": [
      {
        "name": "Maize",
        "acres": 3.0,
        "budget": 150000,
        "color": "hsl(38, 92%, 50%)",
        "expectedYield": 16.5,
        "roi": 15
      }
    ],
    "totalBudget": 500000,
    "totalLand": 10
  }
}
```

#### GET `/api/fathom/history`
Get user's crop plan history.

**Headers:**
- `Authorization: Bearer {token}`

---

### Logistics - Market Arbitrage (`/api/logistics`)

#### POST `/api/logistics/arbitrage`
Calculate most profitable market for selling crops.

**Headers:**
- `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "cropType": "wheat",
  "weightTons": 5,
  "farmLocation": {
    "latitude": 28.6139,
    "longitude": 77.2090
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "markets": [
      {
        "name": "Krishi Bazaar",
        "price": 2820,
        "distance": 8,
        "transport": 500,
        "rent": 150,
        "profit": 2170
      }
    ],
    "bestMarket": {
      "name": "Krishi Bazaar",
      "profit": 2170
    },
    "cropType": "wheat",
    "weightTons": 5
  }
}
```

#### GET `/api/logistics/history`
Get user's market analysis history.

**Headers:**
- `Authorization: Bearer {token}`

---

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in all required values:

```bash
cp .env.example .env
```

**Required Environment Variables:**

- **Supabase**: Get from your Supabase project dashboard
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

- **JWT Secret**: Generate a secure random string (32+ characters)
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- **Encryption Keys**:
  - `ENCRYPTION_KEY`: Exactly 32 characters
  - `ENCRYPTION_IV`: Exactly 16 characters
  ```bash
  # Generate encryption key (32 chars)
  node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

  # Generate IV (16 chars)
  node -e "console.log(require('crypto').randomBytes(8).toString('hex'))"
  ```

- **AWS S3**: Get from AWS IAM console
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_S3_BUCKET`
  - `AWS_REGION`

- **Google Maps API**: Get from Google Cloud Console
  - `GOOGLE_MAPS_API_KEY`

### 3. Database Setup

The database schema is automatically created via Supabase migration. Tables created:
- `users` - User accounts
- `soil_analyses` - Soil diagnostic results
- `crop_plans` - Crop allocation plans
- `market_analyses` - Market arbitrage calculations

All tables have Row Level Security (RLS) enabled.

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`

Check health: `http://localhost:5000/health`

---

## Security Features

### 1. Password Security
- Passwords hashed using bcrypt with 10 salt rounds
- Never stored in plain text

### 2. Financial Data Encryption
- Budget and profit data encrypted using AES-256-CBC
- Encrypted before database storage
- Decrypted on retrieval

### 3. JWT Authentication
- 7-day token expiration
- Bearer token authentication
- Token includes user ID and email

### 4. Row Level Security (RLS)
- Users can only access their own data
- Enforced at database level via Supabase RLS policies

### 5. Rate Limiting
- 100 requests per minute per IP
- Prevents API abuse

### 6. Input Validation
- All requests validated using Zod schemas
- Type-safe validation with detailed error messages

### 7. CORS Protection
- Configurable allowed origins
- Credentials support

---

## External Service Integration

### 1. Python ML Service (FastAPI)
The backend includes placeholder calls to a Python ML service for:

- **Soil Analysis**: `POST http://localhost:8000/predict-soil`
- **Crop Optimization**: `POST http://localhost:8000/optimize`

**Fallback**: If ML service is unavailable, mock data is returned.

### 2. Google Maps Distance Matrix API
Used for calculating actual distances between farm and markets.

**Fallback**: Haversine formula for distance calculation.

### 3. Market Pricing APIs
Placeholder for real-time market price integration.

**Current**: Uses base prices with random market variations.

---

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Supabase client
│   │   └── aws.ts       # AWS S3 config
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # JWT authentication
│   │   └── validation.ts # Zod validation schemas
│   ├── services/        # Business logic
│   │   ├── auth.service.ts
│   │   ├── terra.service.ts
│   │   ├── fathom.service.ts
│   │   └── logistics.service.ts
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── terra.routes.ts
│   │   ├── fathom.routes.ts
│   │   └── logistics.routes.ts
│   ├── utils/           # Utility functions
│   │   └── encryption.ts # AES encryption
│   └── server.ts        # Express app entry point
├── package.json
├── tsconfig.json
└── .env.example
```

---

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Resource created
- `400` - Validation error
- `401` - Authentication required
- `403` - Forbidden
- `404` - Not found
- `429` - Rate limit exceeded
- `500` - Server error

---

## Testing

Run tests:
```bash
npm test
```

---

## Deployment Considerations

1. **Environment Variables**: Ensure all production secrets are properly configured
2. **HTTPS**: Use HTTPS in production (handled by hosting platform)
3. **Database**: Supabase automatically handles scaling
4. **S3 Bucket**: Configure proper CORS and access policies
5. **Rate Limiting**: Adjust limits based on expected traffic
6. **Monitoring**: Add logging service (e.g., Sentry, LogRocket)
7. **Backups**: Supabase provides automatic backups

---

## Development Tips

1. **Mock ML Service**: The backend gracefully falls back to mock data if ML service is unavailable
2. **Database Inspection**: Use Supabase dashboard to view/edit data
3. **API Testing**: Use Postman or Thunder Client with provided examples
4. **Logs**: Morgan middleware logs all requests in development

---

## Support & Documentation

- **Supabase Docs**: https://supabase.com/docs
- **Express.js Docs**: https://expressjs.com
- **Zod Validation**: https://zod.dev

---

## License

Proprietary - CropHub Agricultural Decision Support System

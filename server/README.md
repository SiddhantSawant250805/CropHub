# CropHub Backend API

Backend API server for the CropHub Agricultural Decision Support System built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Encrypted budget storage using AES-256-CBC
- Soil analysis with image upload to AWS S3
- ML service integration for soil prediction
- Crop planning and optimization
- Market arbitrage analysis
- RESTful API design
- MongoDB with Mongoose ODM

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- AWS S3 account (for image storage)
- Optional: Python ML service running

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`:
   - Set `MONGODB_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a secure random string
   - Set `ENCRYPTION_KEY` (exactly 32 characters)
   - Set `ENCRYPTION_IV` (exactly 16 characters)
   - Configure AWS credentials if using S3
   - Set `CORS_ORIGIN` to your frontend URL

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on port 5000 by default (or the PORT in your .env file).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Soil Analysis (Terra Layer)
- `POST /api/soil/analyze` - Upload and analyze soil image (protected)
- `GET /api/soil` - Get all soil analyses (protected)
- `GET /api/soil/:id` - Get specific soil analysis (protected)

### Crop Planning (Fathom Layer)
- `POST /api/crop/plan` - Create crop plan (protected)
- `GET /api/crop/plans` - Get all crop plans (protected)
- `GET /api/crop/plans/:id` - Get specific crop plan (protected)
- `PATCH /api/crop/plans/:id/status` - Update plan status (protected)

### Market Analysis (Logistics)
- `POST /api/market/analyze` - Analyze markets for crop (protected)
- `GET /api/market/analyses` - Get market analyses (protected)
- `GET /api/market/prices` - Get market prices (protected)

### Health Check
- `GET /api/health` - Check API status

## API Request Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Farmer",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Analyze Soil (with JWT token)
```bash
curl -X POST http://localhost:5000/api/soil/analyze \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "soilImage=@/path/to/soil.jpg"
```

### Create Crop Plan
```bash
curl -X POST http://localhost:5000/api/crop/plan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "budget": 200000,
    "landSize": 15,
    "season": "Kharif 2024"
  }'
```

### Analyze Markets
```bash
curl -X POST http://localhost:5000/api/market/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "cropType": "Maize",
    "weightTons": 5,
    "farmLocation": {
      "type": "Point",
      "coordinates": [77.5946, 12.9716]
    }
  }'
```

## Database Schema

### User
- name, email, password (hashed)
- encryptedBudget (AES-256-CBC encrypted)
- farmLocation (GeoJSON Point)
- landSize

### SoilAnalysis
- user reference
- imageUrl (S3)
- soilType
- analysis (N, P, K, pH, organic matter, moisture)
- composition (topsoil, clay, sand, silt, organic)
- status, mlPredictionData

### CropPlan
- user reference
- budget, landSize
- allocations array (crop allocations)
- summary (totals and profit)
- status, season

### MarketAnalysis
- user reference
- cropType, weightTons
- farmLocation (GeoJSON)
- markets array (market comparison data)
- bestMarket

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Budget encryption with AES-256-CBC
- CORS protection
- Rate limiting
- Helmet.js security headers
- Input validation

## ML Service Integration

The backend expects a Python ML service at `ML_SERVICE_URL` with these endpoints:

- `POST /predict-soil` - Soil image analysis
  - Input: `{ "image_url": "..." }`
  - Output: `{ "soilType", "analysis", "composition" }`

- `POST /optimize-crops` - Crop optimization
  - Input: `{ "budget", "land_size", "preferences" }`
  - Output: `{ "allocations": [...] }`

If the ML service is unavailable, the backend uses fallback algorithms with mock data.

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── soilController.js     # Soil analysis
│   │   ├── cropController.js     # Crop planning
│   │   └── marketController.js   # Market analysis
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   ├── errorHandler.js       # Error handling
│   │   └── upload.js             # File upload (multer)
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── SoilAnalysis.js       # Soil analysis schema
│   │   ├── CropPlan.js           # Crop plan schema
│   │   └── MarketAnalysis.js     # Market analysis schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth routes
│   │   ├── soilRoutes.js         # Soil routes
│   │   ├── cropRoutes.js         # Crop routes
│   │   └── marketRoutes.js       # Market routes
│   ├── services/
│   │   ├── s3Service.js          # AWS S3 operations
│   │   ├── mlService.js          # ML service integration
│   │   └── marketService.js      # Market calculations
│   ├── utils/
│   │   └── encryption.js         # AES encryption/decryption
│   └── server.js                 # Entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT

# CropHub Backend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Set Up MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Your connection string will be:
# mongodb://localhost:27017/crophub
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `MONGODB_URI` in `.env`

### 3. Configure Environment Variables

The `.env` file has been created with development defaults. Update these:

**Required:**
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Change to a secure random string
- `ENCRYPTION_KEY` - Must be exactly 32 characters
- `ENCRYPTION_IV` - Must be exactly 16 characters

**Optional:**
- AWS credentials (if using real S3 storage)
- ML_SERVICE_URL (if you have a Python ML service)

### 4. Generate Secure Keys

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# For ENCRYPTION_KEY (32 chars)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# For ENCRYPTION_IV (16 chars)
node -e "console.log(require('crypto').randomBytes(8).toString('hex'))"
```

### 5. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on http://localhost:5000

### 6. Test the API

```bash
# Health check
curl http://localhost:5000/api/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Farmer",
    "email": "test@crophub.com",
    "password": "password123"
  }'
```

## Architecture Overview

### Database Models

1. **User**
   - Stores user credentials (hashed password)
   - Encrypted budget storage
   - Farm location (GeoJSON)

2. **SoilAnalysis**
   - Links to uploaded soil images
   - Stores NPK values, pH, moisture
   - Soil composition percentages

3. **CropPlan**
   - Crop allocation recommendations
   - Budget and land size optimization
   - Expected profit calculations

4. **MarketAnalysis**
   - Market price comparisons
   - Transport cost calculations
   - True profit analysis

### API Routes

- `/api/auth/*` - Authentication and user management
- `/api/soil/*` - Soil analysis and image upload
- `/api/crop/*` - Crop planning and optimization
- `/api/market/*` - Market analysis and pricing

### Security Features

- JWT-based authentication
- bcrypt password hashing
- AES-256-CBC budget encryption
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet.js security headers

## Integration with Frontend

The frontend React app expects these endpoints:

### Authentication
```javascript
// Register
POST /api/auth/register
Body: { name, email, password }

// Login
POST /api/auth/login
Body: { email, password }
Response: { success, data: { user, token } }
```

### Soil Analysis
```javascript
// Upload soil image
POST /api/soil/analyze
Headers: { Authorization: "Bearer <token>" }
Body: FormData with 'soilImage' file
Response: {
  success,
  data: {
    analysis: {
      nitrogen, phosphorus, potassium,
      ph, organicMatter, moisture,
      composition: { topsoil, clay, sand, silt, organic }
    }
  }
}
```

### Crop Planning
```javascript
// Create crop plan
POST /api/crop/plan
Headers: { Authorization: "Bearer <token>" }
Body: { budget, landSize, season }
Response: {
  success,
  data: {
    plan: {
      allocations: [{ name, acres, cost, expectedRevenue, color }],
      summary: { totalAllocated, totalCost, totalRevenue, expectedProfit }
    }
  }
}
```

### Market Analysis
```javascript
// Analyze markets
POST /api/market/analyze
Headers: { Authorization: "Bearer <token>" }
Body: {
  cropType,
  weightTons,
  farmLocation: { type: "Point", coordinates: [lng, lat] }
}
Response: {
  success,
  data: {
    analysis: {
      markets: [{ name, distance, price, transport, rent, trueProfit, best }],
      bestMarket
    }
  }
}
```

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongosh

# Or check the service
brew services list | grep mongodb
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=5001 npm run dev
```

### CORS Errors

Update `CORS_ORIGIN` in `.env` to match your frontend URL:
```
CORS_ORIGIN=http://localhost:8080
```

### Encryption Errors

Ensure your encryption keys are the correct length:
- `ENCRYPTION_KEY` must be exactly 32 characters
- `ENCRYPTION_IV` must be exactly 16 characters

## Development Tips

### Testing with curl

```bash
# Save token to variable
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@crophub.com","password":"password123"}' \
  | jq -r '.data.token')

# Use token in requests
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/auth/me
```

### MongoDB GUI Tools

- MongoDB Compass (official)
- Studio 3T
- Robo 3T

### Viewing Logs

The server uses Morgan for HTTP request logging in development mode.

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Enable MongoDB authentication
4. Set up proper AWS S3 credentials
5. Use environment variables (not .env file)
6. Enable HTTPS
7. Set up process manager (PM2)

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start src/server.js --name crophub-api

# Monitor
pm2 monit

# Logs
pm2 logs crophub-api
```

## Next Steps

1. Connect frontend to backend API
2. Set up Python ML service (optional)
3. Configure AWS S3 for image storage (optional)
4. Add more crop types to the database
5. Integrate real market data APIs
6. Add analytics and reporting features

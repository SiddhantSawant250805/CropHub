# CropHub API Reference

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

All responses follow this structure:

Success:
```json
{
  "success": true,
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "error": "Error message",
  "errors": [...]
}
```

## Endpoints

### Health Check

#### `GET /health`
Check API status

Response:
```json
{
  "success": true,
  "message": "CropHub API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Authentication

#### `POST /auth/register`
Register a new user

Request Body:
```json
{
  "name": "John Farmer",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Farmer",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token"
  }
}
```

#### `POST /auth/login`
Login user

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response: Same as register

#### `GET /auth/me` (Protected)
Get current user

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Farmer",
      "email": "john@example.com",
      "landSize": 15,
      "farmLocation": {
        "type": "Point",
        "coordinates": [77.5946, 12.9716]
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### `PUT /auth/profile` (Protected)
Update user profile

Request Body:
```json
{
  "name": "John Updated",
  "landSize": 20,
  "budget": 250000,
  "farmLocation": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716],
    "address": "Bangalore, Karnataka"
  }
}
```

---

### Soil Analysis (Terra Layer)

#### `POST /soil/analyze` (Protected)
Upload and analyze soil image

Request: multipart/form-data
- `soilImage`: Image file (JPEG, JPG, PNG, max 10MB)

Response:
```json
{
  "success": true,
  "data": {
    "analysis": {
      "id": "analysis_id",
      "imageUrl": "https://...",
      "soilType": "Loamy",
      "analysis": {
        "nitrogen": 72,
        "phosphorus": 45,
        "potassium": 88,
        "ph": 6.4,
        "organicMatter": 3.2,
        "moisture": 28
      },
      "composition": {
        "topsoil": 35,
        "clay": 25,
        "sand": 22,
        "silt": 12,
        "organic": 6
      },
      "status": "completed",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### `GET /soil?page=1&limit=10` (Protected)
Get all soil analyses for current user

Query Parameters:
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 10

Response:
```json
{
  "success": true,
  "data": {
    "analyses": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

#### `GET /soil/:id` (Protected)
Get specific soil analysis

---

### Crop Planning (Fathom Layer)

#### `POST /crop/plan` (Protected)
Create crop allocation plan

Request Body:
```json
{
  "budget": 200000,
  "landSize": 15,
  "season": "Kharif 2024"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "plan": {
      "id": "plan_id",
      "budget": 200000,
      "landSize": 15,
      "allocations": [
        {
          "name": "Maize",
          "acres": 5,
          "cost": 42500,
          "expectedRevenue": 90000,
          "color": "hsl(45 80% 50%)"
        }
      ],
      "summary": {
        "totalAllocated": 15,
        "totalCost": 180000,
        "totalRevenue": 300000,
        "expectedProfit": 120000
      },
      "season": "Kharif 2024",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### `GET /crop/plans?status=active` (Protected)
Get all crop plans

Query Parameters:
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 10
- `status` (optional): Filter by status (active, draft, completed, archived)

#### `GET /crop/plans/:id` (Protected)
Get specific crop plan

#### `PATCH /crop/plans/:id/status` (Protected)
Update crop plan status

Request Body:
```json
{
  "status": "completed"
}
```

Valid statuses: `draft`, `active`, `completed`, `archived`

---

### Market Analysis (Logistics)

#### `POST /market/analyze` (Protected)
Analyze markets for crop selling

Request Body:
```json
{
  "cropType": "Maize",
  "weightTons": 5,
  "farmLocation": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716]
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "analysis": {
      "id": "analysis_id",
      "cropType": "Maize",
      "weightTons": 5,
      "markets": [
        {
          "name": "Mandi Gamma",
          "distance": "18 km",
          "distanceKm": 18,
          "price": "₹2,900/q",
          "pricePerQuintal": 2900,
          "transport": "₹900",
          "transportCost": 900,
          "rent": "₹120",
          "rentCost": 120,
          "trueProfit": "₹143,980",
          "trueProfitValue": 143980,
          "best": true,
          "location": {
            "type": "Point",
            "coordinates": [77.6208, 12.9279]
          }
        }
      ],
      "bestMarket": "Mandi Gamma",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### `GET /market/analyses` (Protected)
Get all market analyses

Query Parameters:
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 10

#### `GET /market/prices?cropType=Maize` (Protected)
Get current market prices for crop

Query Parameters:
- `cropType` (required): Type of crop

Response:
```json
{
  "success": true,
  "data": {
    "cropType": "Maize",
    "prices": {
      "averagePrice": 2500,
      "minPrice": 2200,
      "maxPrice": 3000,
      "trend": "rising"
    }
  }
}
```

---

## Error Codes

- `400` - Bad Request (Validation error)
- `401` - Unauthorized (Missing or invalid token)
- `404` - Not Found
- `429` - Too Many Requests (Rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address.

## File Upload

Soil image upload accepts:
- Formats: JPEG, JPG, PNG
- Max size: 10MB
- Field name: `soilImage`

## Pagination

Paginated endpoints support:
- `page` query parameter (default: 1)
- `limit` query parameter (default: 10, max: 100)

Response includes pagination metadata.

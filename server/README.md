# CropHub Server (Backend API)

The backend of CropHub is a robust RESTful API built with Node.js, Express, and MongoDB. It manages user authentication, encrypted data storage, and coordinates between the frontend and the AI intelligence layers.

---

## 🚀 Quick Start & Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory (refer to `.env.example`).
**Required Variables:**
- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: Secure random string for token signing.
- `ENCRYPTION_KEY`: Exactly 32 characters for budget encryption.
- `ENCRYPTION_IV`: Exactly 16 characters for budget encryption.
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`: For S3 image storage.

### 3. Database Setup (MongoDB)
- **Local**: Install and start `mongodb-community`.
- **Cloud**: Use MongoDB Atlas and whitelist your server IP.

### 4. Start the Server
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```
The server runs on `http://localhost:5000` by default.

---

## 🏗️ Architecture Overview

### Core Layers
- **Controllers**: Logic for Auth, Soil Analysis, Crop Planning, and Market Data.
- **Models**: Mongoose schemas for User, SoilAnalysis, CropPlan, and MarketAnalysis.
- **Middleware**: JWT Verification, Error Handling, and Multer (file uploads).
- **Services**: Integrations for AWS S3 and the Python ML service.

### Security Features
- **JWT Authentication**: Secure stateless sessions.
- **AES-256-CBC Encryption**: Used for sensitive financial data (budgets).
- **Rate Limiting**: 100 requests per 15 minutes per IP.
- **Helmet.js**: Security headers for HTTP protection.

---

## 📋 API Reference

**Base URL**: `http://localhost:5000/api`

### 🔑 Authentication
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and receive JWT | No |
| GET | `/auth/me` | Get current user profile | Yes |
| PUT | `/auth/profile` | Update user settings | Yes |

### 🌱 Soil Analysis (Terra Layer)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/soil/analyze` | Upload JPEG/PNG (max 10MB) for analysis |
| GET | `/soil` | List all historical analyses |
| GET | `/soil/:id` | Get details of a specific analysis |

### 📈 Crop Planning (Fathom Layer)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/crop/plan` | Generate allocation based on budget/land |
| GET | `/crop/plans` | List active crop plans |

### 🚛 Market Analysis (Logistics)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/market/analyze` | Find best market for a specific crop |
| GET | `/market/prices` | Get current market trends |

---

## 🔒 Advanced Security Patterns

The server implements a **Multi-Stage Security Engine** to protect sensitive agricultural and financial data.

- **Fathom Layer Cryptography**:
  ```javascript
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(data);
  // ... encrypted before MongoDB persist
  ```
- **Image Pipeline Isolation**: Uploaded images are passed through a validation buffer before being streamed to AWS S3, ensuring zero malicious file ingestion.
- **Node-side Proxy**: The server acts as a secure reverse proxy for the Python ML service, shielding the intelligence layer from direct external exposure.

---

## 📁 Modular Directory Structure

```text
server/
├── config/             # DB & Middleware configurations
├── controllers/        # Business logic & resource management
├── middleware/         # Security, JWT, & Multer buffering
├── models/             # Mongoose schemas for persistence
├── services/           # AWS S3 & ML Service integrations
├── .env.example        # Reference for infrastructure secrets
└── index.js            # Node.js orchestration entry point
```

---

## 📄 License
MIT — Scalable Backend for Precision Agriculture.

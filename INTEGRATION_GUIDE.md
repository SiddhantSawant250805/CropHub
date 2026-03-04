# Frontend-Backend Integration Guide

This guide explains how to integrate the React frontend with the Node.js backend API.

## Current State

The frontend currently uses **hardcoded mock data**. We need to replace this with actual API calls to the backend.

## Required Frontend Changes

### 1. Create API Service Layer

Create `client/src/services/api.service.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async post<T>(endpoint: string, data: any, includeAuth = true): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    const result = await response.json();
    return result.data;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    const result = await response.json();
    return result.data;
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    const result = await response.json();
    return result.data;
  }
}

export const apiService = new ApiService();
```

### 2. Create Authentication Context

Create `client/src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api.service';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiService.post<{ user: User; token: string }>(
      '/auth/login',
      { email, password },
      false
    );

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await apiService.post<{ user: User; token: string }>(
      '/auth/register',
      { name, email, password },
      false
    );

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 3. Update Login Page

Modify `client/src/pages/Login.tsx`:

```typescript
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
// ... rest of imports

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
}
```

### 4. Update Register Page

Modify `client/src/pages/Register.tsx` similarly to Login.

### 5. Update Terra Layer (Soil Analysis)

Modify `client/src/components/terra/SoilUploader.tsx`:

```typescript
import { apiService } from "@/services/api.service";
import { toast } from "sonner";

// In handleUpload function:
const handleUpload = async (file: File) => {
  setState("scanning");

  try {
    const formData = new FormData();
    formData.append("soilImage", file);

    const result = await apiService.postFormData<{
      imageUrl: string;
      analysis: SoilAnalysisResult;
    }>("/terra/analyze", formData);

    setState("done");
    onAnalysisComplete(result.analysis);
    toast.success("Soil analysis complete!");
  } catch (error: any) {
    setState("idle");
    toast.error(error.message || "Analysis failed");
  }
};
```

### 6. Update Fathom Layer (Crop Optimization)

Modify `client/src/pages/FathomLayer.tsx`:

```typescript
import { apiService } from "@/services/api.service";
import { toast } from "sonner";

// Replace handleOptimize function:
const handleOptimize = async () => {
  if (!budget || !land) return;
  setLoading(true);
  setPlan(null);

  try {
    const result = await apiService.post<{
      crops: CropPlan[];
      totalBudget: number;
      totalLand: number;
    }>("/fathom/optimize", {
      budget: Number(budget),
      landSize: Number(land),
    });

    setPlan(result.crops);
    toast.success("Crop plan generated!");
  } catch (error: any) {
    toast.error(error.message || "Optimization failed");
  } finally {
    setLoading(false);
  }
};
```

### 7. Update Logistics Page

Modify `client/src/pages/Logistics.tsx`:

```typescript
import { useState, useEffect } from "react";
import { apiService } from "@/services/api.service";

// Add state and fetch function:
const [markets, setMarkets] = useState<Market[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchMarketData();
}, []);

const fetchMarketData = async () => {
  try {
    const result = await apiService.post<{
      markets: Market[];
    }>("/logistics/arbitrage", {
      cropType: "wheat",
      weightTons: 5,
      farmLocation: {
        latitude: 28.6139,
        longitude: 77.2090,
      },
    });

    setMarkets(result.markets);
  } catch (error: any) {
    console.error("Failed to fetch market data:", error);
  } finally {
    setLoading(false);
  }
};
```

### 8. Add Protected Route Component

Create `client/src/components/ProtectedRoute.tsx`:

```typescript
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

### 9. Update App.tsx

Wrap app with AuthProvider and protect routes:

```typescript
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout><Dashboard /></AppLayout>
                </ProtectedRoute>
              }
            />
            {/* Protect other routes similarly */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
```

### 10. Add Environment Variable

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:
```env
VITE_API_URL=https://your-production-api.com/api
```

---

## Testing the Integration

### 1. Start Backend
```bash
cd server
npm run dev
```

### 2. Start Frontend
```bash
cd client
npm run dev
```

### 3. Test Flow

1. **Register**: Create new account at `/register`
2. **Login**: Sign in at `/login`
3. **Dashboard**: Should redirect to dashboard after login
4. **Terra Layer**: Upload soil image, see real analysis
5. **Fathom Layer**: Enter budget/land, get optimized plan
6. **Logistics**: View real-time market arbitrage data

---

## Error Handling

All API calls should handle errors gracefully:

```typescript
try {
  const result = await apiService.post(...);
  // Handle success
} catch (error: any) {
  toast.error(error.message || "Operation failed");
  console.error("Error:", error);
}
```

---

## API Response Types

Define TypeScript interfaces for API responses:

```typescript
// client/src/types/api.types.ts

export interface SoilAnalysisResult {
  soilType: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  composition: {
    sand: number;
    silt: number;
    clay: number;
  };
  recommendations: string[];
}

export interface CropPlan {
  name: string;
  acres: number;
  budget: number;
  color: string;
  expectedYield?: number;
  roi?: number;
}

export interface Market {
  name: string;
  price: number;
  distance: number;
  transport: number;
  rent: number;
  profit: number;
}
```

---

## CORS Configuration

Ensure backend `.env` includes frontend URL:

```env
CORS_ORIGINS=http://localhost:8080,http://localhost:3000
```

For production, add production frontend URL:
```env
CORS_ORIGINS=https://your-frontend.com,http://localhost:8080
```

---

## Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. All subsequent requests include token in Authorization header
5. Backend validates token and returns user-specific data

---

## Summary

After implementing these changes:

- ✅ Real user authentication with JWT
- ✅ Actual soil image upload to S3
- ✅ AI-powered crop optimization
- ✅ Real-time market arbitrage calculation
- ✅ Encrypted financial data
- ✅ Protected routes
- ✅ Error handling and loading states
- ✅ Type-safe API calls

The frontend will now be fully integrated with the backend API!

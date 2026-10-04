# Authentication Implementation Guide

## Overview

HostelAI now includes a complete JWT-based authentication system with role-based access control (RBAC). This implementation provides secure, stateless authentication suitable for modern web applications and future mobile integrations.

## Architecture

### Backend Authentication Flow

```
User Login Request
    ↓
Password Verification (SHA256 hashing)
    ↓
JWT Token Generation (expires in 24 hours)
    ↓
Return Token + User Info
    ↓
Client Stores Token in localStorage
```

### Supported Roles

- **Student**: Basic access to personal data and complaints
- **Admin**: Full system access and configuration
- **Warden**: Hostel operations and student management
- **Accountant**: Finance and payment tracking
- **SecurityStaff**: Security logs and visitor management

## Backend Setup

### 1. Configuration

**File**: `appsettings.json`

```json
{
  "Jwt": {
    "SecretKey": "your-super-secret-jwt-key-change-this-in-production",
    "Issuer": "HostelAI",
    "Audience": "HostelAIUsers",
    "ExpirationMinutes": 1440
  }
}
```

⚠️ **IMPORTANT**: Change the `SecretKey` in production to a strong, random value (minimum 32 characters).

### 2. Authentication Endpoints

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "userId": 1,
  "fullName": "John Doe",
  "email": "user@example.com",
  "role": "Admin",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123",
  "role": "Student"
}

Response:
{
  "userId": 2,
  "email": "jane@example.com"
}
```

#### Get Current User (Protected)
```
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "userId": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "Admin"
}
```

### 3. Services

#### JwtService
Handles JWT token generation and validation.

```csharp
var token = jwtService.GenerateToken(
  userId: 1,
  email: "user@example.com",
  fullName: "John Doe",
  role: "Admin"
);
```

#### PasswordService
Handles secure password hashing and verification using SHA256.

```csharp
var hash = passwordService.HashPassword("password123");
bool isValid = passwordService.VerifyPassword("password123", hash);
```

## Frontend Setup

### 1. Environment Variables

Ensure your API base URL is configured. Update in `AuthContext.tsx`:

```typescript
const response = await fetch('http://localhost:5000/api/auth/login', {
  // ...
});
```

For production, use:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### 2. AuthContext

Provides authentication state and methods to the entire application.

```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, token, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return <Dashboard />;
}
```

### 3. Protected Routes

Wrap components that require authentication:

```typescript
<ProtectedRoute allowedRoles={['Admin', 'Warden']}>
  <AdminPanel />
</ProtectedRoute>
```

### 4. Login Page

Located at `/src/pages/Login.tsx`. Users can log in with their credentials.

**Demo Credentials**:
- Email: `admin@hostelai.com`
- Password: `Password@123`

## Usage Examples

### Login Flow

```typescript
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return <form onSubmit={handleLogin}>...</form>;
}
```

### Making Authenticated Requests

```typescript
function useProtectedAPI() {
  const { token } = useAuth();

  const fetchData = async (url) => {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  };

  return { fetchData };
}
```

### Role-Based UI

```typescript
function AdminFeature() {
  const { user } = useAuth();

  if (user?.role !== 'Admin') {
    return <div>Access Denied</div>;
  }

  return <AdminPanel />;
}
```

## Security Best Practices

### Backend

1. **Secret Key Management**
   - Use a strong, randomly generated secret key (minimum 32 characters)
   - Rotate keys periodically
   - Use environment variables, not hardcoded values

2. **HTTPS Only**
   - Always use HTTPS in production
   - Set secure cookie flags for session management

3. **Token Expiration**
   - Default: 24 hours
   - Adjust based on security requirements
   - Implement token refresh mechanism for long sessions

4. **Password Hashing**
   - Currently uses SHA256
   - Consider upgrading to bcrypt for production
   - Never log passwords

5. **CORS Configuration**
   - Restrict to specific domains in production
   - Avoid `AllowAnyOrigin()` in production

### Frontend

1. **Token Storage**
   - Currently uses `localStorage`
   - Consider using secure, httpOnly cookies for production
   - Never expose tokens in URLs or query parameters

2. **Request Headers**
   - Always include token in Authorization header
   - Use `Bearer <token>` format

3. **Token Refresh**
   - Implement silent token refresh before expiration
   - Clear tokens on logout

4. **HTTPS Only**
   - Ensure all API calls use HTTPS in production

## Testing

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hostelai.com","password":"Password@123"}'
```

### Test Protected Endpoint

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Future Enhancements

1. **OAuth2 / OIDC Integration**
   - Support external identity providers
   - Single Sign-On (SSO) capabilities

2. **Multi-Factor Authentication (MFA)**
   - TOTP (Time-based One-Time Password)
   - SMS/Email verification

3. **Session Management**
   - Implement refresh tokens
   - Token revocation list

4. **Audit Logging**
   - Log all authentication events
   - Track access patterns

5. **Rate Limiting**
   - Prevent brute force attacks
   - DDoS protection

## Troubleshooting

### Issue: "Invalid token" error

**Solution**: 
- Ensure token is included in Authorization header
- Check token hasn't expired
- Verify JWT secret key matches on backend and frontend

### Issue: CORS errors

**Solution**:
- Check CORS configuration in `Program.cs`
- Ensure frontend URL is allowed
- Verify Content-Type headers are correct

### Issue: Login fails

**Solution**:
- Verify user exists in database
- Check password is correct
- Ensure user account is active (`IsActive = true`)
- Review backend logs for errors

## Database Migrations

The authentication system requires the User table with the following schema:

```sql
CREATE TABLE Users (
    Id INTEGER PRIMARY KEY,
    FullName TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    PasswordHash TEXT NOT NULL,
    Role TEXT NOT NULL DEFAULT 'Student',
    IsActive BOOLEAN NOT NULL DEFAULT true,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Run migrations:
```bash
cd backend/HostelAI.API
dotnet ef database update
```

## References

- [JWT.io](https://jwt.io/) - JWT Documentation
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/identity/common-oauth-intro)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

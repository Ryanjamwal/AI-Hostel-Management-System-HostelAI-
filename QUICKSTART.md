# Quick Start Guide - HostelAI Authentication

## 🚀 5-Minute Setup

### Prerequisites

- .NET 10 SDK
- Node.js 18+
- npm or yarn

### Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend/HostelAI.API

# Restore packages
dotnet restore

# Run the API (default port: 5000)
dotnet run
```

You should see:

```
HostelAI API is running
Press Ctrl+C to stop the service
```

### Step 2: Frontend Setup (2 minutes)

In a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server (default port: 5173)
npm run dev
```

You should see:

```
VITE v8.2.0  ready in 123 ms

➜  Local:   http://localhost:5173/
```

### Step 3: Test the Application (1 minute)

1. Open browser: `http://localhost:5173`
2. You'll be redirected to login page
3. Enter credentials:

   ```
   Email: admin@hostelai.com
   Password: Password@123
   ```

4. Click "Sign In"
5. You should see the dashboard

## 🧪 Testing Different Roles

Try logging in with these credentials to see different role access:

| Role | Email | Password |
| ------ | ------- | ---------- |
| Admin | <admin@hostelai.com> | Password@123 |
| Warden | <warden@hostelai.com> | Password@123 |
| Accountant | <accountant@hostelai.com> | Password@123 |
| Security | <security@hostelai.com> | Password@123 |
| Student | <student@hostelai.com> | Password@123 |

## ✅ Verify Setup Success

### Backend Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "HostelAI API",
  "mode": "Development"
}
```

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hostelai.com","password":"Password@123"}'
```

## 📝 Key Features to Test

1. **Login**
   - Try valid credentials
   - Try invalid email
   - Try wrong password
   - See error messages

2. **Protected Routes**
   - Try accessing `/dashboard` without login
   - You should be redirected to login page

3. **User Info**
   - Check localStorage after login
   - See stored token and user data
   - Clear localStorage and refresh → redirected to login

4. **Logout**
   - Look for logout button in dashboard
   - Verify redirect to login page

## 🔧 Configuration

### Change API URL

If backend is running on different port, update `frontend/src/contexts/AuthContext.tsx`:

```typescript
const response = await fetch('http://localhost:YOUR_PORT/api/auth/login', {
```

### Change JWT Secret (Important!)

Update `backend/HostelAI.API/appsettings.json`:

```json
{
  "Jwt": {
    "SecretKey": "your-new-secret-key-at-least-32-characters-long",
    "ExpirationMinutes": 1440
  }
}
```

## 🐛 Troubleshooting

### Frontend can't connect to backend

**Issue**: CORS error in console
**Solution**:

```bash
# Restart backend to ensure CORS is enabled
dotnet run
```

### "Invalid token" error

**Issue**: Token validation fails
**Solution**:

1. Clear localStorage in browser
2. Login again
3. Check that JWT secret key matches in `appsettings.json`

### Login fails with valid credentials

**Issue**: Users not found in database
**Solution**:

1. Check database file exists: `backend/HostelAI.API/hostelai.db`
2. Restart backend to run seeding:

   ```bash
   dotnet run
   ```

3. Check console output for "Demo users seeded successfully!"

### Port already in use

**Issue**: Port 5000 or 5173 already in use
**Solution**:

For backend:

```bash
# Run on different port
dotnet run --urls "http://localhost:5001"
```

For frontend:

```bash
# Run on different port
npm run dev -- --port 5174
```

## 📚 Documentation

For detailed information, see:

- `AUTHENTICATION.md` - Complete authentication guide
- `AUTH_IMPLEMENTATION_SUMMARY.md` - Features overview
- `ARCHITECTURE.md` - System architecture

## 🎓 Learn More

After setup, explore:

1. **Login Flow**
   - Open browser DevTools → Network tab
   - Login and see the `/api/auth/login` request
   - Check the JWT token in the response

2. **Token Storage**
   - Open DevTools → Application → localStorage
   - See `authToken` and `user` stored
   - Copy token and decode at jwt.io

3. **Protected Routes**
   - Check source code in `ProtectedRoute.tsx`
   - See how role-based access works

## ✨ Next Steps

After confirming authentication works:

1. **Add Charts** - See next phase for analytics
2. **Polish Admin UI** - Customize dashboards per role
3. **Add More Features** - Complaints, room allocation, etc.

## 💡 Pro Tips

- Press `F12` in browser to see API calls in Network tab
- Check browser console for helpful error messages
- Use `localStorage.clear()` in console to reset auth
- Export JWT token from DevTools and decode at `jwt.io` to see claims

## 🆘 Still Having Issues?

1. Check backend console for errors
2. Check browser console (F12) for errors
3. Verify ports: `netstat -an | findstr :5000` (Windows)
4. Try clearing node_modules and reinstalling: `npm install`
5. Reset database: Delete `hostelai.db` and restart backend

---

**Happy Testing!** 🎉

For detailed information, see `AUTHENTICATION.md` or `AUTH_IMPLEMENTATION_SUMMARY.md`

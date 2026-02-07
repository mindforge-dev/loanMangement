# Authentication System

Complete authentication system with login, register, and protected routes.

## 📁 File Structure

```
src/
├── pages/
│   └── auth/
│       ├── index.ts          # Barrel exports
│       ├── Login.tsx          # Login page
│       └── Register.tsx       # Register page
├── services/
│   └── authService.ts         # Auth API calls & token management
├── hooks/
│   └── useAuth.ts             # React Query auth hooks
└── components/
    └── ProtectedRoute.tsx     # Route guard component
```

## 🔐 Features

### Login Page (`/login`)
- ✅ Email & password authentication
- ✅ Remember me checkbox
- ✅ Forgot password link
- ✅ Loading states with spinner
- ✅ Error handling with messages
- ✅ Beautiful gradient background
- ✅ Responsive design
- ✅ Link to register page

### Register Page (`/register`)
- ✅ Full name, email, password fields
- ✅ Password confirmation
- ✅ Terms & conditions acceptance
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Link to login page

### Protected Routes
- ✅ Automatic redirect to login if not authenticated
- ✅ Token-based authentication
- ✅ Logout functionality in dashboard header

## 🚀 Usage

### Login
```tsx
import { useLogin } from '@/hooks/useAuth'

function LoginForm() {
  const login = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()
    login.mutate({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={login.isPending}>
        {login.isPending ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}
```

### Register
```tsx
import { useRegister } from '@/hooks/useAuth'

function RegisterForm() {
  const register = useRegister()

  const handleSubmit = (e) => {
    e.preventDefault()
    register.mutate({ name, email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={register.isPending}>
        {register.isPending ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  )
}
```

### Logout
```tsx
import { useLogout } from '@/hooks/useAuth'

function LogoutButton() {
  const logout = useLogout()

  return (
    <button onClick={() => logout.mutate()}>
      Logout
    </button>
  )
}
```

### Check Authentication
```tsx
import { isAuthenticated, getCurrentUser } from '@/services/authService'

// Check if user is logged in
if (isAuthenticated()) {
  console.log('User is authenticated')
}

// Get current user data
const user = getCurrentUser()
console.log(user.name, user.email, user.role)
```

## 🔧 Auth Service

### API Endpoints

The auth service expects these backend endpoints:

```typescript
POST /api/auth/login
Body: { email: string, password: string }
Response: { token: string, user: { id, name, email, role } }

POST /api/auth/register
Body: { name: string, email: string, password: string }
Response: { token: string, user: { id, name, email, role } }
```

### Token Management

Tokens are automatically:
- ✅ Stored in `localStorage` on login/register
- ✅ Added to all API requests via Axios interceptor
- ✅ Removed on logout
- ✅ Checked for protected routes

### Axios Interceptor

The Axios instance automatically:
```typescript
// Add token to requests
config.headers.Authorization = `Bearer ${token}`

// Handle 401 errors
if (error.response?.status === 401) {
  localStorage.removeItem('token')
  window.location.href = '/login'
}
```

## 🛡️ Protected Routes

### How It Works

```tsx
// App.tsx
<Route
  path="/"
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Dashboard />} />
  <Route path="users" element={<Users />} />
  {/* ... more routes */}
</Route>
```

### ProtectedRoute Component

```tsx
export function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
```

## 🎨 UI Design

### Color Scheme
- **Background**: Gradient from indigo-900 → purple-900 → pink-900
- **Cards**: White with rounded corners and shadows
- **Buttons**: Gradient from indigo-600 → purple-600
- **Focus**: Indigo-500 ring
- **Errors**: Red-50 background with red-700 text

### Components
- **Input Fields**: 
  - Border with focus ring
  - Placeholder text
  - Required validation
- **Buttons**:
  - Gradient background
  - Hover effects
  - Loading spinner
  - Disabled states
- **Error Messages**:
  - Red background
  - Border and text
  - Rounded corners

## 📱 Responsive Design

All auth pages are fully responsive:
- ✅ Mobile-first approach
- ✅ Centered layout
- ✅ Padding for small screens
- ✅ Max-width constraints
- ✅ Touch-friendly buttons

## 🔄 Flow

### Login Flow
1. User enters email & password
2. Click "Sign In"
3. `useLogin` mutation called
4. Token stored in localStorage
5. Redirect to dashboard (`/`)

### Register Flow
1. User enters name, email, password
2. Confirm password matches
3. Accept terms & conditions
4. Click "Create Account"
5. `useRegister` mutation called
6. Token stored in localStorage
7. Redirect to dashboard (`/`)

### Logout Flow
1. User clicks "Logout" in header
2. Token removed from localStorage
3. Redirect to login page (`/login`)

### Protected Route Flow
1. User tries to access dashboard
2. `ProtectedRoute` checks for token
3. If no token → redirect to `/login`
4. If token exists → render dashboard

## 🚧 Backend Integration

To connect to your backend:

1. **Update API URL** in `.env`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

2. **Ensure backend endpoints match**:
   - `POST /api/auth/login`
   - `POST /api/auth/register`

3. **Response format**:
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": 1,
       "name": "John Doe",
       "email": "john@example.com",
       "role": "admin"
     }
   }
   ```

## 🎯 Next Steps

### Enhancements to Add:

1. **Forgot Password**
   - Create forgot password page
   - Email verification
   - Password reset flow

2. **Email Verification**
   - Send verification email on register
   - Verify email before allowing login

3. **OAuth Integration**
   - Google Sign-In
   - GitHub Sign-In
   - Social auth providers

4. **Remember Me**
   - Implement persistent sessions
   - Refresh tokens

5. **User Profile**
   - View/edit profile page
   - Change password
   - Update user info

6. **Role-Based Access**
   - Admin-only routes
   - Permission checks
   - Role-based UI

7. **Session Management**
   - Auto logout on token expiry
   - Refresh token mechanism
   - Session timeout warnings

## 🐛 Error Handling

### Common Errors

**Invalid Credentials**
```tsx
{login.isError && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
    <p className="text-sm">
      {login.error?.message || 'Invalid email or password'}
    </p>
  </div>
)}
```

**Network Errors**
- Handled by Axios interceptor
- Shows error message
- Retry logic in React Query

**Validation Errors**
- HTML5 validation (required, minLength, type="email")
- Custom validation (password confirmation)

## 📚 Resources

- [React Router Docs](https://reactrouter.com/)
- [TanStack Query Auth](https://tanstack.com/query/latest/docs/react/guides/auth)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## ✅ Testing

### Manual Testing

1. **Login**:
   - Navigate to `/login`
   - Enter credentials
   - Verify redirect to dashboard
   - Check token in localStorage

2. **Register**:
   - Navigate to `/register`
   - Fill form
   - Verify password confirmation
   - Check token stored

3. **Protected Routes**:
   - Clear localStorage
   - Try to access `/`
   - Verify redirect to `/login`

4. **Logout**:
   - Click logout button
   - Verify token removed
   - Verify redirect to login

### Test Credentials (for development)

If your backend has seed data:
```
Email: admin@example.com
Password: password123
```

# Loan Management Backend

A modular backend boilerplate using Node.js, Express, TypeScript, TypeORM, PostgreSQL, Zod, and JWT.

## Features
- **Modular Architecture**: Feature-based modules (Auth, Users)
- **Authentication**: JWT-based auth with `common/utils/jwt.ts` and `auth.middleware.ts`
- **Authorization**: Spatie-style RBAC — `users` ↔ `roles` ↔ `permissions` with granular `module:action` permissions and a `super-admin` bypass. See `src/modules/rbac/` and `src/common/middleware/rbac.middleware.ts` (`checkPermissions`).
- **Validation**: Request validation using `Zod` and `validate.middleware.ts`
- **Database**: TypeORM with PostgreSQL
- **Error Handling**: Centralized error handling for Zod errors, App errors, and unknown errors.

## Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Docker & Docker Compose (optional)

## Setup

### Using Docker Compose (Recommended for Dev)
This project uses Docker Compose Watch for a smooth development experience.

1.  **Start the server**:
    ```bash
    docker compose up --watch
    ```
    This will start PostgreSQL and the Node.js app. Changes in `src/` will automatically sync to the container and trigger a restart/hot-reload (handled by nodemon inside the container).

2.  **Access**:
    API is running at `http://localhost:3000`
    PostgreSQL is exposed at `localhost:5432`

### Manual Setup
1. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and update the values.
   ```bash
   cp .env.example .env
   ```
   Required variables:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
   - `JWT_SECRET`

3. **Database**
    Create a PostgreSQL database matching `DB_NAME`.
   By default, `synchronize: true` is enabled for development (in `src/config/datasource.ts`), which will automatically create tables based on entities.

   **For Production**:
   Disable `synchronize` and use migrations.
   ```bash
   npm run migration:generate -- -n InitialMigration
   npm run migration:run
   ```

4. **Run the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

## API Endpoints

### Auth
- `POST /auth/register` - Register a new user (assigned the default `loan-officer` role; role is not client-settable)
  - Body: `{ "name": "John", "email": "john@example.com", "password": "pass" }`
- `POST /auth/login` - Login (returns `accessToken` + `refreshToken`)
  - Body: `{ "email": "john@example.com", "password": "pass" }`
- `POST /auth/refresh` - Rotate refresh token → new access/refresh pair
- `POST /auth/logout` - Revoke a refresh token

### Users
- `GET /users/me` (Protected) - Get current user profile
- `GET /users` (Protected, Admin only) - Get all users

## Architecture
- `src/app.ts`: Express setup
- `src/server.ts`: Entry point
- `src/modules/`: Feature modules
- `src/common/`: Shared utilities, middleware, errors

## Error Format
```json
{
  "error": {
    "type": "VALIDATION_ERROR", // or APP_ERROR_CODE
    "message": "Error description",
    "details": [...] // optional zodd details
  }
}
```

# Loan Management Backend

A modular backend boilerplate using Node.js, Express, TypeScript, TypeORM, MySQL, Zod, and JWT.

## Features
- **Modular Architecture**: Feature-based modules (Auth, Users)
- **Authentication**: JWT-based auth with `common/utils/jwt.ts` and `auth.middleware.ts`
- **Authorization**: RBAC (Role-Based Access Control) with `rbac.middleware.ts`
- **Validation**: Request validation using `Zod` and `validate.middleware.ts`
- **Database**: TypeORM with MySQL
- **Error Handling**: Centralized error handling for Zod errors, App errors, and unknown errors.

## Prerequisites
- Node.js (v18+)
- MySQL Database
- Docker & Docker Compose (optional)

## Setup

### Using Docker Compose (Recommended for Dev)
This project uses Docker Compose Watch for a smooth development experience.

1.  **Start the server**:
    ```bash
    docker compose up --watch
    ```
    This will start MySQL and the Node.js app. Changes in `src/` will automatically sync to the container and trigger a restart/hot-reload (handled by nodemon inside the container).

2.  **Access**:
    API is running at `http://localhost:3000`
    MySQL is exposed at `localhost:3306`

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
   Create a MySQL database matching `DB_NAME`.
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
- `POST /auth/register` - Register a new user
  - Body: `{ "name": "John", "email": "john@example.com", "password": "pass", "role": "LOAN_OFFICER" }`
- `POST /auth/login` - Login
  - Body: `{ "email": "john@example.com", "password": "pass" }`

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

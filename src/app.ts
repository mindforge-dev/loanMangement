import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errorHandler } from './common/middleware/error-handler';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';

export const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Loan Management API is running' });
});

// Error Handler
app.use(errorHandler);

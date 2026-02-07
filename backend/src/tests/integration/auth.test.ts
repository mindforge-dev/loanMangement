import request from 'supertest';
import { app } from '../../app';
import { AppDataSource } from '../../config/datasource';

describe('Auth Integration', () => {
    beforeAll(async () => {
        // Initialize DB connection (SQLite in-memory)
        await AppDataSource.initialize();
    });

    afterAll(async () => {
        // Close DB connection
        await AppDataSource.destroy();
    });

    afterEach(async () => {
        // Clean up data between tests
        const entities = AppDataSource.entityMetadatas;
        for (const entity of entities) {
            const repository = AppDataSource.getRepository(entity.name);
            await repository.clear();
        }
    });

    describe('POST /auth/register', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'LOAN_OFFICER',
                });

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data.user).toHaveProperty('id');
            expect(response.body.data.user.email).toBe('test@example.com');
        });

        it('should fail if email is invalid', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    name: 'Test User',
                    email: 'invalid-email',
                    password: 'password123',
                });

            expect(response.status).toBe(400);
            expect(response.body.error.type).toBe('VALIDATION_ERROR');
        });

        it('should fail if user already exists', async () => {
            // First registration
            await request(app).post('/auth/register').send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            });

            // Second registration (duplicate)
            const response = await request(app).post('/auth/register').send({
                name: 'Test User 2',
                email: 'test@example.com',
                password: 'password456',
            });

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
        });
    });

    describe('POST /auth/login', () => {
        beforeEach(async () => {
            // Create a user for login
            await request(app).post('/auth/register').send({
                name: 'Login User',
                email: 'login@example.com',
                password: 'password123',
            });
        });

        it('should login successfully with correct credentials', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123',
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('token');
        });

        it('should fail with incorrect password', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'wrongpassword',
                });

            expect(response.status).toBe(401);
        });
    });
});

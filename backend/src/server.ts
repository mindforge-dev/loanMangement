import 'reflect-metadata';
import { app } from './app';
import { env } from './config/env';
import { AppDataSource } from './config/datasource';

const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connected successfully');

        app.listen(env.PORT, () => {
            console.log(`Server running on port ${env.PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();

import 'reflect-metadata';
import { app } from './app';
import { env } from './config/env';
import { AppDataSource } from './config/datasource';

const startServer = async () => {
    const MAX_RETRIES = 5;
    const RETRY_DELAY_MS = 5000;

    for (let i = 1; i <= MAX_RETRIES; i++) {
        try {
            await AppDataSource.initialize();
            console.log('Database connected successfully');

            app.listen(env.PORT, () => {
                console.log(`Server running on port ${env.PORT}`);
            });
            return; // Success, exit the function
        } catch (error) {
            console.error(`Error connecting to database (attempt ${i}/${MAX_RETRIES}):`);
            if (i === MAX_RETRIES) {
                console.error('Max retries reached. Exiting...');
                console.error(error);
                process.exit(1);
            }
            console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        }
    }
};

startServer();

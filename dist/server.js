"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = require("./app");
const env_1 = require("./config/env");
const datasource_1 = require("./config/datasource");
const startServer = async () => {
    const MAX_RETRIES = 5;
    const RETRY_DELAY_MS = 5000;
    for (let i = 1; i <= MAX_RETRIES; i++) {
        try {
            await datasource_1.AppDataSource.initialize();
            console.log('Database connected successfully');
            app_1.app.listen(env_1.env.PORT, () => {
                console.log(`Server running on port ${env_1.env.PORT}`);
            });
            return; // Success, exit the function
        }
        catch (error) {
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

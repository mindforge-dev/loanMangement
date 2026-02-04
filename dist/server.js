"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = require("./app");
const env_1 = require("./config/env");
const datasource_1 = require("./config/datasource");
const startServer = async () => {
    try {
        await datasource_1.AppDataSource.initialize();
        console.log('Database connected successfully');
        app_1.app.listen(env_1.env.PORT, () => {
            console.log(`Server running on port ${env_1.env.PORT}`);
        });
    }
    catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};
startServer();

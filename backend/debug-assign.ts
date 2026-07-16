import 'reflect-metadata';
import { AppDataSource } from './src/config/datasource';
import { authService } from './src/modules/auth/auth.service';

async function main() {
    await AppDataSource.initialize();
    const userId = 'd1687007-a36e-4160-844a-e0ef596b66b1';
    try {
        console.log('Calling assignRoles...');
        const result = await authService.assignRoles(userId, ['loan-officer']);
        console.log('Success:', JSON.stringify(result, null, 2));
    } catch (err: any) {
        console.error('ERROR:', err.constructor.name);
        console.error('Message:', err.message);
        console.error('Stack:', err.stack);
        if (err.query) console.error('Query:', err.query);
        if (err.parameters) console.error('Params:', err.parameters);
        if (err.detail) console.error('Detail:', err.detail);
        if (err.constraint) console.error('Constraint:', err.constraint);
    } finally {
        await AppDataSource.destroy();
    }
}

main();

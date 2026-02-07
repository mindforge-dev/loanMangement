import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AppDataSource } from '../../config/datasource';
import { BaseRepository } from '../../common/base/baseRepository';

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(AppDataSource.getRepository(User));
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repo.findOne({ where: { email } });
    }
}

export const userRepository = new UserRepository();

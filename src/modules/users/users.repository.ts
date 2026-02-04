import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AppDataSource } from '../../config/datasource';

export class UserRepository {
    private repo: Repository<User>;

    constructor() {
        this.repo = AppDataSource.getRepository(User);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repo.findOne({ where: { email } });
    }

    async findById(id: string): Promise<User | null> {
        return this.repo.findOne({ where: { id } });
    }

    async create(userData: Partial<User>): Promise<User> {
        const user = this.repo.create(userData);
        return this.repo.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.repo.find();
    }
}

export const userRepository = new UserRepository();

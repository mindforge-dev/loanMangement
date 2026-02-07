import { userRepository, UserRepository } from './users.repository';
import { User } from './user.entity';
import { ICrudService } from '../../common/base/interfaces/service';

export class UserService implements ICrudService<User> {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = userRepository;
    }

    async create(data: Partial<User>): Promise<User> {
        return this.userRepo.create(data);
    }

    async findAll(): Promise<User[]> {
        return this.userRepo.findAll();
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepo.findById(id);
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        return this.userRepo.update(id, data);
    }

    async delete(id: string): Promise<void> {
        return this.userRepo.delete(id);
    }

    // Alias for existing codebase compatibility
    async getUserById(id: string): Promise<User | null> {
        return this.findById(id);
    }

    async getAllUsers(): Promise<User[]> {
        return this.findAll();
    }
}

export const userService = new UserService();
